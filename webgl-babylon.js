import * as BABYLON from 'babylonjs';

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

var createScene = function(){
    /* Create scene */
    var scene = new BABYLON.Scene(engine);

    /* Create camera */
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -30), scene);
    camera.setTarget(BABYLON.Vector3.Zero());

    /* Create light */
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3.FromHexString("#ffffff");
    light.groundColor = new BABYLON.Color3.FromHexString("#080820");
    light.intensity = 0.2;

    var dirlight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(0, -10, 5), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);

    /* Create floor */
    var floor = BABYLON.MeshBuilder.CreateGround("ground1", { width: 10, height: 40, subdivisions: 2, updatable: false }, scene);
    const floorMat = new BABYLON.StandardMaterial("floorMat");
    floorMat.diffuseColor = new BABYLON.Color3.FromHexString("#cccccc");
    floor.material = floorMat;

    /* Create a sphere */
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE}, scene);
    const sphereMat = new BABYLON.StandardMaterial("sphereMat");
    sphereMat.diffuseColor = new BABYLON.Color3.FromHexString("#ff00ff");
    sphere.material = sphereMat;

    sphere.position.y = 1; //makes sphere appear to be on top of floor
    sphere.position.z = -19; // sphere start position

    /* Shadows */
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, dirlight);
    floor.receiveShadows = true; // floor recieves shadow
    shadowGenerator.getShadowMap().renderList.push(sphere); // sphere makes shadow

    return scene;
}

/* Render the scene */
var scene = createScene();

engine.runRenderLoop(function(){
    scene.render();
});

// canvas/window resize event handler
window.addEventListener('resize', function(){
    engine.resize();
});