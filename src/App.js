import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import CreatePost from './pages/CreatePost';

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
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && <Home onNavigate={handleNavigate} />}
      {currentPage === 'posts' && <Posts onNavigate={handleNavigate} />}
      {currentPage === 'post-detail' && <PostDetail post={selectedPost} onNavigate={handleNavigate} />}
      {currentPage === 'about' && <AboutUs />}
      {currentPage === 'contact' && <ContactUs />}
      {currentPage === 'create-post' && <CreatePost onNavigate={handleNavigate} />}
      
      <Footer />
    </div>
  );
}

export default App;
