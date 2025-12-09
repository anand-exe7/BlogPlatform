import React, { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Club Blog Platform",
  description: "Blog platform for club members with admin approval workflow"
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
