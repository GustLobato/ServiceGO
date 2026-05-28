import { type ReactNode } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

interface PublicLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const PublicLayout = ({ children, hideFooter = false }: PublicLayoutProps) => (
  <div className="min-h-screen bg-background overflow-x-hidden">
    <Navbar />
    <main>{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

export default PublicLayout;
