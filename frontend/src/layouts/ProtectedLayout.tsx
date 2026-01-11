import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="p-6">
        <Outlet />
      </main>
    </>
  );
}
