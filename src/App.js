import React, { useState } from 'react';
import Header from './components/Header';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CreatePost from './pages/CreatePost';
import Explore from './pages/Explore';
import Likes from './pages/Likes';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);

  const handleNavigate = (page, post = null) => {
    setCurrentPage(page);
    if (post) {
      setSelectedPost(post);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {(currentPage !== 'posts' && currentPage !== 'explore' && currentPage !== 'likes' && currentPage !== 'messages' && currentPage !== 'notifications' && currentPage !== 'profile' && currentPage !== 'create-post') && <Header currentPage={currentPage} onNavigate={handleNavigate} />}
      
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'posts' && <Posts onNavigate={handleNavigate} />}
      {currentPage === 'post-detail' && <PostDetail post={selectedPost} onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutUs />}
      {currentPage === 'contact' && <ContactUs />}
      {currentPage === 'create-post' && <CreatePost onNavigate={handleNavigate} />}
      {currentPage === 'explore' && <Explore onNavigate={handleNavigate} />}
      {currentPage === 'likes' && <Likes onNavigate={handleNavigate} />}
      {currentPage === 'messages' && <Messages onNavigate={handleNavigate} />}
      {currentPage === 'notifications' && <Notifications onNavigate={handleNavigate} />}
      {currentPage === 'profile' && <Profile onNavigate={handleNavigate} />}
    </div>
  );
}

export default App;
