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

  // 绘制音高轨迹的占位符（这里用一个圆形代替）
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 50;

  svg.append("circle")
    .attr("cx", centerX)
    .attr("cy", centerY)
    .attr("r", radius)
    .attr("fill", "red");
}
