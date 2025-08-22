import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { EnhancedSearch } from "@/components/EnhancedSearch"
import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { UserProvider } from "@/context/UserContext"

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    if (window.location.pathname === '/app') {
      navigate('/app/groups', { replace: true })
    }
  }, [navigate])

  return (
    <UserProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            {/* Top header */}
            <header className="h-14 border-b border-border bg-background flex items-center gap-4 px-4">
              <SidebarTrigger className="h-8 w-8" />
              <div className="flex-1 max-w-md">
                <EnhancedSearch />
              </div>
            </header>
            {/* Main content */}
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  )
}