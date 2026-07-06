import { Outlet } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Sidebar } from "../components/common/Sidebar";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Sidebar type="user" />
      <main className="flex flex-col bg-white ml-[15%] mt-17 md:mt-22 shadow-lg max-w-full md:max-w-[70%]">
        <Outlet />
      </main>
    </>
  );
}
