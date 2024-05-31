document.getElementById('audioUpload').addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const audioPlayer = document.getElementById('audioPlayer');
        const audioURL = URL.createObjectURL(file);
        audioPlayer.src = audioURL;
        audioPlayer.load();
        audioPlayer.style.display = 'block';

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const reader = new FileReader();
        reader.onload = function(e) {
            audioContext.decodeAudioData(e.target.result, function(buffer) {
                visualize(buffer);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

function visualize(buffer) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.start();

    // Three.js setup for 3D visualization
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 800 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 400);
    document.getElementById('visualization').appendChild(renderer.domElement);

    const bars = [];
    const barWidth = 800 / bufferLength;

    for (let i = 0; i < bufferLength; i++) {
        const geometry = new THREE.BoxGeometry(barWidth, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = (i - bufferLength / 2) * barWidth;
        scene.add(bar);
        bars.push(bar);
    }

    camera.position.z = 100;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    function draw() {
        requestAnimationFrame(draw);

        analyser.getByteFrequencyData(dataArray);

        for (let i = 0; i < bufferLength; i++) {
            bars[i].scale.y = dataArray[i] / 128.0;
            bars[i].material.color.setHSL(dataArray[i] / 255, 1, 0.5);
        }

        controls.update();
        renderer.render(scene, camera);
    }

    draw();
}
