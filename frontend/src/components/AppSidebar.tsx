import { useState, useEffect } from "react"
import { Home, Bell, MessageSquare, MoreHorizontal, Users, Hash, Plus, ChevronDown, ChevronRight, User } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { UserProfile } from "@/components/UserProfile"
import { useUser } from "@/context/UserContext"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Home", url: "/app", icon: Home },
  { title: "Activity", url: "/app/activity", icon: Bell },
  { title: "DMs", url: "/app/direct-messages", icon: MessageSquare },
  { title: "More", url: "/app/more", icon: MoreHorizontal },
]

const groups = [
  { title: "Log Rocket Updates", url: "/app/groups/log-rocket", members: 9 },
  { title: "Random", url: "/app/groups/random", members: 5 },
  { title: "General", url: "/app/groups/general", members: 12 },
  { title: "HR", url: "/app/groups/hr", members: 8 },
]

export function AppSidebar() {
  const { open } = useSidebar()
  const { user } = useUser()
  const location = useLocation()
  const currentPath = location.pathname
  const [groupsExpanded, setGroupsExpanded] = useState(true)
  const [dmsExpanded, setDmsExpanded] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const collapsed = !open

  // Fetch all users for direct messages
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.token) return
      
      try {
        const response = await fetch('http://localhost:3001/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUsers(data.users || [])
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [user?.token])

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path)
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"

  return (
    <Sidebar
      className={`${collapsed ? "w-14" : "w-64"} bg-card border-r border-border`}
      collapsible="icon"
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          {!collapsed && <span className="font-semibold text-foreground">QLU Recruiting</span>}
        </div>
      </div>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between px-2 py-2">
                <button 
                  onClick={() => setGroupsExpanded(!groupsExpanded)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {groupsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <Users className="h-3 w-3" />
                  Groups
                </button>
              </SidebarGroupLabel>
              {groupsExpanded && (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {groups.map((group) => (
                      <SidebarMenuItem key={group.title}>
                        <SidebarMenuButton asChild>
                          <NavLink to={group.url} className="text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                            <Hash className="h-3 w-3 shrink-0" />
                            <span className="truncate">{group.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center justify-between px-2 py-2">
                <button 
                  onClick={() => setDmsExpanded(!dmsExpanded)}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {dmsExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  <MessageSquare className="h-3 w-3" />
                  Direct Messages
                </button>
              </SidebarGroupLabel>
              {dmsExpanded && (
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {users.map((user) => (
                      <SidebarMenuItem key={user.id}>
                        <SidebarMenuButton asChild>
                          <NavLink to={`/app/dm/${user.id}`} className="text-muted-foreground hover:bg-muted/50 hover:text-foreground">
                            <div className="relative">
                              <User className="h-3 w-3" />
                              <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                                user.status === 'online' ? 'bg-green-500' : 
                                user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                              }`} />
                            </div>
                            <span className="truncate">{user.displayName || user.username}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <div className="mt-auto p-2 border-t border-border">
        <UserProfile 
          isEditable={true}
          trigger={
            <button className="w-full flex items-center gap-2 p-2 hover:bg-muted/50 rounded transition-colors">
              <User className="h-6 w-6 text-muted-foreground" />
              {!collapsed && <span className="text-sm text-muted-foreground">You</span>}
            </button>
          }
        />
      </div>
    </Sidebar>
  )
}