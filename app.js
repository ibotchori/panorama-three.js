

const container = document.body  // variable for on click (Raycasting is used for mouse picking)
const tooltip = document.querySelector('.tooltip') // information bar for sprite
let tooltipActive = false


class Scene {
    constructor(image) {
        this.image = image
        this.points = []
        this.sprites = []
        this.scene = null

    }
    createScene(scene) {
        this.scene = scene
        const geometry = new THREE.SphereGeometry(50, 32, 32); // <-- 3d sphere parameters

        // instantiate a loader & load a resource
        const texture = new THREE.TextureLoader().load(this.image) // <-- resource URL
        texture.wrapS = THREE.RepeatWrapping  // <-- remove mirror effect
        texture.repeat.x = -1 // <-- remove mirror effect 
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
        });
        material.transparent = true
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
        this.points.forEach(this.addTooltip.bind(this))


    }


    addPoint(point) {
        this.points.push(point)
    }



    addTooltip(point) {
        let spriteMap = new THREE.TextureLoader().load('info.png');
        let spriteMaterial = new THREE.SpriteMaterial({
            map: spriteMap
        });
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.name = point.name
        // let position = new THREE.Vector3(10, 0, 0) // <-- sprite position (x, y, z)
        sprite.position.copy(point.position.clone().normalize().multiplyScalar(30)) // <-- set sprite position
        sprite.scale.multiplyScalar(2) // increase sprite size to 2
        this.scene.add(sprite);
        this.sprites.push(sprite)
        sprite.onClick = () => {
            this.destroy()
            point.scene.createScene(scene)
            point.scene.appear()
        }
    }






    destroy() {
        TweenLite.to(this.sphere.material, 1, {
            opacity: 0,
            onComplete: () => {
                this.scene.remove(this.sphere)
            }
        })
        this.sprites.forEach((sprite) => {
            TweenLite.to(sprite.scale, 1, {
                x: 0,
                y: 0,
                z: 0,
                onComplete: () => {
                    this.scene.remove(sprite)
                }
            })
        })

    }




    appear() {
        this.sphere.material.opacity = 0;
        TweenLite.to(this.sphere.material, 1, {
            opacity: 1,
            /*  onComplete: () => {
                 this.scene.remove(this.sphere)
             } */
        })
        this.sprites.forEach((sprite) => {
            sprite.scale.set(0, 0, 0)
            TweenLite.to(sprite.scale, 1, {
                x: 2,
                y: 2,
                z: 2,
                /*  onComplete: () => {
                     this.scene.remove(sprite)
                 } */
            })
        })

    }

}




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

let s = new Scene('image01.jpg')
let s2 = new Scene('image02.jpg')
s.addPoint({
    position: new THREE.Vector3(43.33700726090634, -23.96948315971388, 5.274735906805975),
    name: 'Enter',
    scene: s2
})
s2.addPoint({
    position: new THREE.Vector3(1, 1, 0),
    name: 'Exit',
    scene: s
})
s.createScene(scene)




/****   Tooltip   ****/





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
const rayCaster = new THREE.Raycaster()

function onClick(e) { // <-- function for catch mouse click position
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    )
    // console.log(mouse) // < to catch mouse click position

    rayCaster.setFromCamera(mouse, camera)

    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function (intersect) { // <-- function for catch when sprite object is clicked
        if (intersect.object.type === 'Sprite') {
            intersect.object.onClick()
        }
    })


    /* // method to catch mouse click position
    let intersect = rayCaster.intersectObject(sphere)
    if (intersect.length > 0) {
        console.log(intersect[0].point) // < to catch mouse click position
        addTooltip(intersect[0].point)
    } */
}

function onMouseMove(e) {// <-- function for catch mouse movement
    let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        - (e.clientY / window.innerHeight) * 2 + 1
    )

    rayCaster.setFromCamera(mouse, camera)
    let foundSprite = false
    let intersects = rayCaster.intersectObjects(scene.children)
    intersects.forEach(function (intersect) { // <-- function for catch when sprite object is hover
        if (intersect.object.type === 'Sprite') {  // if sprite is hover
            let p = intersect.object.position.clone().project(camera) // <-- get sprite position (object)
            tooltip.style.top = ((-1 * p.y + 1) * window.innerHeight / 2) + 'px' // calc y position for sprite's information bar
            tooltip.style.left = ((p.x + 1) * window.innerWidth / 2) + 'px' // calc x position for sprite's information bar
            tooltip.classList.add('is-active') // add class to sprite's information bar 
            tooltip.innerHTML = intersect.object.name // to give own name to sprite's information bar 
            spriteActive = intersect.object
            foundSprite = true
            /* TweenLite.to(intersect.object.scale, 0.3, { // add animation on sprite
                x: 3,
                y: 3,
                z: 3
            }) */
        }
    })

    if (foundSprite === false /* && spriteActive */) { // if sprite is hover of
        tooltip.classList.remove('is-active')   // remove is-active class
        /*  TweenLite.to(spriteActive.scale, 0.3, { // remove animation from sprite
             x: 2,
             y: 2,
             z: 2
         }) */
        spriteActive = false
    }
}

//  addTooltip(new THREE.Vector3(43.33700726090634, -23.96948315971388, 5.274735906805975), "Enter") // <-- spprite position & sprite name 

window.addEventListener('resize', onResize) // runs onResize function on resize event
container.addEventListener('click', onClick) // runs onClick function on click event
container.addEventListener('mousemove', onMouseMove) // // runs onMouseMove function on mousemove event