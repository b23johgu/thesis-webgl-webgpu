// ==UserScript==
// @name         Measure FPS
// @namespace    http://tampermonkey.net/
// @author       Johanna Gustafsson
// @description  Measure and collect FPS data
// @include      http://localhost:5173/webgl-three.html
// @include      http://localhost:5173/webgl-babylon.html
// @include      http://localhost:5173/webgpu-three.html
// @include      http://localhost:5173/webgpu-babylon.html
// ==/UserScript==

(function () {
    'use strict';

    let frames = 0;
    let fpsLog = [];

    let startTime = performance.now();

    function measurefps(now) {
        frames++;

        if (now - startTime >= 1000) {
            fpsLog.push(frames);
            frames = 0;
            startTime = now;
        }
        requestAnimationFrame(measurefps);
    }

    measurefps();

    setTimeout(() => {
        const csv = "data:text/csv;charset=utf-8," + fpsLog.join("\n");

        const a = document.createElement("a");
        a.href = encodeURI(csv);
        a.download = `webgl-three-fpsdata.csv`
        //a.download = `webgl-babylon-fpsdata.csv`
        //a.download = `webgpu-three-fpsdata.csv`
        //a.download = `webgpu-babylon-fpsdata.csv`
        document.body.appendChild(a);
        a.click();
        a.remove();

        alert("Done measuring FPS");

        location.reload();
    }, 10000); // measure for 10 seconds

})();
