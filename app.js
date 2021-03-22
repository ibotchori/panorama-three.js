const container = document.body  // variable for on click (Raycasting is used for mouse picking)

/****   Scene & Controls   ****/

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1.6, 0.1, 200);
const renderer = new THREE.WebGLRenderer();

const controls = new THREE.OrbitControls(camera, renderer.domElement)
controls.rotateSpeed = 0.2 // <-- camera totate speed
controls.enableZoom = false // <-- disable camera zoom
// controls.autoRotate = true // <-- enable auto rotate


//controls.update() must be called after any manual changes to the camera's transform
camera.position.set(-1, 0, 0); // <-- camera position (x, y, z)
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

function addTooltip(position, name) {
    let spriteMap = new THREE.TextureLoader().load('info.png');
    let spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap
    });
    let sprite = new THREE.Sprite(spriteMaterial);
    sprite.name = name
    // let position = new THREE.Vector3(10, 0, 0) // <-- sprite position (x, y, z)
    sprite.position.copy(position.clone().normalize().multiplyScalar(30)) // <-- set sprite position
    sprite.scale.multiplyScalar(2) // increase sprite size to 2
    scene.add(sprite);
}




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

//  Raycasting is used for mouse picking (working out what objects in the 3d space the mouse is over) amongst other things.
function onClick(e) { // <-- function for catch mouse click position
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    )
    // console.log(mouse) // < to catch mouse click position
    let rayCaster = new THREE.Raycaster()
    rayCaster.setFromCamera(mouse, camera)

    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function (intersect) { // <-- function for catch when sprite object is clicked
        if (intersect.object.type === 'Sprite') {
            console.log(intersect.object.name)
        }
    })


    /* // method to catch mouse click position
    let intersect = rayCaster.intersectObject(sphere)
    if (intersect.length > 0) {
        console.log(intersect[0].point) // < to catch mouse click position
        addTooltip(intersect[0].point)
    } */
}

addTooltip(new THREE.Vector3(43.33700726090634, -23.96948315971388, 5.274735906805975), "Enter") // <-- spprite position & sprite name 

window.addEventListener('resize', onResize) // runs onResize function on resize event
container.addEventListener('click', onClick) // runs onClick function on click event