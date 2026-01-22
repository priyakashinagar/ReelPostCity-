import React, { useState } from 'react';

function Messages({ onNavigate }) {
  const initialChats = [
    { id: 1, name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=10', lastMessage: 'That sunset was amazing!', time: '2 hours ago', unread: 0 },
    { id: 2, name: 'Marcus Chen', avatar: 'https://i.pravatar.cc/150?img=11', lastMessage: 'Let me share the ramen spot', time: '3 hours ago', unread: 2 },
    { id: 3, name: 'Lisa Wong', avatar: 'https://i.pravatar.cc/150?img=12', lastMessage: 'Thanks for the tips!', time: '5 hours ago', unread: 0 },
    { id: 4, name: 'David Park', avatar: 'https://i.pravatar.cc/150?img=13', lastMessage: 'NYC is incredible', time: '6 hours ago', unread: 1 },
    { id: 5, name: 'Elena Russo', avatar: 'https://i.pravatar.cc/150?img=14', lastMessage: 'Venice is on my list now', time: '8 hours ago', unread: 0 },
  ];

  const [chats, setChats] = useState(initialChats);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [chatMessages, setChatMessages] = useState({
    1: [{ id: 1, sender: 'them', text: 'That sunset was amazing!', time: '2 hours ago' }],
    2: [{ id: 1, sender: 'them', text: 'Let me share the ramen spot', time: '3 hours ago' }],
    3: [{ id: 1, sender: 'them', text: 'Thanks for the tips!', time: '5 hours ago' }],
    4: [{ id: 1, sender: 'them', text: 'NYC is incredible', time: '6 hours ago' }],
    5: [{ id: 1, sender: 'them', text: 'Venice is on my list now', time: '8 hours ago' }],
  });

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'you',
      text: messageInput,
      time: 'now',
    };

    setChatMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id 
        ? { ...chat, lastMessage: messageInput, time: 'just now', unread: 0 }
        : chat
    ));

    setSelectedChat(prev => ({
      ...prev,
      lastMessage: messageInput,
      time: 'just now'
    }));

    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
    {/* Mobile Top Bar with DhvaniCast Logo */}
    <div className="lg:hidden sticky top-0 z-40 bg-black/70 backdrop-blur-md border-b border-gray-800/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('home')}>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-xl">
          <span className="text-lg text-white">🌍</span>
        </div>
        <span className="text-lg font-bold text-white">DhvaniCast</span>
      </div>
    </div>
    
    <div className="w-full bg-gray-900 flex">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-950 border-r border-blue-500/70 blue-shine-border p-6 fixed left-0 h-screen overflow-y-auto z-40">
        <div className="mb-8">
          <h1 className="text-2xl font-bold shine-text cursor-pointer bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent" onClick={() => onNavigate('home')}>DhvaniCast</h1>
          <p className="text-xs text-gray-500 mt-1">Explore & Share</p>
        </div>
        
        <nav className="space-y-2">
          <button onClick={() => onNavigate('posts')} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 transition-all font-medium">
            <span className="text-lg">■</span>
            <span>Home</span>
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
      <section className="flex-1 ml-64 mr-80 py-8 px-4 pb-20 bg-gray-900 blue-shine-border rounded-2xl">
        <div className="w-full">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-100 mb-2">✉ Messages</h1>
            <p className="text-gray-400">Stay connected with your followers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="bg-gradient-to-br from-gray-800 to-gray-750 rounded-2xl p-5 border border-gray-700 shadow-lg shadow-blue-400/20 hover:border-blue-400/50 hover:shadow-blue-400/40 transition-all hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-650 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full border-2 border-blue-500/50 group-hover:border-blue-400" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-100 font-bold text-lg group-hover:text-blue-400 transition-colors">{chat.name}</p>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2">{chat.lastMessage}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Active now</span>
                    </div>
                  </div>
                  {chat.unread > 0 && (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RIGHT SIDEBAR */}
      <aside className="w-80 bg-gray-950 border-l border-blue-500/70 blue-shine-border p-6 fixed right-0 h-screen overflow-y-auto z-40 flex flex-col">
        <h2 className="text-sm font-bold text-gray-300 mb-6 uppercase tracking-wider">Conversation</h2>
        {selectedChat ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800 rounded-lg border border-gray-700 flex-shrink-0">
              <img src={selectedChat.avatar} alt={selectedChat.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-semibold text-gray-100">{selectedChat.name}</p>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">
              {(chatMessages[selectedChat.id] || []).map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-lg p-3 ${msg.sender === 'you' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-800 border border-gray-700 text-gray-300'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'you' ? 'text-blue-200' : 'text-gray-500'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2 flex-shrink-0">
              <textarea 
                placeholder="Type a message..." 
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500 resize-none" 
                rows="3"
              />
              <button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold py-2 rounded-lg transition-all"
              >
                Send Message
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 text-center py-12">Select a chat to start messaging</p>
        )}
      </aside>
    </div>
    </>
  );
}

export default Messages;
