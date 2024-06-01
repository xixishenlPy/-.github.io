function drawPitch(audioData, container, index) {
  // 获取 DOM 元素
  const pitchContainer = d3.select(container)
    .append('div')
    .attr('class', 'pitch-item');

  // 设置 SVG 画布的大小
  const width = pitchContainer.node().getBoundingClientRect().width;
  const height = 200;

  // 创建 SVG 元素
  const svg = pitchContainer.append("svg")
    .attr("width", width)
    .attr("height", height);

  // 缩放函数,将音高数据映射到 SVG 画布上
  const x = d3.scaleLinear()
    .range([0, width]);
  const y = d3.scaleLinear()
    .range([height, 0]);

  // 计算音高数据
  const pitchData = getPitchData(audioData);

  // 绘制音高轨迹
  const line = d3.line()
    .x((d, i) => x(i / pitchData.length * width))
    .y(d => y(d));

  svg.append("path")
    .datum(pitchData)
    .attr("class", "pitch")
    .attr("d", line);
}

function getPitchData(audioData) {
  // 使用 Pitchfinder 库计算音高数据
  const pitchDetector = Pitchfinder.YIN();
  const pitchData = [];

  for (let i = 0; i < audioData.length; i += 512) {
    const chunk = audioData.slice(i, i + 512);
    const pitch = pitchDetector(chunk);
    pitchData.push(pitch || 0);
  }

  return pitchData;
}
