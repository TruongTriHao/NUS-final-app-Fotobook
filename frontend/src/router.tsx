import { createBrowserRouter, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { OwnerProtectedLayout } from "./layouts/OwnerProtectedLayout";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { RootLayout } from "./layouts/RootLayout";
import { DiscoverPage } from "./pages/DiscoverPage";
import { EditAlbumPage } from "./pages/EditAlbumPage";
import { EditPhotoPage } from "./pages/EditPhotoPage";
import { EditProfileAdminPage } from "./pages/EditProfileAdminPage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { FeedsPage } from "./pages/FeedsPage";
import { LoginPage } from "./pages/LoginPage";
import { ManageAlbumsPage } from "./pages/ManageAlbumsPage";
import { ManagePhotosPage } from "./pages/ManagePhotosPage";
import { ManageUsersPage } from "./pages/ManageUsersPage";
import { NewAlbumPage } from "./pages/NewAlbumPage";
import { NewPhotoPage } from "./pages/NewPhotoPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignUpPage } from "./pages/SignUpPage";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/discover" replace />,
      },
      { path: "/discover", element: <DiscoverPage /> },
      { path: "/profile/:userId", element: <ProfilePage /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/feeds", element: <FeedsPage /> },
          { path: "/me", element: <ProfilePage /> },
          { path: "/profile/edit", element: <EditProfilePage /> },
          { path: "/photos/new", element: <NewPhotoPage /> },
          {
            path: "/photos/:id/edit",
            element: (
              <OwnerProtectedLayout type="photo">
                <EditPhotoPage />
              </OwnerProtectedLayout>
            ),
          },
          { path: "/albums/new", element: <NewAlbumPage /> },
          {
            path: "/albums/:id/edit",
            element: (
              <OwnerProtectedLayout type="album">
                <EditAlbumPage />
              </OwnerProtectedLayout>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="photos" replace /> },
      { path: "photos", element: <ManagePhotosPage /> },
      { path: "albums", element: <ManageAlbumsPage /> },
      { path: "users", element: <ManageUsersPage /> },
      { path: "users/:id/edit", element: <EditProfileAdminPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
