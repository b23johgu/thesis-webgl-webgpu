import * as THREE from 'three';

/* Create scene */
const scene = new THREE.Scene();

/* Create camera */
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 5, 25); // camera position x,y,z coordinates
camera.lookAt(0, 1, 0); // camera looks at coordinates 0,1,0 (the sphere)

/* WebGL renderer */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.shadowMap.enabled = true; // Enable shadows
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement ); // creates a canvas

/* Create light */
const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 0.7 ); // overall soft white light shining from top
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 ); // dir light to give more effects to objects, like shadows/shine
directionalLight.castShadow = true;
scene.add( directionalLight );

/* Create floor */
const floorGeometry = new THREE.PlaneGeometry( 10, 40 ); // width , length
const floorMaterial = new THREE.MeshStandardMaterial( { color: 0xcccccc, side: THREE.DoubleSide } );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = -Math.PI / 2; // rotates floor (default for planegeometry is acting like a wall)
floor.receiveShadow = true;
scene.add( floor );

/* Create a sphere */
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff , metalness: 0.5, roughness: 0.0 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 1; //makes sphere appear to be on top of floor
sphere.position.z = 18; //sphere begins at the nearest part of floor, floor is 40 (20 on each side of middle)
sphere.castShadow = true;
scene.add( sphere );

/* Render the scene */
function animate( time ) {
    renderer.render( scene, camera );
}
