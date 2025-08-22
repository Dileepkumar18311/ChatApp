import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Smile } from "lucide-react"

interface Reaction {
  emoji: string
  count: number
  users: string[]
  hasReacted: boolean
}

interface MessageReactionsProps {
  messageId: string
  reactions?: Reaction[]
  onReactionAdd?: (messageId: string, emoji: string) => void
  onReactionRemove?: (messageId: string, emoji: string) => void
}

const commonEmojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "👏", "🎉"]

export function MessageReactions({ messageId, reactions = [], onReactionAdd, onReactionRemove }: MessageReactionsProps) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      onReactionRemove?.(messageId, emoji)
    } else {
      onReactionAdd?.(messageId, emoji)
    }
  }

  const handleEmojiSelect = (emoji: string) => {
    onReactionAdd?.(messageId, emoji)
    setIsEmojiPickerOpen(false)
  }

  return (
    <div className="flex items-center gap-1 mt-1">
      {reactions.map((reaction) => (
        <Button
          key={reaction.emoji}
          variant={reaction.hasReacted ? "default" : "secondary"}
          size="sm"
          className="h-6 px-2 text-xs rounded-full"
          onClick={() => handleReactionClick(reaction.emoji, reaction.hasReacted)}
        >
          <span className="mr-1">{reaction.emoji}</span>
          {reaction.count}
        </Button>
      ))}
      
      <Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Plus className="h-3 w-3" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-4 gap-1">
            {commonEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleEmojiSelect(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}