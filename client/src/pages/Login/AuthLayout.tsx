import type { ReactNode } from 'react';

const logo = '/logo.png';
const loginImage = '/login.webp';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden md:flex-row">
      {/* Formular login */}
      <div className="bg-background text-foreground flex flex-1 flex-col items-center justify-center px-6 py-12 md:px-10">
        <img src={logo} alt="CreativeMed Logo" loading="lazy" className="mb-6 h-16" />
        {children}
      </div>

      {/* Imagine decorativa - doar pe desktop */}
      <div className="relative hidden w-1/2 items-end justify-center overflow-hidden rounded-l-[50px] bg-[#f63323] md:flex">
        <img
          src={loginImage}
          alt="Ilustrație login"
          loading="lazy"
          className="absolute bottom-0 h-[90%] w-auto object-contain"
        />
      </div>
    </div>
  );
}
