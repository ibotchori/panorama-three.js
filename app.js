const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 200);
const renderer = new THREE.WebGLRenderer();

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.2 // <-- camera totate speed
controls.enableZoom = false // <-- disable camera zoom


//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(30, 0, 0); // <-- camera position (x, y, z)
controls.update();


const geometry = new THREE.SphereGeometry(50, 32, 32); // <-- 3d sphere parameters

// instantiate a loader
const textureLoader = new THREE.TextureLoader()
// load a resource
const texture = textureLoader.load('image01.jpg') // <-- resource URL
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);


renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update() // <-- to turn on auto rotate
    renderer.render(scene, camera);

}
animate() // <-- runs after page refresh