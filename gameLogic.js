let startTime = null;
let startPosition = null;

const moveDuration = 10000;
const speed = 3.5;

export function GameSimulation( sphere, time ) {
    if ( !startTime ) startTime = time;
    if ( startPosition == null ) startPosition = sphere.position.z;

    const timeSinceStart = time - startTime; // time passed since start of animation

    if ( timeSinceStart < moveDuration ) { // move sphere within time of moveDuration
        const secondsPassed = timeSinceStart / 1000;

        // return updates position of sphere
        return {
            z: startPosition - speed * secondsPassed
        };
    }
}