import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserDashboard } from "@/components/user-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin")
  }

  if (session.user.role === "admin") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <UserDashboard />
    </div>
  )
}
