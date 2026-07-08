import type { ReactNode } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
