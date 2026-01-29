import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { messagesAPI, usersAPI } from '../services/api.js';

function Messages({ onNavigate }) {
  const user = useSelector(state => state.auth.user);
  const [socket, setSocket] = useState(null);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeUsers, setActiveUsers] = useState(new Set());
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [hoveredMessageId, setHoveredMessageId] = useState(null);

  // Fetch users for chat when component loads
  useEffect(() => {
    if (!user) return;
    
    const fetchUsers = async () => {
      setLoadingChats(true);
      try {
        const response = await usersAPI.getUsersForChat();
        const users = response.data || [];
        // Add avatar URLs if not present
        const usersWithAvatar = users.map((u, idx) => ({
          ...u,
          avatar: u.profilePicture || `https://i.pravatar.cc/150?img=${idx}`,
          isActive: activeUsers.has(u._id) // Check if user is in active set
        }));
        setChats(usersWithAvatar);
      } catch (error) {
        console.error('Error fetching users:', error);
        setChats([]);
      } finally {
        setLoadingChats(false);
      }
    };
    
    fetchUsers();
  }, [user, activeUsers]);

  // Socket.io setup for realtime chat
  useEffect(() => {
    if (!user) return;
    
    const SOCKET_URL = process.env.NODE_ENV === 'production' 
      ? 'https://api.dhvanicast.com'
      : 'https://api.dhvanicast.com';
    
    const newSocket = io(SOCKET_URL, {
      auth: { userId: user._id || user.id },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to chat server');
      // Join personal room
      newSocket.emit('join', user._id || user.id);
      console.log('📍 Joined room:', user._id || user.id);
    });

    // Receive list of all currently active users
    newSocket.on('active_users_list', (data) => {
      console.log('📨 Received active users list:', data.users);
      const usersSet = new Set(data.users);
      setActiveUsers(usersSet);
      // Update chats with active status
      setChats(prev => prev.map(chat => ({
        ...chat,
        isActive: usersSet.has(chat._id)
      })));
    });

    // Real-time message received - update UI instantly
    newSocket.on('receive_message', (data) => {
      console.log('📨 Real-time message received:', data);
      
      // Message key is the sender's ID (person who sent the message)
      const conversationKey = data.sender;
      
      // Update messages for this conversation
      setChatMessages(prev => ({
        ...prev,
        [conversationKey]: [...(prev[conversationKey] || []), {
          id: data._id || Date.now(),
          sender: 'them',
          text: data.content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]
      }));
      
      // If this message is from the current selected chat, scroll to bottom
      if (selectedChat && selectedChat._id === data.sender) {
        setTimeout(() => {
          const messagesContainer = document.querySelector('[data-messages-container]');
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      }
    });

    // Message sent confirmation - update sender's UI
    newSocket.on('message_sent', (data) => {
      console.log('✅ Message sent confirmation received:', data);
      console.log('📝 Message confirmed sent to:', data.receiver);
    });

    // Typing indicator
    newSocket.on('user_typing', (data) => {
      console.log('✍️ User typing:', data.userName);
    });

    // User comes online
    newSocket.on('user_online', (data) => {
      console.log('🟢 User online:', data.userId);
      setActiveUsers(prev => new Set([...prev, data.userId]));
      // Update chats to show this user as active
      setChats(prev => prev.map(chat => 
        chat._id === data.userId ? { ...chat, isActive: true } : chat
      ));
    });

    // Message delivered confirmation
    newSocket.on('message_delivered', (data) => {
      console.log('✓ Message delivered:', data.messageId);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from chat server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(newSocket);
    
    return () => {
      newSocket.off('active_users_list');
      newSocket.off('receive_message');
      newSocket.off('message_sent');
      newSocket.off('user_online');
      newSocket.off('user_typing');
      newSocket.off('message_delivered');
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.disconnect();
    };
  }, [user]);

  // Load messages when chat is selected
  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setLoadingMessages(true);

    try {
      const response = await messagesAPI.getMessages(chat._id);
      const messages = response.data || [];
      
      setChatMessages(prev => ({
        ...prev,
        [chat._id]: messages.map(msg => ({
          id: msg._id,
          sender: msg.sender._id === user._id ? 'you' : 'them',
          text: msg.content,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }))
      }));
    } catch (error) {
      console.error('Error loading messages:', error);
      setChatMessages(prev => ({
        ...prev,
        [chat._id]: []
      }));
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat) return;

    setSendingMessage(true);
    const messageText = messageInput;
    
    console.log('📤 Sending message...');
    console.log('From User ID:', user._id || user.id);
    console.log('To User ID:', selectedChat._id);
    console.log('Socket connected:', socket?.connected);
    console.log('Message:', messageText);
    
    try {
      // Add message to UI immediately (optimistic update)
      const tempMessage = {
        id: Date.now(),
        sender: 'you',
        text: messageText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages(prev => ({
        ...prev,
        [selectedChat._id]: [...(prev[selectedChat._id] || []), tempMessage]
      }));

      // Clear input immediately
      setMessageInput('');

      // Send via API to save to DB
      const apiResponse = await messagesAPI.sendMessage({
        receiver: selectedChat._id,
        content: messageText
      });
      console.log('✅ Message saved to DB:', apiResponse.data);

      // Send via socket for realtime delivery to other user
      if (socket && socket.connected) {
        socket.emit('send_message', {
          sender: user._id || user.id,
          receiver: selectedChat._id,
          content: messageText,
          _id: apiResponse.data?._id
        });
        console.log('✅ Message emitted via Socket.io to receiver');
      } else {
        console.warn('⚠️ Socket not connected, message saved via API only');
      }

      // Update last message in chat list
      setChats(prev => prev.map(chat => 
        chat._id === selectedChat._id 
          ? { ...chat, lastMessage: messageText, time: 'just now' }
          : chat
      ));

    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
      // Remove the optimistic message on error
      setChatMessages(prev => ({
        ...prev,
        [selectedChat._id]: (prev[selectedChat._id] || []).slice(0, -1)
      }));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (editingMessageId) {
        handleUpdateMessage();
      } else {
        handleSendMessage();
      }
    }
  };

  const handleEditMessage = (messageId, text) => {
    setEditingMessageId(messageId);
    setEditingText(text);
  };

  const handleUpdateMessage = async () => {
    if (!editingText.trim() || !editingMessageId) return;

    try {
      await messagesAPI.updateMessage(editingMessageId, { content: editingText });
      
      // Update UI
      setChatMessages(prev => ({
        ...prev,
        [selectedChat._id]: prev[selectedChat._id].map(msg =>
          msg.id === editingMessageId ? { ...msg, text: editingText, isEdited: true } : msg
        )
      }));
      
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error('Error updating message:', error);
      alert('Failed to update message');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;

    try {
      await messagesAPI.deleteMessage(messageId);
      
      // Update UI
      setChatMessages(prev => ({
        ...prev,
        [selectedChat._id]: prev[selectedChat._id].map(msg =>
          msg.id === messageId ? { ...msg, text: '🗑️ This message was deleted', deleted: true } : msg
        )
      }));
    } catch (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    }
  };

  return (
    <>
    {!user ? (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Please log in to access messages</h2>
          <button 
            onClick={() => onNavigate('auth')}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    ) : (
    <>
    <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('home')}>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
          <span className="text-lg text-white">🌍</span>
        </div>
        <span className="text-lg font-bold text-white">DhvaniCast</span>
      </div>
    </div>
    
    <div className="w-full bg-gray-900 flex flex-col lg:flex-row">
      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:block w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 h-screen overflow-y-auto z-40 fixed left-0 top-14 bottom-0 scrollbar-hide">
        <div className="mb-8">
          <h1 className="text-2xl font-bold shine-text cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent" onClick={() => onNavigate('home')}>DhvaniCast</h1>
          <p className="text-xs text-gray-500 mt-1">Explore & Share</p>
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => onNavigate('home')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">🏠</span>
            <span>Home</span>
          </button>
          
          <button onClick={() => onNavigate('posts')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">📄</span>
            <span>Posts</span>
          </button>
          
          <button onClick={() => alert('Search modal coming soon!')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⊙</span>
            <span>Search</span>
          </button>
          
          <button onClick={() => onNavigate('explore')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">◈</span>
            <span>Explore</span>
          </button>
          
          <button onClick={() => onNavigate('likes')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">♡</span>
            <span>Likes</span>
          </button>
          
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-lg bg-blue-900/30 border border-blue-500/50 text-gray-100 font-medium hover:bg-blue-900/50 transition-all">
            <span className="text-lg">✉</span>
            <span>Messages</span>
          </button>
          
          <button onClick={() => onNavigate('create-post')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-blue-400 transition-all font-medium">
            <span className="text-lg">⊕</span>
            <span>Create</span>
          </button>
          
          <button onClick={() => onNavigate('profile')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">⚙</span>
            <span>Profile</span>
          </button>
        </nav>
      </aside>

      {/* CENTER CONTENT */}
      <section className="w-full lg:flex-1 lg:ml-64 lg:mr-80 py-4 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">✉ Messages</h1>
            <p className="text-gray-400">Stay connected with your followers</p>
          </div>
          
          {loadingChats ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No users available for chat</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chats.map((chat) => (
                <div 
                  key={chat._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-5 border border-gray-700 shadow-lg shadow-blue-400/20 hover:border-blue-400/50 hover:shadow-blue-400/40 transition-all hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-650 group cursor-pointer"
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex items-start gap-4">
                    <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border-2 border-blue-500/50 group-hover:border-blue-400" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-100 font-bold text-lg group-hover:text-blue-400 transition-colors">{chat.name}</p>
                        <span className="text-xs text-gray-500">{chat.time || 'now'}</span>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{chat.email || ''}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className={`h-2 w-2 rounded-full transition-colors ${chat.isActive ? 'bg-green-500' : 'bg-gray-600'}`}></div>
                        <span className="text-xs text-gray-500">{chat.isActive ? '🟢 Active now' : '⚫ Offline'}</span>
                      </div>
                    </div>
                  </div>
                  {/* Mobile chat button */}
                <button
                  className="lg:hidden mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-all"
                  onClick={() => handleSelectChat(chat)}
                >
                  Chat Now
                </button>
                {/* Desktop: whole card is clickable */}
                <div
                  className="hidden lg:block absolute inset-0 cursor-pointer"
                  onClick={() => setSelectedChat(chat)}
                  style={{ zIndex: 1 }}
                />
              </div>
            ))}
            </div>
          )}
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="hidden lg:flex w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 top-14 bottom-0 h-screen overflow-y-auto z-40 flex-col scrollbar-hide">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Conversation</h2>
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700 flex-shrink-0">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-100">{selectedChat.name}</p>
                <p className="text-xs text-gray-500">{selectedChat.isActive ? '🟢 Active now' : '⚫ Offline'}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2" data-messages-container>
              {loadingMessages ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {(chatMessages[selectedChat._id] || []).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                      onMouseEnter={() => setHoveredMessageId(msg.id)}
                      onMouseLeave={() => setHoveredMessageId(null)}
                    >
                      <div className="relative group">
                        {editingMessageId === msg.id ? (
                          <div className={`max-w-xs rounded-xl p-3 ${msg.sender === 'you' 
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none' 
                            : 'bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600 text-gray-100 rounded-bl-none'}`}>
                            <textarea 
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyPress={handleKeyPress}
                              className="w-full bg-transparent text-sm resize-none focus:outline-none"
                              rows="2"
                            />
                            <div className="flex gap-2 mt-2">
                              <button 
                                onClick={handleUpdateMessage}
                                className="text-xs px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button 
                                onClick={() => setEditingMessageId(null)}
                                className="text-xs px-2 py-1 bg-gray-600 rounded hover:bg-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={`max-w-xs rounded-xl p-3 shadow-lg ${msg.sender === 'you' 
                              ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-br-none' 
                              : 'bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600 text-gray-100 rounded-bl-none'}`}>
                              <p className="text-sm font-medium break-words">{msg.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className={`text-xs ${msg.sender === 'you' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                                {msg.isEdited && <span className={`text-xs ${msg.sender === 'you' ? 'text-blue-100' : 'text-gray-400'}`}>(edited)</span>}
                              </div>
                            </div>
                            
                            {/* Message Actions - Show on hover for own messages */}
                            {msg.sender === 'you' && hoveredMessageId === msg.id && !msg.deleted && (
                              <div className="absolute -top-8 right-0 flex gap-1 bg-gray-800 rounded-lg p-1 border border-gray-700">
                                <button 
                                  onClick={() => handleEditMessage(msg.id, msg.text)}
                                  className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                                  title="Edit message"
                                >
                                  ✏️ Edit
                                </button>
                                <button 
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded"
                                  title="Delete message"
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <div className="space-y-2 flex-shrink-0">
              {editingMessageId ? (
                <div className="text-xs text-blue-400 px-2">Editing message...</div>
              ) : null}
              <textarea 
                placeholder="Type a message..." 
                value={editingMessageId ? editingText : messageInput}
                onChange={(e) => editingMessageId ? setEditingText(e.target.value) : setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendingMessage}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50" 
                rows="3"
              />
              <button 
                onClick={editingMessageId ? handleUpdateMessage : handleSendMessage}
                disabled={!(editingMessageId ? editingText.trim() : messageInput.trim()) || sendingMessage}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-all"
              >
                {sendingMessage ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">Select a chat to start messaging</p>
        )}
      </aside>

      {/* MOBILE CHAT MODAL - Shows full screen chat on mobile */}
      {selectedChat && (
        <div className="lg:hidden fixed inset-0 bg-gray-900 z-50 flex flex-col top-14">
          {/* Chat Header */}
          <div className="bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setSelectedChat(null)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white hover:text-blue-400"
              title="Back to chats"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold text-gray-100 text-sm">{selectedChat.name}</p>
              <p className="text-xs text-gray-500">{selectedChat.isActive ? '🟢 Active now' : '⚫ Offline'}</p>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingMessages ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              (chatMessages[selectedChat._id] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${msg.sender === 'you' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 border border-gray-700 text-gray-300'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'you' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Message Input */}
          <div className="bg-black/70 backdrop-blur-md border-t border-gray-800/50 p-4 flex-shrink-0 space-y-2">
            <textarea 
              placeholder="Type a message..." 
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendingMessage}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-50" 
              rows="3"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || sendingMessage}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-all"
            >
              {sendingMessage ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </div>
      )}
    </div>
    </>
    )}
    </>
  );
}

export default Messages;
