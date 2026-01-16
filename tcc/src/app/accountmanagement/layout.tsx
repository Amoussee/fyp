import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Account Management | The Circular Classroom",
  description: "Manage your accounts and groups",
}

export default function AccountManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
