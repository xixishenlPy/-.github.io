const songs = [
    'audio/A Comme Amour.MP3',
    'audio/windy hill.MP3'
];

const canvases = [
    document.getElementById('canvas1'),
    document.getElementById('canvas2')
];

const playButtons = [
    document.getElementById('playButton1'),
    document.getElementById('playButton2')
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

function drawRhythmVisualization(audio, canvas, canvasCtx) {
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

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let previousTime = 0;
    let x = 0;
    const circles = [];

    function draw() {
        analyser.getByteTimeDomainData(dataArray);

        const now = audio.currentTime;
        const deltaTime = now - previousTime;

        if (deltaTime > 0.1) {
            const max = Math.max(...dataArray);
            const min = Math.min(...dataArray);
            const amplitude = max - min;

            const outerRadius = (amplitude / 128 * canvas.height / 2) * 1.5; // Increased size
            const innerRadius = outerRadius * 0.7; // Inner circle size
            const color = getColor(amplitude / 256);

            circles.push({ x: x, outerRadius: outerRadius, innerRadius: innerRadius, color: color });
            x += 40; // Move to the right for the next circle, increased space for better visualization

            previousTime = now;
        }

        canvas.width = x + 50; // Ensure there's some space
        canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

        circles.forEach(circle => {
            canvasCtx.beginPath();
            canvasCtx.arc(circle.x, canvas.height / 2, circle.outerRadius, 0, 2 * Math.PI, false);
            canvasCtx.arc(circle.x, canvas.height / 2, circle.innerRadius, 0, 2 * Math.PI, true);
            canvasCtx.fillStyle = circle.color;
            canvasCtx.fill();
            canvasCtx.strokeStyle = circle.color;
            canvasCtx.lineWidth = 2;
            canvasCtx.stroke();
        });

        const scrollContainer = canvas.parentElement;
        scrollContainer.scrollLeft = canvas.width;

        if (!audio.paused) {
            requestAnimationFrame(draw);
        }
    }

    function startDrawing() {
        requestAnimationFrame(draw);
    }

    audio.addEventListener('play', startDrawing);
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

            drawRhythmVisualization(audio, canvases[index], canvasContexts[index]);
        });
    }).catch(error => {
        console.log('Error resuming audio context:', error);
        document.getElementById('loadingMessage').textContent = '无法恢复音频上下文';
    });
});