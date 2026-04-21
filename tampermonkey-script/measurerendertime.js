// ==UserScript==
// @name         Measure render time
// @namespace    http://tampermonkey.net/
// @author       Johanna Gustafsson
// @description  Measure and collect rendering time data
// @include      http://localhost:5173/webgl-three.html
// @include      http://localhost:5173/webgl-babylon.html
// @include      http://localhost:5173/webgpu-three.html
// @include      http://localhost:5173/webgpu-babylon.html
// ==/UserScript==

(function () {
    'use strict';

    let renderTimeLog = [];

    let startTime = performance.now();
    let lastFrameTime = startTime;

    function measureRenderTime() {
        const now = performance.now();
        const delta = now - lastFrameTime;

        if (now - startTime >= 1000) {
            renderTimeLog.push(delta.toFixed(2));
            startTime = now;
        }

        lastFrameTime = now;

        requestAnimationFrame(measureRenderTime);
    }

    measureRenderTime();

    setTimeout(() => {
        const csv = "data:text/csv;charset=utf-8," + renderTimeLog.join("\n");

        const a = document.createElement("a");
        a.href = encodeURI(csv);
        a.download = `webgl-three-renderTimeData.csv`
        //a.download = `webgl-babylon-renderTimeData.csv`
        //a.download = `webgpu-three-renderTimeData.csv`
        //a.download = `webgpu-babylon-renderTimeData.csv`

        document.body.appendChild(a);
        a.click();
        a.remove();

        alert("Done measuring rendering time");

        location.reload();
    }, 10000); // 10 seconds

})();