import React, { useEffect, useRef } from 'react';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@/context/UserContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId?: number;
  groupId?: number;
  messageType: 'text' | 'image' | 'file';
  createdAt: string;
  sender: {
    id: number;
    username: string;
    displayName: string;
    avatar?: string;
  };
}

interface MessageListProps {
  messages: Message[];
  className?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, className }) => {
  const { user } = useUser();
  const { typingUsers } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    console.log('MessageList received messages:', messages);
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className={cn("flex-1 overflow-y-auto p-4 space-y-4", className)}>
      {messages.map((message) => {
        const isOwnMessage = Number(message.senderId) === Number(user?.id);
        
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-[80%]",
              isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={message.sender.avatar} />
              <AvatarFallback className="text-xs">
                {getInitials(message.sender.displayName)}
              </AvatarFallback>
            </Avatar>
            
            <div className={cn("flex flex-col", isOwnMessage ? "items-end" : "items-start")}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-muted-foreground">
                  {isOwnMessage ? 'You' : message.sender.displayName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(message.createdAt)}
                </span>
              </div>
              
              <div
                className={cn(
                  "rounded-lg px-3 py-2 max-w-full break-words",
                  isOwnMessage
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Typing indicators */}
      {typingUsers.length > 0 && (
        <div className="flex gap-3 max-w-[80%] mr-auto">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback className="text-xs">
              {getInitials(typingUsers[0].username)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col items-start">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {typingUsers.length === 1 
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`
              }
            </div>
            
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
