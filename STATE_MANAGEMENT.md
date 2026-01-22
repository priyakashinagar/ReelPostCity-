# 🔧 State Management & Architecture Guide

## Overview

This application uses React hooks (useState) for local state management without Redux or Context API (except AuthContext). All state is component-level and local.

---

## State Management by Page

### Posts.jsx
```javascript
// Search Functionality
const [searchOpen, setSearchOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// Comment Modal
const [commentModalOpen, setCommentModalOpen] = useState(false);
const [selectedPostForComment, setSelectedPostForComment] = useState(null);
const [newComment, setNewComment] = useState('');

// User Interactions
const [follows, setFollows] = useState({});      // { cityName: true/false }
const [votes, setVotes] = useState({});           // { pollId: selectedOption }
```

**Handlers**:
```javascript
const filteredPosts = posts.filter(post => 
  post.title.includes(searchQuery) ||
  post.description.includes(searchQuery) ||
  post.tags.includes(searchQuery)
);

const handleLike = (postId, e) => {
  e.stopPropagation();
  // Toggle like state
};

const handleFollow = (city) => {
  setFollows(prev => ({
    ...prev,
    [city]: !prev[city]
  }));
};

const handleVote = (option) => {
  setVotes(prev => ({
    ...prev,
    selectedOption: option
  }));
};

const openCommentModal = (post) => {
  setSelectedPostForComment(post);
  setCommentModalOpen(true);
};

const submitComment = () => {
  // Add comment to post
  setCommentModalOpen(false);
  setNewComment('');
};

const handleShare = (post) => {
  alert(`Shared: ${post.title}`);
};
```

---

### Messages.jsx
```javascript
const [chats, setChats] = useState(initialChats);
const [selectedChat, setSelectedChat] = useState(null);
const [messageInput, setMessageInput] = useState('');

const [chatMessages, setChatMessages] = useState({
  // chatId: [{ id, sender, text, time }, ...]
  1: [...],
  2: [...],
});
```

**Key Handler**:
```javascript
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

  // Update chat list
  setChats(prev => prev.map(chat => 
    chat.id === selectedChat.id 
      ? { ...chat, lastMessage: messageInput, time: 'just now' }
      : chat
  ));

  setMessageInput('');
};

const handleKeyPress = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};
```

---

### Notifications.jsx
```javascript
const [notifications, setNotifications] = useState([
  // { id, type, user, post, time, avatar, read }
]);
```

**Handlers**:
```javascript
const handleMarkAsRead = (id) => {
  setNotifications(prev => prev.map(notif => 
    notif.id === id ? { ...notif, read: true } : notif
  ));
};

const handleMarkAllAsRead = () => {
  setNotifications(prev => prev.map(notif => 
    ({ ...notif, read: true })
  ));
};

const handleClear = () => {
  setNotifications([]);
};

const handleNotificationClick = (notif) => {
  handleMarkAsRead(notif.id);
  if (notif.type === 'like' || notif.type === 'comment') {
    onNavigate('posts');
  }
};
```

---

### Profile.jsx
```javascript
const [userProfile, setUserProfile] = useState({
  name: 'Travel Explorer',
  username: '@dhvanicast',
  bio: 'Description...',
  followers: 12500,
  following: 3450,
  posts: 127,
  avatar: 'url',
  coverImage: 'url',
});

const [editModalOpen, setEditModalOpen] = useState(false);
const [editForm, setEditForm] = useState({
  name: userProfile.name,
  username: userProfile.username,
  bio: userProfile.bio,
});
```

**Handler**:
```javascript
const handleEditSubmit = () => {
  setUserProfile(prev => ({
    ...prev,
    name: editForm.name,
    username: editForm.username,
    bio: editForm.bio,
  }));
  setEditModalOpen(false);
};

const handleLogout = () => {
  if (window.confirm('Are you sure you want to logout?')) {
    onNavigate('auth');
  }
};
```

---

### Likes.jsx
```javascript
const [likedPosts, setLikedPosts] = useState([
  // Initial liked posts array
]);
```

**Handler**:
```javascript
const handleUnlike = (id) => {
  setLikedPosts(prev => prev.filter(post => post.id !== id));
};
```

---

### CreatePost.jsx
```javascript
const [formData, setFormData] = useState({
  caption: '',
  tags: '',
  city: '',
  type: 'image',
  image: 'url'
});
```

**Handlers**:
```javascript
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const handleImageChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({
        ...formData,
        image: event.target?.result
      });
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  alert('Post published successfully!');
  onNavigate('posts');
};
```

---

### PostAd.jsx
```javascript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  image: '',
  imagePreview: '',
  targetLocation: 'all',
  budget: 500,
  duration: 7,
  contactEmail: user?.email || '',
  contactPhone: '',
  website: '',
});

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
```

**Handler**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    // Validation
    if (!formData.title || !formData.description) {
      throw new Error('Fill all required fields');
    }

    // Create ad object
    const newAd = {
      id: Date.now(),
      userId: user.id,
      ...formData,
      status: 'active',
    };

    // Save to localStorage
    const ads = JSON.parse(localStorage.getItem('ads') || '[]');
    ads.push(newAd);
    localStorage.setItem('ads', JSON.stringify(ads));

    setSuccess('✅ Ad posted successfully!');
    
    setTimeout(() => {
      onNavigate('my-ads');
    }, 2000);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

