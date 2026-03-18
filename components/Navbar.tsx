"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Menu, LogOut, Github } from "lucide-react";

import useAuth from "@/hooks/useAuth";

type NavbarProps = {
  toggleSidebar: () => void;
  isCollapsed: boolean;
};

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await logout();
      router.replace("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition ${
        scrolled
          ? "bg-black shadow-md"
          : "bg-black"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-6">

          {/* Sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10"
          >
            <Menu size={20} />
          </Button>

          {/* Logo */}
          <span
            onClick={() => router.push("/dashboard")}
            className="font-semibold text-white text-lg cursor-pointer"
          >
            MyApp
          </span>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm text-gray-300">

            <button
              onClick={() => router.push("/products")}
              className="hover:text-white transition"
            >
              Products
            </button>

            <button
              onClick={() => router.push("/company")}
              className="hover:text-white transition"
            >
              Company
            </button>

            <button
              onClick={() => router.push("/resources")}
              className="hover:text-white transition"
            >
              Resources
            </button>

            <button
              onClick={() => router.push("/pricing")}
              className="hover:text-white transition"
            >
              Pricing
            </button>

            <button
              onClick={() => router.push("/contact")}
              className="hover:text-white transition"
            >
              Contact
            </button>

          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 border-gray-700 bg-black text-white hover:bg-gray-900"
          >
            <Github size={16} />
            110k
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            {loading ? "Logging out..." : "Log out"}
          </Button>

        </div>
      </div>
    </nav>
  );
}
