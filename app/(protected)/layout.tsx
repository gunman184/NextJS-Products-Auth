"use client";
import PersistLogin from "@/hooks/PersistLogin";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PersistLogin>{children}</PersistLogin>;
}
