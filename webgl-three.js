import * as THREE from 'three';

/* Create scene */
const scene = new THREE.Scene();

/* Create camera */
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 3, 5); // camera position x,y,z coordinates
camera.lookAt(0, 1, 0); // camera looks at coordinates 0,1,0 (the sphere)

/* WebGL renderer */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement ); // creates a canvas

/* Create light */
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 ); // overall soft warm light
scene.add( light );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 ); // dir light to give more effects to objects, like shadows/shine
scene.add( directionalLight );

/* Create floor */
const floorGeometry = new THREE.PlaneGeometry( 5, 5 );
const floorMaterial = new THREE.MeshStandardMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
const floor = new THREE.Mesh( floorGeometry, floorMaterial );
floor.rotation.x = -Math.PI / 2; // rotates floor (default for planegeometry is acting like a wall)
scene.add( floor );

/* Create a sphere */
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff , metalness: 0.5, roughness: 0.0 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = 1; //makes sphere appear to be on top of floor
scene.add( sphere );

/* Render the scene */
function animate( time ) {
    renderer.render( scene, camera );
}
