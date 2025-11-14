// Create floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 20 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
    particlesContainer.appendChild(particle);
}

// Music data
const musicData = {
    "Happy": {
        songs: ["Good Vibes - Ayokay", "Happy - Pharrell Williams", "Sunroof - Nicky Youre", "Walking On Sunshine - Katrina", "Don't Stop Me Now - Queen"],
        quote: "Choose to be optimistic, it feels better. - Dalai Lama"
    },
    "Sad": {
        songs: ["Arcade - Duncan Laurence", "Lovely - Billie Eilish", "Let Her Go - Passenger", "Someone Like You - Adele", "The Night We Met - Lord Huron"],
        quote: "Tears are words the heart can't express. - Unknown"
    },
    "Stress": {
        songs: ["Weightless - Marconi Union", "Night Owl - Galimatias", "Calm - Nils Frahm", "Breathe Me - Sia", "Tranquil - Ludovico Einaudi"],
        quote: "Sometimes the most productive thing you can do is relax. - Mark Black"
    },
    "Sleepy": {
        songs: ["Lofi Sleep Mix", "Soft Piano Rain", "Deep Relaxation", "River Flows In You - Yiruma", "Moonlight Sonata - Beethoven"],
        quote: "Sleep is the best meditation. - Dalai Lama"
    },
    "Study": {
        songs: ["Lofi Beats", "Focus - Hans Zimmer", "Coding Mix - Chillhop", "Classical Study Music", "Peaceful Piano"],
        quote: "The expert in anything was once a beginner. - Helen Hayes"
    },
    "Energy": {
        songs: ["Power - Kanye West", "Believer - Imagine Dragons", "Animals - Martin Garrix", "Eye of the Tiger - Survivor", "Thunder - Imagine Dragons"],
        quote: "Energy and persistence conquer all things. - Benjamin Franklin"
    }
};

// Mood color settings
let currentSongIndex = 0;
let currentMood = '';
let isPlaying = false;

const moodColors = {
    "Happy": { bg: ['#d5b60a', '#ffed29'], text: '#ffd93d', particle: '#fff8dc', playerPrimary: '#ffd93d', playerSecondary: '#ffb347' },
    "Sad": { bg: ['#0e1e40', '#1b3763'], text: '#6bcfff', particle: '#b3e5fc', playerPrimary: '#6bcfff', playerSecondary: '#2a5298' },
    "Stress": { bg: ['#3e1f2f', '#5a1f45'], text: '#ff6b9d', particle: '#ffcce0', playerPrimary: '#ff6b9d', playerSecondary: '#f8b500' },
    "Sleepy": { bg: ['#1c1242', '#38277c'], text: '#a29bfe', particle: '#dcd6f7', playerPrimary: '#a29bfe', playerSecondary: '#5f27cd' },
    "Study": { bg: ['#0b3f30', '#177f67'], text: '#55efc4', particle: '#b8f8e6', playerPrimary: '#55efc4', playerSecondary: '#00d2d3' },
    "Energy": { bg: ['#400a0a', '#7f1f1f'], text: '#ff7675', particle: '#ffcccc', playerPrimary: '#ff7675', playerSecondary: '#fd79a8' }
};

// Select a mood
function selectMood(mood) {
    currentMood = mood;
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    const bgGradient = document.querySelector('.bg-gradient');
    const header = document.querySelector('h1');
    
    const colors = moodColors[mood];

    // Change background
    bgGradient.style.background = `linear-gradient(45deg, ${colors.bg[0]}, ${colors.bg[1]})`;
    
    // Update header/logo and subtitle colors
    header.style.color = colors.text;
    header.classList.add('mood-active');
    document.querySelector('.subtitle').style.color = colors.text;
    
    // Change particle colors
    const particles = document.querySelectorAll('.particle');
    particles.forEach(p => {
        p.style.background = colors.particle;
        p.classList.add('mood-particle');
    });
    
    // Reset result and show loading
    result.classList.remove('show');
    loading.classList.add('active');

    setTimeout(() => {
        loading.classList.remove('active');
        displayResults(mood);
    }, 1500);
}

// Display mood results
function displayResults(mood) {
    const data = musicData[mood];
    const colors = moodColors[mood];
    const result = document.getElementById('result');
    currentSongIndex = 0;

    result.innerHTML = `
        <div class="result-content" style="border-color: ${colors.text}40;">
            <h3 class="mood-title" style="color: ${colors.text}">${mood}</h3>
            <div class="quote" style="color: ${colors.text}20; border-left-color: ${colors.text};">"${data.quote}"</div>
            <h4 class="songs-title" style="color: ${colors.text}">🎵 Recommended Songs</h4>
            <ul class="song-list">
                ${data.songs.map((song, index) => 
                    `<li class="song-item" style="border-left-color: ${colors.text}; color: ${colors.text}" onclick="playSong(${index})">${song}</li>`
                ).join('')}
            </ul>
        </div>
        <div class="music-player" style="border-color: ${colors.text}40;">
            <div class="now-playing" style="color: ${colors.text}">NOW PLAYING</div>
            <div class="current-song" id="currentSong" style="color: ${colors.text}">${data.songs[0]}</div>
            <div class="player-controls">
                <button class="control-btn" onclick="prevSong()">
                    <svg viewBox="0 0 24 24"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>
                </button>
                <button class="control-btn play" onclick="togglePlay()" id="playBtn" style="background: linear-gradient(135deg, ${colors.playerPrimary} 0%, ${colors.playerSecondary} 100%);">
                    <svg viewBox="0 0 24 24" id="playIcon"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </button>
                <button class="control-btn" onclick="nextSong()">
                    <svg viewBox="0 0 24 24"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>
                </button>
            </div>
            <div class="progress-bar">
                <div class="progress" id="progress" style="background: linear-gradient(90deg, ${colors.playerPrimary} 0%, ${colors.playerSecondary} 100%);"></div>
            </div>
        </div>
    `;
    result.classList.add('show');
}

// Play a specific song
function playSong(index) {
    currentSongIndex = index;
    const data = musicData[currentMood];
    document.getElementById('currentSong').textContent = data.songs[index];
    isPlaying = true;
    const playBtn = document.getElementById('playIcon');
    playBtn.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    playBtn.setAttribute('fill', 'white');
    playBtn.setAttribute('stroke', 'none');
}

// Toggle play/pause
function togglePlay() {
    isPlaying = !isPlaying;
    const playBtn = document.getElementById('playIcon');
    if (isPlaying) {
        playBtn.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        playBtn.setAttribute('fill', 'white');
        playBtn.setAttribute('stroke', 'none');
    } else {
        playBtn.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
        playBtn.setAttribute('fill', 'white');
        playBtn.setAttribute('stroke', 'none');
    }
}

// Next song
function nextSong() {
    const data = musicData[currentMood];
    currentSongIndex = (currentSongIndex + 1) % data.songs.length;
    playSong(currentSongIndex);
}

// Previous song
function prevSong() {
    const data = musicData[currentMood];
    currentSongIndex = (currentSongIndex - 1 + data.songs.length) % data.songs.length;
    playSong(currentSongIndex);
}
