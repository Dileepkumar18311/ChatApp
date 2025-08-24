import * as React from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical } from "lucide-react";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";

export default function DirectMessage() {
  const { userId } = useParams();
  const { messages, joinConversation, leaveConversation, loadMessages, clearMessages } = useSocket();
  const { user } = useUser();
  const [otherUser, setOtherUser] = React.useState<any>(null);

  const receiverId = parseInt(userId || '0');

  // Filter messages for this conversation
  const currentUserId = Number(user?.id);
  const conversationMessages = messages.filter(msg => {
    const msgSenderId = Number(msg.senderId);
    const msgReceiverId = Number(msg.receiverId);
    
    // Show messages where current user is either sender or receiver
    // AND the other participant is the target user
    return (
      (msgSenderId === currentUserId && msgReceiverId === receiverId) ||
      (msgSenderId === receiverId && msgReceiverId === currentUserId)
    );
  });

  console.log('Current user ID (parsed):', currentUserId);
  console.log('Receiver ID:', receiverId);
  console.log('All messages:', messages);
  console.log('Filtered conversation messages:', conversationMessages);
  console.log('Message filtering details:', messages.map(msg => ({
    id: msg.id,
    senderId: Number(msg.senderId),
    receiverId: Number(msg.receiverId),
    content: msg.content,
    matches: (Number(msg.senderId) === currentUserId && Number(msg.receiverId) === receiverId) ||
             (Number(msg.senderId) === receiverId && Number(msg.receiverId) === currentUserId)
  })));

  React.useEffect(() => {
    const loadConversation = async () => {
      if (receiverId && user) {
        console.log('Loading conversation for receiverId:', receiverId);
        
        // Clear messages for new conversation
        clearMessages();
        
        // Join the conversation room
        joinConversation(receiverId);
        
        // Fetch user details and conversation history
        await fetchUserDetails();
        await fetchMessages();
      }
    };

    loadConversation();

    return () => {
      if (receiverId) {
        leaveConversation(receiverId);
      }
    };
  }, [receiverId, user]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch the other user's details instead of current user's profile
      const response = await fetch(`http://localhost:3001/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Find the specific user we're chatting with
        const targetUser = data.users.find((u: any) => u.id === receiverId);
        if (targetUser) {
          setOtherUser(targetUser);
        } else {
          // Fallback to placeholder data
          setOtherUser({
            id: receiverId,
            username: `user${receiverId}`,
            displayName: `User ${receiverId}`,
            avatar: null
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('=== FETCH MESSAGES DEBUG ===');
      console.log('Token exists:', !!token);
      console.log('Fetching messages for receiverId:', receiverId);
      console.log('Current user ID:', user?.id);
      console.log('Current user object:', user);
      
      const response = await fetch(`http://localhost:3001/messages/${receiverId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        console.log('Messages count:', data.messages?.length || 0);
        
        // Load messages into Socket context
        if (data.messages && data.messages.length > 0) {
          console.log('Raw messages from API:', data.messages.map(msg => ({
            id: msg.id,
            senderId: msg.senderId,
            receiverId: msg.receiverId,
            content: msg.content,
            sender: msg.sender
          })));
          loadMessages(data.messages);
          console.log('Loaded messages into context');
        } else {
          console.log('No messages found for this conversation');
          loadMessages([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch messages:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {otherUser ? getInitials(otherUser.displayName) : `U${userId}`}
            </span>
          </div>
          <div>
            <h2 className="font-semibold">
              {otherUser?.displayName || `User ${userId}`}
            </h2>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={conversationMessages} />

      {/* Message Input */}
      <MessageInput 
        receiverId={receiverId} 
        placeholder={`Message ${otherUser?.displayName || `User ${userId}`}...`}
      />
    </div>
  );
}