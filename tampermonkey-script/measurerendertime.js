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

    const runs = 1;
    const duration = 10000;

    let renderdata = JSON.parse(localStorage.getItem("renderdata") || "[]");
    let run = Number(localStorage.getItem("runCount") || 0);

    let frameTimes = [];
    let lastFrame = performance.now();
    let startTime = performance.now();

    function measureRenderTime() {
        const now = performance.now();
        const frameTime = now - lastFrame;
        lastFrame = now;
        frameTimes.push(frameTime);
        requestAnimationFrame(measureRenderTime);
    }

    measureRenderTime();

    setTimeout(() => {
        const elapsedSeconds = Math.floor((performance.now() - startTime) / 1000);

        for (let s = 0; s < elapsedSeconds; s++) {
            const start = Math.floor((frameTimes.length * s) / elapsedSeconds);
            const end = Math.floor((frameTimes.length * (s + 1)) / elapsedSeconds);

            const frameTimesInSecond = frameTimes.slice(start, end);
            const mean =
                frameTimesInSecond.reduce((a, b) => a + b, 0) / frameTimesInSecond.length;
            renderdata.push(Number(mean.toFixed(2)));
        }

        run++;
        localStorage.setItem("renderdata", JSON.stringify(renderdata));
        localStorage.setItem("runCount", run);

        if (run < runs) {
            location.reload();
        } else {
            download();
            localStorage.clear();
        }

    }, duration);


    function download() {
        const csv = "data:text/csv;charset=utf-8," + renderdata.join("\n");

        const a = document.createElement("a");
        a.href = encodeURI(csv);
        a.download = `webgl-three-renderTimeData.csv`
        //a.download = `webgl-babylon-renderTimeData.csv`
        //a.download = `webgpu-three-renderTimeData.csv`
        //a.download = `webgpu-babylon-renderTimeData.csv`
        a.click();

        alert("Done measuring rendering time");
    }

})();