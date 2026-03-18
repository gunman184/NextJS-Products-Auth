"use client";

import { createContext, useContext, ReactNode } from "react";
import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SidebarContext = createContext({
  expanded: true,
});

export function useSidebar() {
  return useContext(SidebarContext);
}

type SidebarProps = {
  children: ReactNode;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
};

export default function Sidebar({
  children,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const expanded = !collapsed;
  const { auth } = useAuth();
  const user = auth?.user;
  console.log(user?.name);
  return (
    <aside
      className={cn(
        "fixed top-16 left-0 h-[calc(100vh-4rem)] border-r bg-background transition-all",
        expanded ? "w-64" : "w-16",
      )}
    >
      <nav className="flex h-full flex-col">
        {/* Collapse button */}
        <div className="flex justify-end p-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
        </div>

        {/* User */}
        <div className="flex items-center gap-3 border-b p-3">
          <Avatar>
            <AvatarImage src={user?.image} />
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          </Avatar>

          {expanded && (
            <div className="flex flex-1 items-center justify-between">
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>

                {user?.role && (
                  <Badge className="mt-1 text-[10px]">{user.role}</Badge>
                )}
              </div>

              <MoreVertical size={16} />
            </div>
          )}
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 space-y-1 p-2">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}
