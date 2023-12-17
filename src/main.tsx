import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// TODO: add routing
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Root from "./routes/root.tsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//   },
// ]);

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
