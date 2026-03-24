let startTime = null; // when simulation first started
let startPosition = null; // spheres initial z-position

const duration = 10; // seconds
const speed = 3.5; // speed of sphere

const obstaclePos = [15, 5, -7]; // obstacle z-positions

const distanceToObstacle = 1; // Jump 1 unit before obstacle
let velocityY = 0;
const gravity = -0.018;
const jumpForce = 0.35;

export function GameSimulation( sphere, time ) {
    if ( !startTime ) startTime = time;
    if ( startPosition == null ) startPosition = sphere.position.z;

    const timeSinceStart = (time - startTime) / 1000; 
    
    if ( timeSinceStart < duration ) {
        const z = startPosition - speed * timeSinceStart;
        let y = sphere.position.y;

        // Jump over the obstacles
        for ( let i = 0; i < obstaclePos.length; i++ ) {
            const obstacle = obstaclePos[i];
            
            if ( z < obstacle && obstacle - z < distanceToObstacle && y <= 1 ) {
                velocityY = jumpForce;
            }
        }

        // Applying gravity for every frame
        velocityY += gravity;
        y += velocityY;

        // Check if floor is there to prevent falling through it
        if ( y < 1 ) {
            y = 1;
            velocityY = 0;
        }

        // returns spheres z (forward) and y (up/down) positions
        return { 
            z, y 
        };
    }
}