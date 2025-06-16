// Splash screen delay
setTimeout(() => {
  document.getElementById('splash').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadVideos();
}, 6000);

// Simulate follower growth
let botsOn = false;
const followersElem = document.getElementById("followers");

document.getElementById("toggleBot").onclick = () => {
  botsOn = !botsOn;
  if (botsOn) {
    let interval = setInterval(() => {
      if (!botsOn) return clearInterval(interval);
      let count = parseInt(followersElem.textContent);
      followersElem.textContent = count + Math.floor(Math.random() * 5);
    }, 2000);
  }
};

// Video URLs
const videos = [
  "https://www.tiktok.com/embed/7255620035038893313",
  "https://www.tiktok.com/embed/7255469848707646752",
  "https://www.tiktok.com/embed/7255196064025638176"
];

function loadVideos() {
  const container = document.getElementById("videoFeed");
  videos.forEach(url => {
    const iframe = document.createElement("iframe");
    iframe.src = url;
    container.appendChild(iframe);
  });
}
