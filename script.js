// 音频文件路径
const audioFiles = [
  'audio/audio1.mp3',
  'audio/audio2.mp3',
  'audio/audio3.mp3'
];

// 页面切换功能
const waveformBtn = document.getElementById('waveform-btn');
const pitchBtn = document.getElementById('pitch-btn');
const waveformContainer = document.getElementById('waveform-container');
const pitchContainer = document.getElementById('pitch-container');

waveformBtn.addEventListener('click', () => {
  waveformContainer.style.display = 'block';
  pitchContainer.style.display = 'none';
});

pitchBtn.addEventListener('click', () => {
  waveformContainer.style.display = 'none';
  pitchContainer.style.display = 'block';
});

// 加载并绘制音频可视化
loadAndDrawAudioVisualizations();

function loadAndDrawAudioVisualizations() {
  const audioContext = new AudioContext();

  Promise.all(audioFiles.map(file =>
    fetch(file)
      .then(response => response.arrayBuffer())
      .then(buffer => audioContext.decodeAudioData(buffer))
  ))
  .then(audioDataList => {
    // 绘制波形图
    drawWaveforms(audioDataList, waveformContainer);

    // 绘制音高轨迹
    drawPitches(audioDataList, pitchContainer);
  })
  .catch(error => console.error('Error loading audio files:', error));
}

function drawWaveforms(audioDataList, container) {
  const waveformContainers = d3.select(container)
    .selectAll('.waveform-container')
    .data(audioDataList)
    .enter()
    .append('div')
    .attr('class', 'waveform-container');

  waveformContainers.each((audioData, i) => {
    drawWaveform(audioData.getChannelData(0), waveformContainers.node(), i);
  });
}

function drawPitches(audioDataList, container) {
  const pitchContainers = d3.select(container)
    .selectAll('.pitch-container')
    .data(audioDataList)
    .enter()
    .append('div')
    .attr('class', 'pitch-container');

  pitchContainers.each((audioData, i) => {
    drawPitch(audioData.getChannelData(0), pitchContainers.node(), i);
  });
}
