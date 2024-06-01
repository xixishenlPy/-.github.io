// script.js
document.addEventListener("DOMContentLoaded", function() {
    var wavesurfer1 = WaveSurfer.create({
        container: '#waveform-container',
        waveColor: 'blue',
        progressColor: 'purple'
    });

    var wavesurfer2 = WaveSurfer.create({
        container: '#pitch-container',
        waveColor: 'green',
        progressColor: 'yellow'
    });

    var audioFiles = [
        'audio/audio1.mp3',
        'audio/audio2.mp3',
        'audio/audio3.mp3'
    ];

    audioFiles.forEach(function(audioFile, index) {
        var waveformButton = document.createElement('button');
        waveformButton.textContent = 'Waveform ' + (index + 1);
        waveformButton.addEventListener('click', function() {
            wavesurfer1.load(audioFile);
        });
        document.getElementById('page1').appendChild(waveformButton);

        var pitchButton = document.createElement('button');
        pitchButton.textContent = 'Pitch ' + (index + 1);
        pitchButton.addEventListener('click', function() {
            visualizePitch(audioFile);
        });
        document.getElementById('page2').appendChild(pitchButton);
    });

    document.getElementById('play-all1').addEventListener('click', function() {
        audioFiles.forEach(function(audioFile) {
            wavesurfer1.load(audioFile);
            wavesurfer1.play();
        });
    });

    document.getElementById('play-all2').addEventListener('click', function() {
        audioFiles.forEach(function(audioFile) {
            visualizePitch(audioFile);
        });
    });

    function visualizePitch(audioFile) {
        var midi = new Tone.Midi(audioFile);
        midi.load().then(function() {
            var svgContainer = document.createElement('div');
            document.getElementById('pitch-container').appendChild(svgContainer);
            midi.toSVG(svgContainer);
        });
    }
});
