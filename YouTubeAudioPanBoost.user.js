// ==UserScript==
// @name         YouTube Audio Pan & Boost
// @version      2026-03-05
// @description  Pan YouTube video audio left or right and boost up to x5
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==

(function() {
    'use strict';
    let panNode;
    let panButton;
    let slider;

    function toggleSlider() {
        panNode.pan.value = 0;
        slider.value = 0;
        const sliderHidden = slider.style.display === 'none';
        slider.style.display = sliderHidden ? 'block' : 'none';
    }

    function updatePanValue() {
        panNode.pan.value = slider.value/100;
    }

    function addButton() {
        const volumeArea = document.querySelector(".ytp-volume-area");

        console.log("addButton Pan");

        //create slider
        slider = document.createElement("input");
        slider.type = "range";
        slider.min = "-100";
        slider.max = "100";
        slider.step = "1";
        slider.value = "0";
        slider.style.width = "120px";
        slider.style.verticalAlign = "middle";
        slider.style.margin = "auto 1px";
        slider.style.display = "none";
        slider.oninput = updatePanValue;


        // Create Button, append it to volume controls
        panButton = document.createElement('button');
        panButton.id = 'panButton';
        panButton.style.background = 'none';
        panButton.style.border = 'none';
        panButton.style.cursor = 'pointer';
        panButton.style.marginLeft = '10px';
        panButton.style.marginRight = '4px';
        panButton.style.textShadow = '0px 0px 4px black';
        panButton.innerText = 'Pan';
        panButton.style.color = '#fff';
        panButton.style.fontWeight = 'bold';
        panButton.onclick = toggleSlider;
        volumeArea.after(panButton, slider);
    }

    document.addEventListener('yt-navigate-finish', () => {
        // Run the function every time you navigate to a new page
        if (!window.location.pathname.startsWith("/watch")) { return }

        let alreadyAppended = document.getElementById("panButton");
        console.log(alreadyAppended);
        if (!alreadyAppended) {
            addButton();
        }
        let audioCtx = new AudioContext();
        let video = document.querySelector("video");
        let source = audioCtx.createMediaElementSource(video);
        panNode = audioCtx.createStereoPanner();

        source.connect(panNode);
        panNode.connect(audioCtx.destination);


    })
})();