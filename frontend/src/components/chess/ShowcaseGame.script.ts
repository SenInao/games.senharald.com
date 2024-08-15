interface Pos {
  x: number
  y: number
  specialMove?: string
}

interface Move {
  oldPos : Pos
  newPos : Pos
}

const BROWN = "rgba(160,82,45)"
const LIGTH_BRWON = "rgba(196, 164, 132)"

class Piece {
  type: string
  pos: Pos
  firstMove: boolean
  white: boolean
  moveDir : number

  constructor(type : string, pos: Pos, white: boolean) {
    this.type = type
    this.pos = pos
    this.firstMove = true
    this.white = white

    if (this.white) {
      this.moveDir = -1
    } else {
      this.moveDir = 1
    }
  }
}

type Board = (Piece | null)[][]

export default class GameShowcase {
  moves: Move[]
  positionInGame : number
  board : Board = Array.from({length:8}, ()=>Array(8).fill(null))
  context : CanvasRenderingContext2D
  canvas : HTMLCanvasElement
  cellWidth : number
  width : number = 0
  pieceImages: { [key: string]: HTMLImageElement }
  positions : Board[]
  blackPerspective : boolean

  constructor(moves: Move[], context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, blackPerspective : boolean) {
    this.moves = moves
    this.positionInGame = 0
    this.context = context
    this.canvas = canvas
    this.setWidth()
    this.cellWidth = this.width/8
    this.pieceImages = {}
    this.canvas.width = this.width
    this.canvas.height = this.width
    this.blackPerspective = blackPerspective
    this.positions = []

    this.createBoard()
    this.createPositions()

    this.preloadImages()
    this.initEventListeners()
    this.draw()
  }

  initEventListeners() {
    window.addEventListener("keydown", e => {
      if (e.keyCode === 37) {
        this.nextMove()
      } else if (e.keyCode === 39) {
        this.previousMove()
      }
    })

    window.addEventListener("resize", e => {
      this.resize()
    })
  }

  nextMove() {
    if (this.positionInGame === 0) return
    this.positionInGame-=1
    this.board = this.positions[this.positionInGame]
    this.draw()
  }

  previousMove() {
    if (this.positionInGame === this.positions.length-1) return
    this.positionInGame+=1
    this.board = this.positions[this.positionInGame]
    this.draw()
  }

  preloadImages() {
    const pieces = ["K", "Q", "R", "B", "Kn", "P"]
    const colors = ["W", "B"]
    pieces.forEach((piece:string) => {
      colors.forEach((color:string) => {
        const img = new Image()
        img.src = process.env.PUBLIC_URL + "/chess_pieces/" + color + piece + ".png"
        img.onload = () => this.draw()
        this.pieceImages[color + piece] = img
      })
    })
  }

  doMove(move: Move) {
    let piece = this.board[move.oldPos.y][move.oldPos.x]
    if (!piece) return
    if (move.newPos.specialMove === "kingsidecastle") {
      const rook = this.board[piece.pos.y][7]
      if (!rook) return
      this.movePiece(rook, {x: 5, y: rook.pos.y})
    } else if (move.newPos.specialMove === "queensidecastle") {
      const rook = this.board[piece.pos.y][0]
      if (!rook) return
      this.movePiece(rook, {x: 3, y: rook.pos.y})
    } else if (move.newPos.specialMove === "enpassant") {
      this.board[piece.pos.y][move.newPos.x] = null

    } else if (move.newPos.specialMove === "promotion") {
      piece = this.board[piece.pos.y][piece.pos.x] = new Piece("Q", piece.pos, piece.white)
    }

    this.movePiece(piece, move.newPos)
  }

  movePiece(piece : Piece, newPos: Pos) {
    this.board[piece.pos.y][piece.pos.x] = null
    this.board[newPos.y][newPos.x] = piece
    piece.pos = newPos
  }

