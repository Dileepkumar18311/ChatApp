import jwt from 'jsonwebtoken';
import { Message, User } from '../models/index.js';

// Store active connections
const activeUsers = new Map();

export const handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Authenticate socket connection
    socket.on('authenticate', async (token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await User.findByPk(decoded.id);
        
        if (user) {
          socket.userId = user.id;
          socket.user = user;
          activeUsers.set(user.id, socket.id);
          
          socket.emit('authenticated', { 
            success: true, 
            user: { id: user.id, username: user.username, displayName: user.displayName } 
          });
          
          console.log(`User ${user.username} authenticated`);
        } else {
          socket.emit('authenticated', { success: false, error: 'Invalid token' });
        }
      } catch (error) {
        socket.emit('authenticated', { success: false, error: 'Authentication failed' });
      }
    });

    // Handle sending messages
    socket.on('sendMessage', async (data) => {
      try {
        if (!socket.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const { content, receiverId, groupId } = data;

        // Create message in database
        const message = await Message.create({
          content,
          senderId: socket.userId,
          receiverId: receiverId || null,
          groupId: groupId || null,
          messageType: 'text'
        });

        // Get message with sender info
        const messageWithSender = await Message.findByPk(message.id, {
          include: [
            { model: User, as: 'sender', attributes: ['id', 'username', 'displayName', 'avatar'] },
            { model: User, as: 'receiver', attributes: ['id', 'username', 'displayName'] }
          ]
        });

        // Emit to sender
        socket.emit('messageReceived', messageWithSender);

        // Emit to receiver if it's a direct message
        if (receiverId) {
          const receiverSocketId = activeUsers.get(receiverId);
          if (receiverSocketId) {
            io.to(receiverSocketId).emit('messageReceived', messageWithSender);
          }
        }

        // For group messages, emit to all group members (implement later)
        if (groupId) {
          socket.to(`group_${groupId}`).emit('messageReceived', messageWithSender);
        }

        console.log(`Message sent from ${socket.user.username}: ${content}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle joining conversation/group rooms
    socket.on('joinConversation', (data) => {
      const { receiverId, groupId } = data;
      
      if (receiverId) {
        // Join direct message room
        const roomName = [socket.userId, receiverId].sort().join('_');
        socket.join(roomName);
        console.log(`User ${socket.userId} joined DM room: ${roomName}`);
      }
      
      if (groupId) {
        // Join group room
        socket.join(`group_${groupId}`);
        console.log(`User ${socket.userId} joined group: ${groupId}`);
      }
    });

    // Handle leaving conversation/group rooms
    socket.on('leaveConversation', (data) => {
      const { receiverId, groupId } = data;
      
      if (receiverId) {
        const roomName = [socket.userId, receiverId].sort().join('_');
        socket.leave(roomName);
      }
      
      if (groupId) {
        socket.leave(`group_${groupId}`);
      }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { receiverId, groupId, isTyping } = data;
      
      if (receiverId) {
        const receiverSocketId = activeUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('userTyping', {
            userId: socket.userId,
            username: socket.user.username,
            isTyping
          });
        }
      }
      
      if (groupId) {
        socket.to(`group_${groupId}`).emit('userTyping', {
          userId: socket.userId,
          username: socket.user.username,
          isTyping
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      if (socket.userId) {
        activeUsers.delete(socket.userId);
        console.log(`User ${socket.user?.username || socket.userId} disconnected`);
      }
    });
  });
};
