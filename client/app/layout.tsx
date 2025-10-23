<<<<<<< HEAD
import React, { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Club Blog Platform",
  description: "Blog platform for club members with admin approval workflow"
=======

import React, { ReactNode } from "react";

export const metadata = {
  title: "Simple Club Blog",
  description: "Club blog platform"
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
<<<<<<< HEAD
    <html lang="en">
      <body>
        {children}
=======
    <html>
      <body>
        <main style={{ padding: 24 }}>{children}</main>
>>>>>>> 5f9e4a115489d823fb1bd7fd4a91f6fbed6c587b
      </body>
    </html>
  );
}
