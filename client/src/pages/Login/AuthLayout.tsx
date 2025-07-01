import type { ReactNode } from "react";
import logo from "@assets/logo.png";
import loginImage from "@assets/login.png";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Stânga - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-center px-10 overflow-hidden">
        <img src={logo} alt="CreativeMed Logo" className="h-20 mb-4" />
        {children}
      </div>

      {/* Dreapta - Imagine */}
     <div
  className="w-1/2 bg-[#f63323] relative flex items-end justify-center rounded-l-[50px] overflow-hidden"
>
  <img
    src={loginImage}
    alt="Ilustrație login"
    className="absolute bottom-0 w-auto h-[90%] object-contain"
  />
</div>
    </div>
  );
}