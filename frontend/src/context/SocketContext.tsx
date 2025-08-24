import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';

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
  receiver?: {
    id: number;
    username: string;
    displayName: string;
  };
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  messages: Message[];
  sendMessage: (content: string, receiverId?: number, groupId?: number) => void;
  joinConversation: (receiverId?: number, groupId?: number) => void;
  leaveConversation: (receiverId?: number, groupId?: number) => void;
  startTyping: (receiverId?: number, groupId?: number) => void;
  stopTyping: (receiverId?: number, groupId?: number) => void;
  typingUsers: { userId: number; username: string }[];
  loadMessages: (messages: Message[]) => void;
  clearMessages: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<{ userId: number; username: string }[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      // Initialize socket connection
      const newSocket = io('http://localhost:3001');
      setSocket(newSocket);

      // Authenticate with the server
      const token = localStorage.getItem('token');
      if (token) {
        newSocket.emit('authenticate', token);
      }

      // Handle connection events
      newSocket.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      // Handle authentication response
      newSocket.on('authenticated', (data) => {
        if (data.success) {
          console.log('Socket authenticated successfully');
        } else {
          console.error('Socket authentication failed:', data.error);
        }
      });

      // Handle incoming messages
      newSocket.on('messageReceived', (message: Message) => {
        console.log('=== SOCKET MESSAGE RECEIVED ===');
        console.log('New message received:', message);
        console.log('Current messages count before adding:', messages.length);
        setMessages(prev => {
          console.log('Previous messages:', prev);
          const newMessages = [...prev, message];
          console.log('New messages array:', newMessages);
          return newMessages;
        });
      });

      // Handle typing indicators
      newSocket.on('userTyping', (data: { userId: number; username: string; isTyping: boolean }) => {
        setTypingUsers(prev => {
          if (data.isTyping) {
            // Add user to typing list if not already there
            if (!prev.find(u => u.userId === data.userId)) {
              return [...prev, { userId: data.userId, username: data.username }];
            }
            return prev;
          } else {
            // Remove user from typing list
            return prev.filter(u => u.userId !== data.userId);
          }
        });
      });

      // Handle errors
      newSocket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      return () => {
        newSocket.close();
      };
    }
  }, [user]);

  const sendMessage = (content: string, receiverId?: number, groupId?: number) => {
    console.log('=== SOCKET SEND MESSAGE ===');
    console.log('Socket connected:', !!socket);
    console.log('Is connected:', isConnected);
    console.log('Sending message:', { content, receiverId, groupId });
    
    if (socket && isConnected) {
      socket.emit('sendMessage', { content, receiverId, groupId });
      console.log('Message emitted to server');
    } else {
      console.error('Cannot send message - socket not connected');
    }
  };

  const joinConversation = (receiverId?: number, groupId?: number) => {
    if (socket && isConnected) {
      socket.emit('joinConversation', { receiverId, groupId });
    }
  };

  const leaveConversation = (receiverId?: number, groupId?: number) => {
    if (socket && isConnected) {
      socket.emit('leaveConversation', { receiverId, groupId });
    }
  };

  const startTyping = (receiverId?: number, groupId?: number) => {
    if (socket && isConnected) {
      socket.emit('typing', { receiverId, groupId, isTyping: true });
    }
  };

  const stopTyping = (receiverId?: number, groupId?: number) => {
    if (socket && isConnected) {
      socket.emit('typing', { receiverId, groupId, isTyping: false });
    }
  };

  const loadMessages = (messages: Message[]) => {
    console.log('=== SOCKET CONTEXT LOAD MESSAGES ===');
    console.log('Loading messages count:', messages.length);
    console.log('Raw messages:', messages);
    const sortedMessages = messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    console.log('Sorted messages:', sortedMessages);
    setMessages(sortedMessages);
    console.log('Messages set in context');
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        messages,
        sendMessage,
        joinConversation,
        leaveConversation,
        startTyping,
        stopTyping,
        typingUsers,
        loadMessages,
        clearMessages,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
