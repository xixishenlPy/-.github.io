document.getElementById('audioFile').addEventListener('change', function(event) {
  const audioFile = event.target.files[0];
  if (audioFile) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = function(e) {
      audioContext.decodeAudioData(e.target.result).then(function(buffer) {
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = URL.createObjectURL(new Blob([e.target.result]));
        audioPlayer.play();
        drawSpectrogram(buffer, audioContext);
      });
    };

    reader.readAsArrayBuffer(audioFile);
  }
});

function drawSpectrogram(buffer, audioContext) {
  const canvas = document.getElementById('spectrogram');
  const canvasContext = canvas.getContext('2d');
  const analyser = audioContext.createAnalyser();

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const width = canvas.width;
  const height = canvas.height;
  const barWidth = (width / bufferLength) * 2.5;
  let x = 0;

  function draw() {
    requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasContext.fillStyle = 'rgb(0, 0, 0)';
    canvasContext.fillRect(0, 0, width, height);

    x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const barHeight = dataArray[i];

      const r = barHeight + 25 * (i / bufferLength);
      const g = 250 * (i / bufferLength);
      const b = 50;

      canvasContext.fillStyle = `rgb(${r},${g},${b})`;
      canvasContext.fillRect(x, height - barHeight / 2, barWidth, barHeight / 2);

      x += barWidth + 1;
    }
  }

  draw();
  source.start(0);
}