  createPositions() {
    let boardClone = JSON.parse(JSON.stringify(this.board))
    if (this.blackPerspective) {
      boardClone = this.reverseBoard(boardClone)
    }
    this.positions.push(boardClone)

    for (let i = 0; i < this.moves.length; i++) {
      this.doMove(this.moves[i])
      let boardClone = JSON.parse(JSON.stringify(this.board))
      if (this.blackPerspective) {
        boardClone = this.reverseBoard(boardClone)
      }
      this.positions.push(boardClone)
    }
    this.board = this.positions[0]
  }

  drawPieces() {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col];
        if (!piece) continue

        const img = this.pieceImages[(piece.white ? "W" : "B") + piece.type];
        this.context.rect(piece.pos.x * this.cellWidth, piece.pos.y * this.cellWidth, 10, 10)
        this.context.drawImage(
          img,
          piece.pos.x * this.cellWidth,
          piece.pos.y * this.cellWidth,
          this.cellWidth,
          this.cellWidth
        );
      }
    }
  }

  reverseBoard(board: Board) {
    const newArr : (Piece | null)[][] = Array.from({length:8}, () => Array(8).fill(null))
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        const piece = board[y][x]
        if (!piece) continue

        piece.pos.x = this.reverseValue(piece.pos.x)
        piece.pos.y = this.reverseValue(piece.pos.y)

        newArr[piece.pos.y][piece.pos.x] = piece
      }
    }

    return newArr
  }

  reverseValue(value: number) {
    return Math.abs(value - 7)
  }

  drawBoard() {
    const rows = 8
    const cols = 8

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * this.cellWidth;
        const y = row * this.cellWidth;

        this.context.beginPath();
        this.context.rect(x, y, this.cellWidth, this.cellWidth);

        if ((row + col) % 2 === 0) {
          this.context.fillStyle = LIGTH_BRWON;
        } else {
          this.context.fillStyle = BROWN;
        }

        this.context.fill();
        this.context.closePath();
      }
    }
  }

  draw() {
    this.context.clearRect(0, 0, this.width, this.width);
    this.drawBoard();
    this.drawPieces();
  }

  setWidth() {
    if (window.innerWidth < 780 && window.innerWidth < window.innerHeight*0.7) {
      this.width = window.innerWidth
    } else {
      this.width = window.innerHeight * 0.7
    }
  }

  resize() {
    this.setWidth()
    this.cellWidth = this.width/8
    this.canvas.width = this.width
    this.canvas.height = this.width
    this.draw()
  }

  createBoard() {
    for (let x = 0; x < 8; x++) {
      this.board[1][x] = new Piece("P", {x:x, y:1}, false)
    }
    for (let x = 0; x < 8; x++) {
      this.board[6][x] = new Piece("P", {x:x, y:6}, true)
    }

    this.board[0][7] = new Piece("R", {x:7, y:0}, false)
    this.board[0][0] = new Piece("R", {x:0, y:0}, false)
    this.board[7][7] = new Piece("R", {x:7, y:7}, true)
    this.board[7][0] = new Piece("R", {x:0, y:7}, true)

    this.board[0][6] = new Piece("Kn", {x: 6, y:0}, false)
    this.board[7][6] = new Piece("Kn", {x: 6, y:7}, true)
    this.board[0][1] = new Piece("Kn", {x: 1, y:0}, false)
    this.board[7][1] = new Piece("Kn", {x: 1, y:7}, true)

    this.board[0][5] = new Piece("B", {x: 5,y: 0}, false)
    this.board[7][5] = new Piece("B", {x: 5,y: 7}, true)
    this.board[0][2] = new Piece("B", {x: 2,y: 0}, false)
    this.board[7][2] = new Piece("B", {x: 2,y: 7}, true)

    this.board[0][4] = new Piece("K", {x:4, y:0}, false)
    this.board[7][4] = new Piece("K", {x:4, y:7}, true)

    this.board[0][3] = new Piece("Q", {x:3, y:0}, false)
    this.board[7][3] = new Piece("Q", {x:3, y:7}, true)
  }
}
