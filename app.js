/****   Scene & Controls   ****/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 200);
const renderer = new THREE.WebGLRenderer();

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.2 // <-- camera totate speed
controls.enableZoom = false // <-- disable camera zoom
// controls.autoRotate = true // <-- enable auto rotate


//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(-30, 0, 0); // <-- camera position (x, y, z)
controls.update();




/****   Sphere   ****/

const geometry = new THREE.SphereGeometry(50, 32, 32); // <-- 3d sphere parameters

// instantiate a loader & load a resource
const texture = new THREE.TextureLoader().load('image01.jpg') // <-- resource URL
texture.wrapS = THREE.RepeatWrapping  // <-- remove mirror effect
texture.repeat.x = -1 // <-- remove mirror effect 
const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);




/****   Tooltip   ****/
const spriteMap = new THREE.TextureLoader().load('info.png');
const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteMap
});
const sprite = new THREE.Sprite(spriteMaterial);
const position = new THREE.Vector3(10, 0, 0) // <-- sprite position (x, y, z)
sprite.position.copy(position) // <-- set sprite position

scene.add(sprite);



/****   Render   ****/

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    // controls.update() // <-- to turn on auto rotate
    renderer.render(scene, camera);

}
animate() // <-- runs after page refresh

function onResize() { // function for page resize 
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
}
window.addEventListener('resize', onResize) // runs onResize function on resize event