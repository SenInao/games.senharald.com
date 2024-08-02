import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import App from './App';
import Chess from './layout/chess/Chess';
import "./index.css"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "chess",
    element: <Chess/>
  }
])

root.render(
  <RouterProvider router={router}/>
);
