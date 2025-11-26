"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/navbar/page";
import Footer from "./components/footer/page";

export default function LayoutController({ children }) {
  const pathname = usePathname();

  // Routes where Navbar + Footer should be hidden
  const hideLayout =
    pathname === "/pages/sellcar" ||
    pathname === "/pages/MainDashboard"

  return (
    <>
      {!hideLayout && <Navbar />}
      <main>{children}</main>
      {!hideLayout && <Footer />}
    </>
  );
}
