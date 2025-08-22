import { MessageThread } from "@/components/MessageThread"
import { MessageComposer } from "@/components/MessageComposer"
import { useParams } from "react-router-dom"

const userProfiles = {
  "muhammad-salman": {
    name: "Muhammad Salman",
    avatar: "/src/assets/user-avatar-1.png",
    status: "online"
  },
  "fahad-jalal": {
    name: "Fahad Jalal",
    avatar: "/src/assets/user-avatar-2.png",
    status: "away"
  },
  "yashua-parvez": {
    name: "Yashua Parvez",
    avatar: "/src/assets/user-avatar-1.png",
    status: "offline"
  },
  "aneeq-akber": {
    name: "Aneeq Akber",
    avatar: "/src/assets/user-avatar-2.png",
    status: "online"
  }
}

export default function DirectMessage() {
  const { userId } = useParams()
  const user = userProfiles[userId as keyof typeof userProfiles]

  if (!user) {
    return <div className="flex-1 flex items-center justify-center">User not found</div>
  }

  const mockMessages = [
    {
      id: "1",
      author: user.name,
      avatar: user.avatar,
      content: "Hey! How are you doing?",
      timestamp: "10:30am",
      reactions: [
        { emoji: "👍", count: 2, users: ["You", "John"], hasReacted: true }
      ]
    },
    {
      id: "2",
      author: "You",
      avatar: "/src/assets/user-avatar-1.png",
      content: "I'm doing great! How about you?",
      timestamp: "10:32am",
      replies: 1,
      threadReplies: [
        {
          id: "reply-1",
          author: user.name,
          avatar: user.avatar,
          content: "That's awesome to hear!",
          timestamp: "10:33am"
        }
      ]
    }
  ]

  return (
    <div className="flex-1 flex flex-col">
      <MessageThread 
        messages={mockMessages}
        showProfile={true}
        profileUser={user}
        description={`This conversation is between @${user.name} and you. Checkout their profile to know more about them.`}
      />
      <MessageComposer 
        placeholder={`Message ${user.name}`} 
        recipientUser={user}
      />
    </div>
  )
}