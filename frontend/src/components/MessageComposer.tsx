import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bold, Italic, Link, List, AlignLeft, Code, Plus, Type, Smile, Upload, Mic, Send, Video, Phone } from "lucide-react"
import { FileAttachment } from "./FileAttachment"
import { VideoCallModal } from "./VideoCallModal"

interface MessageComposerProps {
  placeholder?: string
  onSendMessage?: (message: string) => void
  recipientUser?: {
    name: string
    avatar?: string
  }
}

export function MessageComposer({ placeholder = "Message", onSendMessage, recipientUser }: MessageComposerProps) {
  const [message, setMessage] = useState("")
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage?.(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileSelect = (file: File, type: 'image' | 'video' | 'audio' | 'document') => {
    console.log("File selected:", file.name, type)
    // TODO: Handle file upload
  }

  const startVideoCall = () => {
    setIsVideoCallOpen(true)
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 mb-3 pb-2 border-b border-border">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Bold className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Italic className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Link className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <List className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <AlignLeft className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Code className="h-3 w-3" />
          </Button>
        </div>

        {/* Message input area */}
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-2">
            <Input
              placeholder={placeholder}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[40px] resize-none border-border"
            />
            
            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <FileAttachment onFileSelect={handleFileSelect} />
                
                {recipientUser && (
                  <>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={startVideoCall}>
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Phone className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Type className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                onClick={handleSend}
                disabled={!message.trim()}
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Call Modal */}
      <VideoCallModal 
        isOpen={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        participant={recipientUser}
      />
    </div>
  )
}