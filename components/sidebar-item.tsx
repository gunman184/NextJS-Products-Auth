"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useSidebar } from "./sidebar";
import { cn } from "@/lib/utils";

import { LucideIcon } from "lucide-react";

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

export default function SidebarItem({
  icon: Icon,
  label,
  href,
}: SidebarItemProps) {
  const pathname = usePathname();
  const { expanded } = useSidebar();

  const active = pathname === href;

  const item = (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-primary"
          : "text-muted-foreground hover:bg-muted",
      )}
    >
      <Icon size={18} />

      {expanded && <span>{label}</span>}
    </Link>
  );

  if (expanded) return <li>{item}</li>;

  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>{item}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    </li>
  );
}
