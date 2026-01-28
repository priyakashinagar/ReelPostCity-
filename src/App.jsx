import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from './store/slices/authSlice.js';
import Header from './components/Layout/Header.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { CityProvider } from './context/CityContext.jsx';
import {
  validateRouteAccess,
  renderRoute,
  shouldShowHeader,
  AccessDeniedUI
} from './routes/index.js';

function AppContent() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector(state => state.auth);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPost, setSelectedPost] = useState(null);
  const [posts, setPosts] = useState([]);
  const [fromExplore, setFromExplore] = useState(false);

  // Initialize posts with timestamps
  useEffect(() => {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  }, []);

  // Check and remove expired posts
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedPosts = posts.filter((post) => {
        const postAge = now - post.timestamp;
        const expiryTime =
          post.userType === 'free'
            ? 24 * 60 * 60 * 1000 // 24 hours
            : post.userType === 'premium'
            ? 4 * 24 * 60 * 60 * 1000 // 4 days
            : 7 * 24 * 60 * 60 * 1000; // 7 days for vip

        return postAge < expiryTime;
      });

      if (updatedPosts.length !== posts.length) {
        setPosts(updatedPosts);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [posts]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  // Validate route access
  const accessCheck = validateRouteAccess(currentPage, user, isAuthenticated);
  
  if (!accessCheck.allowed) {
    return (
      <AccessDeniedUI
        reason={accessCheck.reason}
        route={accessCheck.route}
        userType={user?.userType}
        onNavigate={setCurrentPage}
      />
    );
  }

  // Handlers for navigation and post operations
  const handleNavigate = (page, post = null, navigateFromExplore = false) => {
    setCurrentPage(page);
    setFromExplore(navigateFromExplore);
    if (post) {
      setSelectedPost(post);
    }
  };

  const handleAddPost = (newPost) => {
    const postWithTimestamp = {
      ...newPost,
      timestamp: Date.now(),
      userType: user.userType,
      authorId: user.id,
      author: user.username,
    };
    const updatedPosts = [postWithTimestamp, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('posts', JSON.stringify(updatedPosts));
  };

  // Prepare route props
  const routeProps = {
    user,
    isAuthenticated,
    selectedPost,
    posts,
    onNavigate: handleNavigate,
    handleAddPost,
    fromExplore
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Show header when appropriate */}
      {shouldShowHeader(currentPage) && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      
      {/* Route content renderer */}
      {renderRoute(currentPage, routeProps)}
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  // Verify token on app load
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  return (
    <ErrorBoundary>
      <CityProvider>
        <AppContent />
      </CityProvider>
    </ErrorBoundary>
  );
}

export default App;
