// 定义需要可视化的音频文件URL
const audioUrls = [
  'https://github.com/xixishenlPy/sound.github.io/blob/main/audio/古筝版.MP3',
  'https://github.com/xixishenlPy/sound.github.io/blob/main/audio/吉他版.MP3',
  'https://github.com/xixishenlPy/sound.github.io/blob/main/audio/钢琴版.MP3'
];

// 创建Audio元素并加载音频文件
const audioElements = audioUrls.map(url => {
  const audio = new Audio(url);
  return audio;
});

// 使用Web Audio API获取波形数据
const audioContext = new AudioContext();
const audioSources = audioElements.map(audio => audioContext.createMediaElementSource(audio));
const analysers = audioSources.map(source => {
  const analyser = audioContext.createAnalyser();
  source.connect(analyser);
  return analyser;
});

// 将波形数据转换为ECharts所需的格式
function getWaveform(analyser) {
  const bufferLength = analyser.fftSize;
  const waveformData = new Float32Array(bufferLength);
  analyser.getFloatTimeDomainData(waveformData);

  const waveform = waveformData.map((value, index) => [index, value]);
  return waveform;
}

// 使用ECharts绘制多个波形图
const myChart = echarts.init(document.getElementById('waveform'));
myChart.setOption({
  title: {
    text: '多音频波形对比'
  },
  legend: {
    data: ['古筝版', '吉他版', '钢琴版']
  },
  xAxis: {
    type: 'category',
    name: 'Time'
  },
  yAxis: {
    type: 'value',
    name: 'Amplitude'
  },
  series: audioSources.map((source, index) => ({
    type: 'line',
    name: ['古筝版', '吉他版', '钢琴版'][index],
    data: getWaveform(analysers[index])
  }))
});
