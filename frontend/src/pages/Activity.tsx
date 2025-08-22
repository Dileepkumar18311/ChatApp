import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, MessageSquare, Users, UserPlus } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "message",
    title: "New message in Log Rocket Group",
    description: "Fahad Jalal: The Roxanna log rocket explains why we really need to consolidate...",
    time: "2 minutes ago",
    avatar: "/src/assets/user-avatar-2.png",
    unread: true
  },
  {
    id: "2",
    type: "dm",
    title: "Direct message from Muhammad Salman",
    description: "Hey! How are you doing?",
    time: "5 minutes ago",
    avatar: "/src/assets/user-avatar-1.png",
    unread: true
  },
  {
    id: "3",
    type: "group",
    title: "Added to HR group",
    description: "You were added to the HR group by Sarah Wilson",
    time: "1 hour ago",
    avatar: "/src/assets/user-avatar-2.png",
    unread: false
  },
  {
    id: "4",
    type: "message",
    title: "New message in General",
    description: "Yashua Parvez: Thanks for the feedback!",
    time: "2 hours ago",
    avatar: "/src/assets/user-avatar-1.png",
    unread: false
  },
  {
    id: "5",
    type: "user",
    title: "New team member",
    description: "Aneeq Akber joined the workspace",
    time: "1 day ago",
    avatar: "/src/assets/user-avatar-2.png",
    unread: false
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "message":
      return <MessageSquare className="h-4 w-4" />
    case "dm":
      return <MessageSquare className="h-4 w-4" />
    case "group":
      return <Users className="h-4 w-4" />
    case "user":
      return <UserPlus className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

export default function Activity() {
  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="h-5 w-5" />
          <h1 className="text-2xl font-semibold">Activity</h1>
        </div>

        <div className="space-y-3">
          {activities.map((activity) => (
            <Card 
              key={activity.id} 
              className={`p-4 transition-colors cursor-pointer ${
                activity.unread ? 'bg-muted/50 border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={activity.avatar} alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-background rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full flex items-center justify-center text-white">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{activity.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                      {activity.unread && (
                        <Badge variant="secondary" className="h-2 w-2 p-0 bg-primary" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {activity.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {activities.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No activity yet</h3>
            <p className="text-sm text-muted-foreground">
              When people mention you or send you messages, you'll see them here.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}