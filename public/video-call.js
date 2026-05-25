const socket = io('http://localhost:5000');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;

const ROOM_ID = new URLSearchParams(window.location.search).get('room') || 'nexus-default-room';
const peers = {};

let myStream;

const MODE = new URLSearchParams(window.location.search).get('mode');
const isAudioOnly = MODE === 'audio';

if (isAudioOnly) {
  document.getElementById('video-btn').style.display = 'none';
  document.querySelector('.call-header h2').innerText = 'Nexus Secure Voice Call';
}

navigator.mediaDevices.getUserMedia({
  video: !isAudioOnly,
  audio: true
}).then(stream => {
  myStream = stream;
  addVideoStream(myVideo, stream);
  
  document.getElementById('room-status').innerText = 'Room: ' + ROOM_ID;

  socket.emit('join-room', ROOM_ID, socket.id);

  socket.on('user-connected', userId => {
    // In a real WebRTC app, this is where you'd create an RTCPeerConnection,
    // create an offer, and send it to the new user.
    // For this mock/basic implementation, we are just acknowledging connection.
    console.log('User connected:', userId);
    
    // Simulate peer video (since real WebRTC requires complex signaling out of scope for a basic mock)
    // A complete WebRTC implementation would use simple-peer or raw RTCPeerConnection here.
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) peers[userId].close();
    console.log('User disconnected:', userId);
  });
}).catch(err => {
  console.error("Failed to get local stream", err);
  document.getElementById('room-status').innerText = 'Camera/Mic access denied';
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  
  if (isAudioOnly) {
    const audioAvatar = document.createElement('div');
    audioAvatar.style.width = '120px';
    audioAvatar.style.height = '120px';
    audioAvatar.style.borderRadius = '50%';
    audioAvatar.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
    audioAvatar.style.display = 'flex';
    audioAvatar.style.alignItems = 'center';
    audioAvatar.style.justifyContent = 'center';
    audioAvatar.style.fontSize = '40px';
    audioAvatar.innerText = '🎙️';
    videoGrid.append(audioAvatar);
    // Still append video to DOM so it plays audio, but hide it visually
    video.style.display = 'none';
    videoGrid.append(video);
  } else {
    videoGrid.append(video);
  }
}

// Controls
let isAudioMuted = false;
let isVideoMuted = false;

document.getElementById('mute-btn').addEventListener('click', (e) => {
  isAudioMuted = !isAudioMuted;
  myStream.getAudioTracks()[0].enabled = !isAudioMuted;
  e.currentTarget.classList.toggle('muted', isAudioMuted);
  e.currentTarget.innerText = isAudioMuted ? '🔇' : '🎤';
});

document.getElementById('video-btn').addEventListener('click', (e) => {
  isVideoMuted = !isVideoMuted;
  myStream.getVideoTracks()[0].enabled = !isVideoMuted;
  e.currentTarget.classList.toggle('muted', isVideoMuted);
  e.currentTarget.innerText = isVideoMuted ? '🙈' : '📹';
});
