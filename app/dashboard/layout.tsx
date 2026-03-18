"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/sidebar";
import SidebarItem from "@/components/sidebar-item";

import { LayoutDashboard, Users, Settings, BarChart, SquareChartGanttIcon } from "lucide-react";

import PersistLogin from "@/hooks/PersistLogin";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <PersistLogin>
      {/* Top Navbar */}
      <Navbar toggleSidebar={toggleSidebar} isCollapsed={collapsed} />

      {/* Layout below navbar */}
      <div className="flex pt-16">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}>
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            href="/dashboard"
          />

          <SidebarItem icon={Users} label="Users" href="/dashboard/users" />

          <SidebarItem icon={SquareChartGanttIcon} label="Products" href="/dashboard/products"/>

          <SidebarItem
            icon={BarChart}
            label="Analytics"
            href="/dashboard/analytics"
          />

          <SidebarItem
            icon={Settings}
            label="Settings"
            href="/dashboard/settings"
          />
        </Sidebar>

        <main className="flex-1 ml-16 lg:ml-64 p-6">{children}</main>
      </div>
    </PersistLogin>
  );
}
