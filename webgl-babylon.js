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
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

    /* Create floor */
    var ground = BABYLON.MeshBuilder.CreateGround("ground1", { width: 10, height: 40, subdivisions: 2, updatable: false }, scene);

    /* Create a sphere */
    var sphere = BABYLON.MeshBuilder.CreateSphere('sphere1', {segments: 16, diameter: 2, sideOrientation: BABYLON.Mesh.FRONTSIDE}, scene);
    sphere.position.y = 1; //makes sphere appear to be on top of floor
    sphere.position.z = -19;

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