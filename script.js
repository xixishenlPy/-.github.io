const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioNodes = [];
let isPlaying = false;

document.getElementById('playAll').addEventListener('click', () => {
    if (isPlaying) {
        pauseAll();
    } else {
        playAll();
    }
});

const audioFilePaths = [
    'audio/audio1.mp3',
    'audio/audio2.mp3',
    // Add more file paths as needed
];

audioFilePaths.forEach(filePath => {
    fetch(filePath)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            const audioSrc = audioContext.createBufferSource();
            audioSrc.buffer = audioBuffer;
            const analyser = audioContext.createAnalyser();
            audioNodes.push({ audioSrc, analyser });

            audioSrc.connect(analyser);
            analyser.connect(audioContext.destination);
            audioSrc.start();
        })
        .catch(error => {
            console.error('Error loading audio file:', error);
        });
});

function playAll() {
    audioNodes.forEach(({ audioSrc }) => {
        audioSrc.start();
    });
    isPlaying = true;
}

function pauseAll() {
    audioNodes.forEach(({ audioSrc }) => {
        audioSrc.stop();
    });
    isPlaying = false;
}
