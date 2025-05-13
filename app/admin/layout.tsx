import type { ReactNode } from "react"
import AdminSidebar from "@/components/admin/sidebar"
import AdminHeader from "@/components/admin/header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-auto">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
