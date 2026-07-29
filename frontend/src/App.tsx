import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthProvider";
import { router } from "./router";

export function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" duration={2000} closeButton richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