### Subscription.jsx
```javascript
const [selectedPlan, setSelectedPlan] = useState(null);
const [paymentModalOpen, setPaymentModalOpen] = useState(false);
const [paymentForm, setPaymentForm] = useState({
  fullName: '',
  email: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
});
```

**Handlers**:
```javascript
const handleUpgrade = (planId) => {
  if (planId !== 'free') {
    setSelectedPlan(planId);
    setPaymentModalOpen(true);
  }
};

const handlePaymentSubmit = () => {
  if (!paymentForm.fullName || !paymentForm.email) {
    alert('Please fill all payment details');
    return;
  }

  if (paymentForm.cardNumber.replace(/\s/g, '').length !== 16) {
    alert('Please enter a valid 16-digit card number');
    return;
  }

  alert(`✅ Payment successful!`);
  setPaymentModalOpen(false);
  setPaymentForm({ fullName: '', email: '', cardNumber: '', expiryDate: '', cvv: '' });
};

const formatCardNumber = (value) => {
  return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
};
```

---

### MyAds.jsx
```javascript
const [ads, setAds] = useState([]);
const [filter, setFilter] = useState('all');
const [loading, setLoading] = useState(true);
```

**Handlers**:
```javascript
useEffect(() => {
  loadAds();
}, []);

const loadAds = () => {
  const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
  const userAds = allAds.filter(ad => ad.userId === user?.id);
  setAds(userAds);
};

const toggleAdStatus = (adId, currentStatus) => {
  const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
  const adIndex = allAds.findIndex(ad => ad.id === adId);
  
  if (adIndex !== -1) {
    allAds[adIndex].status = currentStatus === 'active' ? 'paused' : 'active';
    localStorage.setItem('ads', JSON.stringify(allAds));
    loadAds();
  }
};

const deleteAd = (adId) => {
  if (window.confirm('Are you sure?')) {
    const allAds = JSON.parse(localStorage.getItem('ads') || '[]');
    const filtered = allAds.filter(ad => ad.id !== adId);
    localStorage.setItem('ads', JSON.stringify(filtered));
    loadAds();
  }
};
```

---

## 🔄 Common State Patterns

### Toggle Boolean State
```javascript
const [isOpen, setIsOpen] = useState(false);

// In handler
setIsOpen(!isOpen);
// Or
setIsOpen(prev => !prev);
```

### Update Object in Array
```javascript
const [items, setItems] = useState([...]);

setItems(items.map(item => 
  item.id === targetId 
    ? { ...item, property: newValue }
    : item
));
```

### Remove Item from Array
```javascript
setItems(items.filter(item => item.id !== removeId));
```

### Add Item to Array
```javascript
setItems([...items, newItem]);
```

### Update Object State
```javascript
const [form, setForm] = useState({ name: '', email: '' });

setForm(prev => ({
  ...prev,
  name: 'new value'
}));
```

### Multiple Flags in One Object
```javascript
const [state, setState] = useState({
  flag1: true,
  flag2: false,
  data: [],
});

setState(prev => ({
  ...prev,
  flag1: !prev.flag1
}));
```

---

## 💾 LocalStorage Integration

### Save Data
```javascript
const data = { /* ... */ };
localStorage.setItem('key', JSON.stringify(data));
```

### Load Data
```javascript
const data = JSON.parse(localStorage.getItem('key') || '{}');
```

### Update Existing Data
```javascript
const allData = JSON.parse(localStorage.getItem('items') || '[]');
allData.push(newItem);
localStorage.setItem('items', JSON.stringify(allData));
```

### Delete from LocalStorage
```javascript
localStorage.removeItem('key');
// or
localStorage.clear();
```

---

## 🎯 Best Practices

### ✅ DO
- Use `prev` parameter in setState for calculations
- Validate before updating state
- Use `useEffect` for side effects
- Use object spread `{...obj}` to update nested objects
- Use array methods: `map`, `filter`, `find`
- Initialize state with default values

### ❌ DON'T
- Directly mutate state: `state.property = value`
- Use state as id: `Math.random()` or `Date.now()`
- Update multiple states separately (use one object)
- Forget to set `[e.target.name]` in form handlers
- Create too many state variables (combine related ones)

---

## 🧪 Testing State

### Console Logging
```javascript
const handleClick = () => {
  console.log('Before:', form);
  setForm({...form, name: 'new'});
  console.log('After:', form); // Still shows old value (async)
};
```

### React DevTools
1. Install React DevTools extension
2. Open DevTools → Components tab
3. Select component
4. View current state on right panel
5. Click State to expand

### LocalStorage Inspection
1. Open DevTools → Application tab
2. Click "Local Storage"
3. Select domain
4. View all saved key-value pairs

---

## 📊 State Flow Diagram

```
User Action (click)
    ↓
Event Handler (handleClick)
    ↓
Validation Logic
    ↓
State Update (setState)
    ↓
Component Re-render
    ↓
UI Updates
    ↓
Save to LocalStorage (optional)
```

---

## 🔐 Performance Tips

1. **Memoization** - Use useMemo for expensive calculations
2. **Callbacks** - Use useCallback for event handlers
3. **Lazy State** - Don't initialize expensive data
4. **Conditional Rendering** - Hide/show instead of mount/unmount
5. **Key Props** - Use unique keys in list rendering

---

**Last Updated**: 2024
**Type**: React Hooks Best Practices
**Status**: Production Ready ✅
