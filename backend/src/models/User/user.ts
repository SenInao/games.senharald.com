import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullname: {
			type:String,
			required: true,
		},
		username: {
			type:String,
			required: true,
		},
		email: {
			type:String,
			required:true,
		},
		password: {
			type:String,
			required:true,
		},
    profilePicture: {
      type:String,
      required:false,
    },
    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref:"User",
			}
		],
		chats: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref:"Chat",
			}
		],
    previousGames: [
      {
        moves: [
          {
            x: Number,
            y: Number,
          }
        ],
        winner: {
          type : String,
          reqired: true
        },
        player1: {
          type : String,
          required : true
        },
        player2: {
          type : String,
          required : true
        },
        date: {
          type : Date,
          default: Date.now
        }
      }
    ]
	}
);

const User = mongoose.model("User", userSchema);

export default User;
