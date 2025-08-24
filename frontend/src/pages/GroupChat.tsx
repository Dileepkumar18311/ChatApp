import { MessageThread } from "@/components/MessageThread"
import { MessageComposer } from "@/components/MessageComposer"
import { useParams } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

// Group messages will be loaded from the real-time messaging system
const mockMessages: any[] = []

const groupInfo = {
  "log-rocket": {
    title: "Log Rocket Group",
    description: "@Fahad Jalal created this group on January 3rd. This is the very beginning of the Log Rocket Group",
    members: 9
  },
  "random": {
    title: "Random",
    description: "Random conversations and discussions",
    members: 5
  },
  "general": {
    title: "General",
    description: "General company discussions",
    members: 12
  },
  "hr": {
    title: "HR",
    description: "Human resources discussions",
    members: 8
  }
}

export default function GroupChat() {
  const { groupId } = useParams()
  const group = groupInfo[groupId as keyof typeof groupInfo]

  if (!group) {
    return <div className="flex-1 flex items-center justify-center">Group not found</div>
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Group header */}
      <div className="border-b border-border p-4 bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-primary"># {group.title}</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{group.members}</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
      </div>

      <MessageThread messages={mockMessages} />
      <MessageComposer placeholder={`Message ${group.title}`} />
    </div>
  )
}