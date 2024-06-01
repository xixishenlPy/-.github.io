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

document.querySelectorAll('.waveform').forEach(canvas => {
    const audioSrc = audioContext.createMediaElementSource(new Audio(canvas.getAttribute('data-src')));
    const analyser = audioContext.createAnalyser();
    audioNodes.push({ audioSrc, analyser });

    audioSrc.connect(analyser);
    audioSrc.connect(audioContext.destination);

    const ctx = canvas.getContext('2d');

    canvas.addEventListener('canplay', () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        function draw() {
            const drawVisual = requestAnimationFrame(draw);
            
            analyser.getByteTimeDomainData(dataArray);
            
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.lineWidth = 2;
            ctx.strokeStyle = '#FF0000';

            ctx.beginPath();

            const sliceWidth = WIDTH * 1.0 / bufferLength;
            let x = 0;

            for(let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * HEIGHT / 2;
                
                if(i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
        }

        draw();
    });
});

function playAll() {
    audioNodes.forEach(({ audioSrc }) => {
        audioSrc.mediaElement.play();
    });
    isPlaying = true;
}

function pauseAll() {
    audioNodes.forEach(({ audioSrc }) => {
        audioSrc.mediaElement.pause();
    });
    isPlaying = false;
}
document.addEventListener('DOMContentLoaded', function() {
    let playAllButton = document.getElementById('playAll');
    let audioElements = document.querySelectorAll('.waveform');

    playAllButton.addEventListener('click', function() {
        audioElements.forEach(audio => {
            audio.play();
        });
    });
});
