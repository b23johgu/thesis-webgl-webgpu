import * as BABYLON from 'babylonjs';

var canvas = document.getElementById('renderCanvas');
var engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});

var createScene = function(){
    /* Create scene */
    var scene = new BABYLON.Scene(engine);

    /* Create camera */
    var camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 25, -30), scene); // 0, 5, -30 (reminder)
    camera.setTarget(BABYLON.Vector3.Zero());

    /* Create light */
	var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.diffuse = new BABYLON.Color3.FromHexString("#ffffff");
    light.intensity = 0.2;

    var dirlight = new BABYLON.DirectionalLight('dirLight', new BABYLON.Vector3(-5, -10, 5), scene);
    dirlight.position = new BABYLON.Vector3(20, 40, 20);

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
    sphere.position.z = -18; // sphere start position

    /* Obstacles */
    const obstacles = []; // array to store obstacles
    const obstacleZPos = [-15, 13]; //z positions for three obstacles

    for( let i = 0; i < obstacleZPos.length; i++ ){
        const obstacle = BABYLON.MeshBuilder.CreateBox("box", {height: 2, width: 8, depth: 0.5});
        const obstacleMat = new BABYLON.StandardMaterial("obstacleMat");
        obstacleMat.diffuseColor = new BABYLON.Color3.FromHexString("#35c2de");
        obstacle.material = obstacleMat;
    
        obstacle.position.z = obstacleZPos[i];
    
        obstacles.push( obstacle );
    }

    // Cones
    const cones = [];
    const coneZPos = [-6, -6, 4];
    const coneXPos = [0, -3, 3];

    for( let i = 0; i < coneZPos.length; i++ ){
        const cone = BABYLON.MeshBuilder.CreateCylinder("cone", {height: 3, diameterTop: 0, diameterBottom: 2.5});
        const coneMat = new BABYLON.StandardMaterial("coneMat");
        coneMat.diffuseColor = new BABYLON.Color3.FromHexString("#853eb8");
        cone.material = coneMat;
    
        cone.position.x = coneXPos[i];
        cone.position.y = 1;
        cone.position.z = coneZPos[i];
    
        cones.push( cone );
    }

    /* Shadows */
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, dirlight);

    shadowGenerator.addShadowCaster(sphere);
    obstacles.forEach(obs => shadowGenerator.addShadowCaster(obs));
    cones.forEach(obs => shadowGenerator.addShadowCaster(obs));

    floor.receiveShadows = true;


    // Game Simulation
    var frameRate = 60;

    var zSlide = new BABYLON.Animation("zSlide", "position.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

    var keyFrames = []; 

    keyFrames.push({
        frame: 0,
        value: -18 // starts at sphere start position
    });

    keyFrames.push({
        frame: 10 * frameRate, // 10 seconds
        value: 18 // ends at end of floor
    });

    zSlide.setKeys(keyFrames);

    scene.beginDirectAnimation(sphere, [zSlide], 0, 10 * frameRate);



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