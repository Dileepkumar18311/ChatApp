import { MessageThread } from "@/components/MessageThread"
import { MessageComposer } from "@/components/MessageComposer"
import { useParams } from "react-router-dom"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Users } from "lucide-react"

const mockMessages = [
  {
    id: "1",
    author: "Aneeq Akber",
    avatar: "/src/assets/user-avatar-1.png",
    content: "Based on Log rocket, These are the things I believe the two searches need to handle:\nCompany Search:\nSingle Company Name, List of Company names copy pasted (Comma separated or space separated or enter separated), Prompt, List uploaded with Company names.",
    timestamp: "09:45am",
    replies: 2,
    reactions: [
      { emoji: "👍", count: 3, users: ["Fahad", "Muhammad", "You"], hasReacted: false },
      { emoji: "🎯", count: 1, users: ["Iman"], hasReacted: false }
    ],
    threadReplies: [
      {
        id: "thread-1-1",
        author: "Fahad Jalal",
        avatar: "/src/assets/user-avatar-2.png",
        content: "Great analysis! This covers all our use cases.",
        timestamp: "09:46am"
      },
      {
        id: "thread-1-2",
        author: "Muhammad Salman",
        avatar: "/src/assets/user-avatar-1.png",
        content: "Agreed, we should prioritize the single search bar approach.",
        timestamp: "09:47am"
      }
    ]
  },
  {
    id: "2",
    author: "Fahad Jalal",
    avatar: "/src/assets/user-avatar-2.png",
    content: "The Roxanna log rocket explains why we really need to consolidate and move to a single search bar.\nIts imperative for us to go to a single search bar experience where everything just shows in a single search bar experience.\nGood Work! @Imantariq",
    timestamp: "09:47am"
  },
  {
    id: "3",
    author: "Ashir Manzoor",
    avatar: "/src/assets/user-avatar-1.png",
    content: "Are you following up on these tickets being created?",
    timestamp: "09:52am"
  },
  {
    id: "4",
    author: "Iman Tariq",
    avatar: "/src/assets/user-avatar-2.png",
    content: "Yes, we are working on these tickets and I will get it updated by EOD.",
    timestamp: "09:52am"
  },
  {
    id: "5",
    author: "Muhammad Salman",
    avatar: "/src/assets/user-avatar-1.png",
    content: "The Roxanna log rocket explains why we really need to consolidate and move to a single search bar.\nIts imperative for us to go to a single search bar experience where everything just shows in a single search bar experience.\nGood Work! @Imantariq",
    timestamp: "09:53am"
  },
  {
    id: "6",
    author: "Ashir Manzoor",
    avatar: "/src/assets/user-avatar-2.png",
    content: "Following up on these tickets.",
    timestamp: "09:57am"
  }
]

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