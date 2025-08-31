import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.scss";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import LoginPage from "@/pages/auth/login";
import { App } from "antd";
import { AppProvider } from "components/context/app.context";
import Room from "components/content/room/room";
import RoomDetail from "components/content/room/detail";
import Vehicle from "components/content/room/vehicle";
import ProtectedRoute from "components/auth";
import Resident from "components/content/resident";
import Revenue from "components/content/revenue";
import Dashboard from "components/content/dashboard/dashboard";
import Statistic from "components/content/statistic";
import DetailCollectionPeriod from "./components/content/statistic/detail";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: <div>user page</div>,
      },
      {
        path: "room",
        element: (
          <ProtectedRoute>
            <Room />
          </ProtectedRoute>
        ),
      },
      {
        path: "room/:roomNumber",
        element: (
          <ProtectedRoute>
            <RoomDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "room/vehicle/:roomNumber",
        element: (
          <ProtectedRoute>
            <Vehicle />
          </ProtectedRoute>
        ),
      },
      {
        path: "resident",
        element: (
          <ProtectedRoute>
            <Resident />
          </ProtectedRoute>
        ),
      },
      {
        path: "revenue",
        element: (
          <ProtectedRoute>
            <Revenue />
          </ProtectedRoute>
        ),
      },
      {
        path: "statistic",
        element: (
          <ProtectedRoute>
            <Statistic />
          </ProtectedRoute>
        ),
      },
      {
        path: "statistic/:code",
        element: (
          <ProtectedRoute>
            <DetailCollectionPeriod />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <div>register page</div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </App>
  </StrictMode>
);
