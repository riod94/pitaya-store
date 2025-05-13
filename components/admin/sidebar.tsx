"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Content",
    href: "/admin/content",
    icon: FileText,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          {!collapsed && (
            <Image src="/logo-pitaya-transparan.png" alt="PITAYA" width={120} height={35} className="h-8 w-auto" />
          )}
          {collapsed && (
            <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
              P
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group transition-colors"
            >
              <item.icon className={cn("flex-shrink-0 h-6 w-6", collapsed ? "mx-auto" : "mr-3")} />
              {!collapsed && <span className="font-medium">{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          className={cn(
            "flex items-center text-gray-700 hover:text-red-500 transition-colors",
            collapsed && "justify-center w-full",
          )}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
