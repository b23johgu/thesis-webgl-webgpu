import * as BABYLON from 'babylonjs';

async function createScene() {
    var canvas = document.getElementById('renderCanvas');
    const webgpuSupport = await BABYLON.WebGPUEngine.IsSupportedAsync;

    if (!webgpuSupport) {
        document.body.innerHTML = "<h1>WebGPU is not supported on this browser.</h1>";
        return;
    }

    /* WebGPU renderer */
    const engine = new BABYLON.WebGPUEngine(canvas);
    await engine.initAsync();

    /* Create scene */
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3.FromHexString("#000000");
    

    /* Create camera */
    var camera = new BABYLON.UniversalCamera('camera1', new BABYLON.Vector3(0, 5, -30), scene); // 0, 5, -30 (reminder)
    
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
    const obstacleZPos = [-15, 13]; //z positions for obstacles

    for( let i = 0; i < obstacleZPos.length; i++ ){
        const obstacle = BABYLON.MeshBuilder.CreateBox("box", {height: 2, width: 8, depth: 0.5});
        const obstacleMat = new BABYLON.StandardMaterial("obstacleMat");
        obstacleMat.diffuseColor = new BABYLON.Color3.FromHexString("#35c2de");
        obstacle.material = obstacleMat;
    
        obstacle.position.y = 1;
        obstacle.position.z = obstacleZPos[i];

        obstacle.receiveShadows = true;
    
        obstacles.push( obstacle );
    }

    /* Cones */
    const cones = [];
    const coneZPos = [-6, -6, 4];
    const coneXPos = [0, -3, 3];

    for( let i = 0; i < coneZPos.length; i++ ){
        const cone = BABYLON.MeshBuilder.CreateCylinder("cone", {height: 4, diameterTop: 0, diameterBottom: 4});
        const coneMat = new BABYLON.StandardMaterial("coneMat");
        coneMat.diffuseColor = new BABYLON.Color3.FromHexString("#853eb8");
        cone.material = coneMat;
    
        cone.position.x = coneXPos[i];
        cone.position.y = 1;
        cone.position.z = coneZPos[i];

        cone.receiveShadows = true;
    
        cones.push( cone );
    }

    /* Particles in "air" */
    const particles = [];

    for (let i = 0; i < 1000; i++) {
        const particle = BABYLON.MeshBuilder.CreateSphere( 'particle', { segments: 16, diameter: 0.1, sideOrientation: BABYLON.Mesh.FRONTSIDE }, scene );
        const particleMat = new BABYLON.StandardMaterial("particleMat");
        particleMat.diffuseColor = BABYLON.Color3.FromHexString("#ffffff");
        particle.material = particleMat;

        particle.position.set(
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 100
        );

        particles.push(particle);
    }

    /* Shadows */
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, dirlight);

    shadowGenerator.addShadowCaster(sphere);
    obstacles.forEach(obs => shadowGenerator.addShadowCaster(obs));
    cones.forEach(obs => shadowGenerator.addShadowCaster(obs));

    floor.receiveShadows = true;

    /* Game Simulation */
    var points = BABYLON.Curve3.CreateCatmullRomSpline(
        [
        new BABYLON.Vector3(0, 1, -18), // start
        // First jump
        new BABYLON.Vector3(0, 1, -17), // begin jump
        new BABYLON.Vector3(0, 4, -15), // highest part of jump
        new BABYLON.Vector3(0, 1, -12), // land after jumping
        // Avoid cones
        new BABYLON.Vector3(0, 1, -10),
        new BABYLON.Vector3(3, 1, -8), // turn right 2 units before cone
        new BABYLON.Vector3(3, 1, 0), // stay to the right
        new BABYLON.Vector3(0, 1, 2), // turn left 2 units before cone
        // Second jump
        new BABYLON.Vector3(0, 1, 11), // begin jump
        new BABYLON.Vector3(0, 4, 13), // highest part of jump
        new BABYLON.Vector3(0, 1, 16), // land after jumping

        new BABYLON.Vector3(0, 1, 18) // end
        ],
        60);

/*
    // Visual red help line to see path smooth movement throughout animation (REMOVE COMMMENT SIGNS TO REVEAL)
    var path = BABYLON.MeshBuilder.CreateLines("path", { points: points.getPoints() }, scene);
    const pathMat = new BABYLON.StandardMaterial("pathMat", scene);
    pathMat.emissiveColor = new BABYLON.Color3.FromHexString("#ff0000");
    path.material = pathMat;
*/

    // Converts "points" to Path3D which generates evenly spaced points along the path for smoother movement
    var path3D = new BABYLON.Path3D(points.getPoints()); 
    var pathPoints = path3D.getPoints();

    const duration = 10; // 10 seconds
    let startTime = performance.now();

    engine.runRenderLoop(function(){
        const elapsed = (performance.now() - startTime) / 1000; // gives elapsed milliseconds since animation started, divide by 1000 to convert to seconds
        //const t = Math.min(elapsed / duration, 1); //Play once
        const t = (elapsed / duration) % 1; // Loop

        const index = Math.floor(t * (pathPoints.length - 1));
        sphere.position.copyFrom(pathPoints[index]);

        // Checks every frame where sphere is and positions camera to follow it
        camera.position.z = sphere.position.z - 10;
        camera.position.y = sphere.position.y + 5;
        camera.setTarget(sphere.position);

        scene.render();
    });

    return scene;
}

/* Canvas/window resize event handler */
window.addEventListener('resize', function(){engine.resize();});

/* Render the scene */
createScene();