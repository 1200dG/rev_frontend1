"use client";
import AuthProvider from "../context/AuthProvider";
import { AppProvider } from "../context/AppProvider";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <AppProvider>
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
