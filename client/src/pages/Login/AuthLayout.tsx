import type { ReactNode } from "react";

const logo = "/logo.png";
const loginImage = "/login.webp";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden">
      {/* Formular login */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 md:px-10 py-12 bg-background text-foreground">
        <img src={logo} alt="CreativeMed Logo" className="h-16 mb-6" />
        {children}
      </div>

      {/* Imagine decorativa - doar pe desktop */}
      <div className="hidden md:flex w-1/2 bg-[#f63323] relative items-end justify-center overflow-hidden rounded-l-[50px]">
        <img
          src={loginImage}
          alt="Ilustrație login"
          loading="lazy"
          className="absolute bottom-0 w-auto h-[90%] object-contain"
        />
      </div>
    </div>
  );
}