function drawWaveform(audioData, container, index) {
  // 获取 DOM 元素
  const waveformContainer = d3.select(container)
    .append('div')
    .attr('class', 'waveform-item');

  // 设置 SVG 画布的大小
  const width = waveformContainer.node().getBoundingClientRect().width;
  const height = 200;

  // 创建 SVG 元素
  const svg = waveformContainer.append("svg")
    .attr("width", width)
    .attr("height", height);

  // 缩放函数,将音频数据映射到 SVG 画布上
  const x = d3.scaleLinear()
    .range([0, width]);
  const y = d3.scaleLinear()
    .range([height, 0]);

  // 绘制波形
  const line = d3.line()
    .x((d, i) => x(i / audioData.length * width))
    .y(d => y(d));

  svg.append("path")
    .datum(audioData)
    .attr("class", "waveform")
    .attr("d", line);
}
