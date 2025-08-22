import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Reply, MessageSquare } from "lucide-react"
import { UserProfile } from "@/components/UserProfile"
import { MessageReactions } from "./MessageReactions"
import { ThreadedReplies } from "./ThreadedReplies"

interface Message {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
  replies?: number
  reactions?: Array<{
    emoji: string
    count: number
    users: string[]
    hasReacted: boolean
  }>
  threadReplies?: Array<{
    id: string
    author: string
    avatar?: string
    content: string
    timestamp: string
  }>
}

interface MessageThreadProps {
  messages: Message[]
  title?: string
  description?: string
  showProfile?: boolean
  profileUser?: {
    name: string
    avatar?: string
    status?: string
  }
}

export function MessageThread({ messages, title, description, showProfile, profileUser }: MessageThreadProps) {
  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* Header */}
      {(title || showProfile) && (
        <div className="border-b border-border p-4">
          {showProfile && profileUser ? (
            <div className="flex flex-col items-center text-center space-y-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
                <AvatarFallback>{profileUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {profileUser.name}
                  {profileUser.status === 'online' && (
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
                <UserProfile 
                  user={profileUser}
                  isEditable={false}
                  trigger={
                    <Button variant="outline" size="sm" className="mt-3">
                      View Profile
                    </Button>
                  }
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold">{title}</h2>
              {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group hover:bg-muted/50 -mx-4 px-4 py-2 rounded">
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarImage src={message.avatar} alt={message.author} />
                <AvatarFallback>{message.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <UserProfile 
                    user={{ 
                      name: message.author, 
                      avatar: message.avatar,
                      id: message.author.toLowerCase().replace(' ', '-')
                    }}
                    isEditable={false}
                    trigger={
                      <button className="font-medium text-sm hover:underline">
                        {message.author}
                      </button>
                    }
                  />
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Message reactions */}
                <MessageReactions 
                  messageId={message.id}
                  reactions={message.reactions || []}
                />
                
                {/* Thread replies */}
                {message.replies && message.replies > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <ThreadedReplies 
                      messageId={message.id}
                      replies={message.threadReplies || []}
                    />
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      <Reply className="h-3 w-3 mr-1" />
                      Reply in thread
                    </Button>
                  </div>
                )}
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}