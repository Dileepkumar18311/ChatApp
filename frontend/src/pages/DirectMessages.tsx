import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"

const directMessages = [
  { 
    name: "Muhammad Salman", 
    avatar: "/src/assets/user-avatar-1.png", 
    status: "online",
    lastMessage: "Hey! How are you doing?",
    timestamp: "10:30am",
    unread: false
  },
  { 
    name: "Fahad Jalal", 
    avatar: "/src/assets/user-avatar-2.png", 
    status: "away",
    lastMessage: "Let's discuss the project updates",
    timestamp: "Yesterday",
    unread: true
  },
  { 
    name: "Yashua Parvez", 
    avatar: "/src/assets/user-avatar-1.png", 
    status: "offline",
    lastMessage: "Thanks for the feedback!",
    timestamp: "2 days ago",
    unread: false
  },
  { 
    name: "Aneeq Akber", 
    avatar: "/src/assets/user-avatar-2.png", 
    status: "online",
    lastMessage: "Great work on the presentation",
    timestamp: "3 days ago",
    unread: false
  }
]

export default function DirectMessages() {
  const navigate = useNavigate()

  const handleUserClick = (name: string) => {
    const userId = name.toLowerCase().replace(' ', '-')
    navigate(`/app/dm/${userId}`)
  }

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Direct Messages</h1>

        <div className="space-y-2">
          {directMessages.map((user) => (
            <Card 
              key={user.name}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
              onClick={() => handleUserClick(user.name)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                    user.status === 'online' ? 'bg-green-500' : 
                    user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm text-foreground">{user.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{user.timestamp}</span>
                      {user.unread && (
                        <Badge variant="secondary" className="h-2 w-2 p-0 bg-primary" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}