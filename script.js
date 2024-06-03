var audioContext = new AudioContext();

var chart1 = echarts.init(document.getElementById('chart1'));
var chart2 = echarts.init(document.getElementById('chart2'));
var chart3 = echarts.init(document.getElementById('chart3'));

var analyser1 = audioContext.createAnalyser();
var analyser2 = audioContext.createAnalyser();
var analyser3 = audioContext.createAnalyser();

var audio1 = document.getElementById('audio1');
var audio2 = document.getElementById('audio2');
var audio3 = document.getElementById('audio3');

var playAllButton = document.getElementById('playAllButton');

playAllButton.addEventListener('click', function() {
    audio1.play();
    audio2.play();
    audio3.play();
});

setupAudio(audio1, analyser1, chart1);
setupAudio(audio2, analyser2, chart2);
setupAudio(audio3, analyser3, chart3);

function setupAudio(audio, analyser, chart) {
    audio.addEventListener('canplay', function() {
        var source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        drawWaveform(analyser, chart);
    });
}

function drawWaveform(analyser, chart) {
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    
    var option = {
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: Array.from({ length: bufferLength }).map((_, i) => i)
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 255
        },
        series: [{
            data: [],
            type: 'line',
            smooth: true
        }]
    };

    chart.setOption(option);

    function updateChart() {
        requestAnimationFrame(updateChart);
        analyser.getByteTimeDomainData(dataArray);
        chart.setOption({
            series: [{
                data: Array.from(dataArray)
            }]
        });
    }

    updateChart();
}
