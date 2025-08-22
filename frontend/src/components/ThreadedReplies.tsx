import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MessageSquare, Send } from "lucide-react"
import { MessageReactions } from "./MessageReactions"

interface Reply {
  id: string
  author: string
  avatar?: string
  content: string
  timestamp: string
}

interface ThreadedRepliesProps {
  messageId: string
  replies: Reply[]
  onReplyAdd?: (messageId: string, content: string) => void
}

export function ThreadedReplies({ messageId, replies, onReplyAdd }: ThreadedRepliesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleSendReply = () => {
    if (replyText.trim()) {
      onReplyAdd?.(messageId, replyText)
      setReplyText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendReply()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary">
          <MessageSquare className="h-3 w-3 mr-1" />
          {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Thread</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full mt-6">
          {/* Thread messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {replies.map((reply) => (
              <div key={reply.id} className="group">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarImage src={reply.avatar} alt={reply.author} />
                    <AvatarFallback>{reply.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button className="font-medium text-sm hover:underline">
                        {reply.author}
                      </button>
                      <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                    </div>
                    
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                      {reply.content}
                    </div>
                    
                    <MessageReactions 
                      messageId={reply.id} 
                      reactions={[]}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Reply input */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex gap-2">
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Reply to thread..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendReply} 
                disabled={!replyText.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}