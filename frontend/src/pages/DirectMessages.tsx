import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

interface User {
  id: number;
  username: string;
  displayName: string;
  avatar?: string;
  status?: string;
}

export default function DirectMessages() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:3001/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserClick = (userId: number) => {
    navigate(`/app/dm/${userId}`)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  return (
    <div className="flex-1 p-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Direct Messages</h1>

        {loading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <Card 
                key={user.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-card border-border"
                onClick={() => handleUserClick(user.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar} alt={user.displayName} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      user.status === 'online' ? 'bg-green-500' : 
                      user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-foreground">{user.displayName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">@{user.username}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      Click to start conversation
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}