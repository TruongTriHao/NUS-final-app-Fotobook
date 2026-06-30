import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";

export function AuthLayout() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col items-center mt-17 md:mt-22 shadow-lg">
        <Outlet />
      </main>
    </>
  );
}
