"use client";

import Button from "./ui/button";
import {
  Activity,
  CircleAlert,
  FileText,
  Home,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavbarItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

const navbarItems: NavbarItem[] = [
  {
    label: "Dashboard",
    icon: <Home />,
    to: "/dashboard",
  },
  {
    label: "Live Risk Feed",
    icon: <Activity/>,
    to: "/"
  },
  {
    label: "Alerts",
    icon: <CircleAlert />,
    to: "/alerts",
  },
  {
    label: "Cases",
    icon: <FileText />,
    to: "/cases",
  }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-[#FAFAFA] border-r border-[#E6E6E6] w-60">
      <div className="flex flex-col justify-center items-center mt-10">
        <div className="h-20">
          <h2 className="text-2xl font-bold">FraudGuard</h2>
          <h5 className="text-[#6B6B73]">Detection Platform</h5>
        </div>
      </div>

      <div className="flex flex-col border-t border-[#E6E6E6] text-[#212120]">
        {navbarItems.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link key={item.to} href={item.to}>
              <Button icon={item.icon} label={item.label} isActive={isActive} />
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-6"></div>
    </header>
  );
}
