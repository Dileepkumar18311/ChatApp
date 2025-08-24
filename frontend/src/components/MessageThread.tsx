import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageReactions } from "@/components/MessageReactions";
import { ThreadedReplies } from "@/components/ThreadedReplies";
import { UserProfile } from "@/components/UserProfile";
import { MessageCircle, MoreHorizontal, User } from "lucide-react";

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  replies?: number;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
    hasReacted: boolean;
  }>;
  threadReplies?: Array<{
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
  }>;
}

interface MessageThreadProps {
  messages: Message[];
  showProfile?: boolean;
  profileUser?: {
    name: string;
    avatar: string;
    status: string;
  };
  description?: string;
}

export function MessageThread({ 
  messages, 
  showProfile = false, 
  profileUser, 
  description 
}: MessageThreadProps) {
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [showUserProfile, setShowUserProfile] = useState(false);

  const toggleThread = (messageId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedThreads(newExpanded);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Profile section for direct messages */}
      {showProfile && profileUser && (
        <div className="border-b border-border p-6 bg-background">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profileUser.avatar} alt={profileUser.name} />
              <AvatarFallback>
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-primary">{profileUser.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setShowUserProfile(true)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <div className="flex gap-3 hover:bg-muted/50 p-2 rounded-lg transition-colors">
              <Avatar className="h-10 w-10 mt-1">
                <AvatarImage src={message.avatar} alt={message.author} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-primary text-sm">
                    {message.author}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </span>
                </div>
                
                <div className="text-sm text-foreground whitespace-pre-wrap">
                  {message.content}
                </div>
                
                {/* Reactions */}
                {message.reactions && message.reactions.length > 0 && (
                  <div className="mt-2">
                    <MessageReactions messageId={message.id} reactions={message.reactions} />
                  </div>
                )}
                
                {/* Thread replies button */}
                {message.replies && message.replies > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 h-auto p-1 text-xs text-muted-foreground hover:text-primary"
                    onClick={() => toggleThread(message.id)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    {message.replies} {message.replies === 1 ? 'reply' : 'replies'}
                  </Button>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-auto p-1"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Expanded thread replies */}
            {expandedThreads.has(message.id) && message.threadReplies && (
              <div className="ml-12 mt-2">
                <ThreadedReplies 
                  messageId={message.id}
                  replies={message.threadReplies}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* User Profile Modal */}
      {showUserProfile && profileUser && (
        <UserProfile
          user={{
            id: "1",
            name: profileUser.name,
            email: `${profileUser.name.toLowerCase().replace(" ", ".")}@example.com`,
            avatar: profileUser.avatar,
            status: profileUser.status
          }}
          trigger={null}
          isEditable={false}
        />
      )}
    </div>
  );
}
