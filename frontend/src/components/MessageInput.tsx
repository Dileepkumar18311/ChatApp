import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile } from 'lucide-react';
import { useSocket } from '@/context/SocketContext';
import { useUser } from '@/context/UserContext';

interface MessageInputProps {
  receiverId?: number;
  groupId?: number;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  receiverId,
  groupId,
  placeholder = "Type a message..."
}) => {
  const [message, setMessage] = useState('');
  const { sendMessage, startTyping, stopTyping } = useSocket();
  const { user } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('=== SENDING MESSAGE ===');
      console.log('Message content:', message.trim());
      console.log('Receiver ID:', receiverId);
      console.log('Group ID:', groupId);
      console.log('Current user:', user);
      
      sendMessage(message.trim(), receiverId, groupId);
      setMessage('');
      stopTyping(receiverId, groupId);
    }
  };

  const handleTyping = () => {
    startTyping(receiverId, groupId);
    // Stop typing after 3 seconds of inactivity
    setTimeout(() => stopTyping(receiverId, groupId), 3000);
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm">
          <Paperclip className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (e.target.value) handleTyping();
            }}
            placeholder={placeholder}
            className="pr-10"
          />
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          type="submit" 
          size="sm"
          disabled={!message.trim()}
          className="px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
