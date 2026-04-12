import * as THREE from 'three';

/* Create scene */
const scene = new THREE.Scene();

/* WebGL renderer */
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement); // creates a canvas

/* Create camera */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 30); // 0,5,30 (reminder if changing positions)

/* Create light */
const light = new THREE.HemisphereLight(0xffffff, 0x000000, 0.7); // overall soft white light shining from top
scene.add(light);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // dir light to give more effects to objects, like shadows/shine
directionalLight.position.set(10, 20, 15);
directionalLight.castShadow = true;

// Positions for lightning to make shadows appear
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;

directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 50;

scene.add(directionalLight);

/* Create floor */
const floorGeometry = new THREE.PlaneGeometry(10, 40); // width , length
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // rotates floor (default for planegeometry is acting like a wall)
floor.receiveShadow = true;
scene.add(floor);

/* Create a sphere */
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff , metalness: 0.5, roughness: 0.0 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 1; //makes sphere appear to be on top of floor
sphere.position.z = 18; //sphere begins at the nearest part of floor, floor is 40 (20 on each side of middle)
sphere.castShadow = true;
scene.add(sphere);

/* Create obstacles */
const obstacles = []; // array to store obstacles
const obstaclePos = [15, -13]; //z positions for three obstacles

for( let i = 0; i < obstaclePos.length; i++ ){
    const boxGeometry = new THREE.BoxGeometry(8, 3, 0.5); // width, height, depth of obstacle
    const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x35c2de });
    const obstacle = new THREE.Mesh(boxGeometry, boxMaterial);

    obstacle.position.z = obstaclePos[i];
    obstacle.position.y = 1;

    obstacle.castShadow = true;
    obstacle.receiveShadow = true;

    obstacles.push( obstacle );
    scene.add( obstacle );
}

// Cones
const cones = [];
const coneZPos = [6, 6, -4];
const coneXPos = [0, -3, 3];

for( let i = 0; i < coneZPos.length; i++ ){
    const coneGeometry = new THREE.ConeGeometry(2, 4); 
    const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x853eb8 });
    const cone = new THREE.Mesh(coneGeometry, coneMaterial);
    cone.castShadow = true;

    cone.position.x = coneXPos[i];
    cone.position.y = 1;
    cone.position.z = coneZPos[i];

    cones.push(cone);
    scene.add(cone);
}

/* Game Simulation */
const points = [    // x  y  z
    new THREE.Vector3(0, 1, 18), // start
    // First jump
    new THREE.Vector3(0, 1, 17), // begin jump
    new THREE.Vector3(0, 4, 15), // highest part of jump
    new THREE.Vector3(0, 1, 12), // land after jumping
    // Avoid cones
    new THREE.Vector3(0, 1, 10),
    new THREE.Vector3(3, 1, 8), // turn right 2 units before cone
    new THREE.Vector3(3, 1, 0), // stay to the right
    new THREE.Vector3(0, 1, -2), // turn left 2 units before cone
    // Second jump
    new THREE.Vector3(0, 1, -11), // begin jump
    new THREE.Vector3(0, 4, -13), // highest part of jump
    new THREE.Vector3(0, 1, -16), // land after jumping

    new THREE.Vector3(0, 1, -18) // end
]

const path = new THREE.CatmullRomCurve3(points);

/*
// Visual red help line to see path smooth movement throughout animation (REMOVE COMMMENT SIGNS TO REVEAL)
const pathGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(50));
const pathMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
const pathObject = new THREE.Line(pathGeometry, pathMaterial);
scene.add(pathObject);
*/

/* Render the scene */
function animate(time) {
    const duration = 10 // 10 seconds
    const t = Math.min((time * 0.001) / duration, 1);
    
    const position = path.getPointAt(t);
    sphere.position.copy(position);

    // Camera follows sphere
    camera.position.z = sphere.position.z + 10;
    camera.position.y = sphere.position.y + 5;
    camera.lookAt(sphere.position);

    renderer.render(scene, camera);
}