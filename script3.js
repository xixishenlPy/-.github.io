const songs = [
    'audio/钢琴版.MP3',
    'audio/古筝版.MP3',
    'audio/吉他版.MP3'
];

const canvases = [
    document.getElementById('canvas1'),
    document.getElementById('canvas2'),
    document.getElementById('canvas3')
];

const playButtons = [
    document.getElementById('playButton1'),
    document.getElementById('playButton2'),
    document.getElementById('playButton3')
];

const customColors = [
    { r: 44, g: 62, b: 80 },   // Dark Blue
    { r: 52, g: 73, b: 94 },   // Light Dark Blue
    { r: 22, g: 160, b: 133 }, // Greenish Blue
    { r: 39, g: 174, b: 96 },  // Green
    { r: 41, g: 128, b: 185 }, // Bright Blue
    { r: 142, g: 68, b: 173 }, // Purple
    { r: 243, g: 156, b: 18 }, // Yellow
    { r: 211, g: 84, b: 0 },   // Orange
    { r: 192, g: 57, b: 43 }   // Red
];

let audioContext;
const canvasContexts = canvases.map(canvas => canvas.getContext('2d'));
const audioElements = songs.map(song => new Audio(song));

function interpolateColor(color1, color2, factor) {
    if (arguments.length < 3) { 
        factor = 0.5; 
    }
    const result = {
        r: Math.round(color1.r + factor * (color2.r - color1.r)),
        g: Math.round(color1.g + factor * (color2.g - color1.g)),
        b: Math.round(color1.b + factor * (color2.b - color1.b))
    };
    return result;
}

function getColor(percent) {
    const colorCount = customColors.length - 1;
    const lowerIndex = Math.floor(percent * colorCount);
    const upperIndex = Math.ceil(percent * colorCount);
    const colorFactor = (percent * colorCount) % 1;

    const lowerColor = customColors[lowerIndex];
    const upperColor = customColors[upperIndex];
    const interpolatedColor = interpolateColor(lowerColor, upperColor, colorFactor);

    return `rgb(${interpolatedColor.r},${interpolatedColor.g},${interpolatedColor.b})`;
}

function drawLiveSpectrogram(audio, canvas, canvasCtx) {
    const analyser = audioContext.createAnalyser();
    let source;

    if (!audio.sourceNode) {
        source = audioContext.createMediaElementSource(audio);
        audio.sourceNode = source;
    } else {
        source = audio.sourceNode;
    }

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let x = 0;
    let animationFrameId;

    function draw() {
        analyser.getByteFrequencyData(dataArray);

        if (x >= canvas.width) {
            const imageData = canvasCtx.getImageData(0, 0, canvas.width, canvas.height);
            canvas.width += 1; // Increase the canvas width by 1 pixel
            canvasCtx.putImageData(imageData, 0, 0);
        }

        for (let i = 0; i < bufferLength; i++) {
            const value = dataArray[i];
            const percent = value / 256;
            const y = canvas.height - Math.floor(percent * canvas.height) - 1;

            const color = getColor(percent);
            canvasCtx.fillStyle = color;
            canvasCtx.fillRect(x, y, 1, 1);
        }

        x++;

        if (!audio.paused) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    function startDrawing() {
        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(draw);
        }
    }

    audio.addEventListener('play', startDrawing);

    draw();
}

document.getElementById('startButton').addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    audioContext.resume().then(() => {
        audioElements.forEach((audio, index) => {
            audio.loop = false;
            audio.load();

            playButtons[index].addEventListener('click', () => {
                audio.play();
                playButtons[index].style.display = 'none';
            });

            drawLiveSpectrogram(audio, canvases[index], canvasContexts[index]);
        });
    }).catch(error => {
        console.log('Error resuming audio context:', error);
        document.getElementById('loadingMessage').textContent = '无法恢复音频上下文';
    });
});