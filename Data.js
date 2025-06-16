// data.js

const DataServer = (function() {
  // LocalStorage keys
  const USERS_KEY = 'gluu_users';
  const VIDEOS_KEY = 'gluu_videos';
  const MESSAGES_KEY = 'gluu_messages';

  // Load or init data
  let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  let videos = JSON.parse(localStorage.getItem(VIDEOS_KEY) || '[]');
  let messages = JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');

  // Save all data back to localStorage
  function saveAll() {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  // Helpers for unique IDs
  function genId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  // Register new user
  function register(username, email, password) {
    if (users.find(u => u.email === email)) {
      return { error: 'Email already registered.' };
    }
    const newUser = {
      id: genId(),
      username,
      email,
      password,
      coins: 0,
      followers: 0,
      lastCoinTime: Date.now(),
      lastFollowerTime: Date.now(),
      botFollowsEnabled: true
    };
    users.push(newUser);
    saveAll();
    return { user: newUser };
  }

  // Login user
  function login(email, password) {
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return { error: 'Invalid credentials.' };
    return { user };
  }

  // Toggle bot followers for a user
  function toggleBotFollowers(userId, enabled) {
    const user = users.find(u => u.id === userId);
    if (!user) return { error: 'User not found.' };
    user.botFollowsEnabled = enabled;
    saveAll();
    return { success: true };
  }

  // Heartbeat: add coins and followers over time
  function heartbeat(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return { error: 'User not found.' };
    const now = Date.now();
    const minsCoins = Math.floor((now - user.lastCoinTime) / 60000);
    const minsFollowers = Math.floor((now - user.lastFollowerTime) / 60000);
    if (minsCoins > 0) {
      user.coins += 100 * minsCoins;
      user.lastCoinTime = now;
    }
    if (minsFollowers > 0 && user.botFollowsEnabled) {
      user.followers += 100 * minsFollowers;
      user.lastFollowerTime = now;
    }
    saveAll();
    return { coins: user.coins, followers: user.followers };
  }

  // Get videos, optionally filtered or paginated
  function getVideos() {
    return videos.sort((a,b) => b.createdAt - a.createdAt);
  }

  // Add a bot video
  function postBotVideo() {
    // Fake random bot profile data
    const gender = Math.random() > 0.5 ? 'men' : 'women';
    const id = Math.floor(Math.random() * 100);
    const names = ["Alex", "Sam", "Jamie", "Taylor", "Jordan", "Casey", "Morgan"];
    const bios = [
      "Loves coding and coffee",
      "Travel addict",
      "Music is life",
      "Tech enthusiast",
      "Dreamer and doer"
    ];
    const profile = {
      name: names[Math.floor(Math.random() * names.length)],
      username: `bot_${Math.floor(Math.random()*10000)}`,
      bio: bios[Math.floor(Math.random() * bios.length)],
      profilePic: `https://randomuser.me/api/portraits/${gender}/${id}.jpg`,
      country: "Internet"
    };

    const video = {
      id: genId(),
      uploader: profile.username,
      uploaderProfile: profile,
      url: `https://random.video/${Math.floor(Math.random() * 9999)}`,
      description: "Bot video " + Math.floor(Math.random()*1000),
      isBot: true,
      createdAt: Date.now()
    };
    videos.push(video);
    saveAll();
    return video;
  }

  // Send a message
  function sendMessage(senderId, receiverUsername, content) {
    const receiver = users.find(u => u.username === receiverUsername);
    if (!receiver) return { error: 'Receiver not found.' };
    const message = {
      id: genId(),
      senderId,
      receiverId: receiver.id,
      content,
      timestamp: Date.now()
    };
    messages.push(message);
    saveAll();
    return message;
  }

  // Get messages between two users
  function getMessages(userId1, userId2) {
    return messages.filter(m =>
      (m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a,b) => a.timestamp - b.timestamp);
  }

  // Expose public API
  return {
    register,
    login,
    toggleBotFollowers,
    heartbeat,
    getVideos,
    postBotVideo,
    sendMessage,
    getMessages,
  };

})();
