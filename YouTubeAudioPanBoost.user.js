// ==UserScript==
// @name         YouTube Audio Pan & Boost
// @version      0.2.2
// @description  Pan YouTube video audio left or right and boost up to x5
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// ==/UserScript==

(function() {
    'use strict';
    let panNode;
    let panButton;
    let panSlider;
    let gainNode;
    let boostButton;
    let boostSlider;

    function togglePanSlider() {
        panNode.pan.value = 0;
        panSlider.value = 0;
        const sliderHidden = panSlider.style.display === 'none';
        panSlider.style.display = sliderHidden ? 'block' : 'none';
    }

    function toggleBoostSlider() {
        const sliderHidden = boostSlider.style.display === 'none';
        boostSlider.style.display = sliderHidden ? 'block' : 'none';
    }

    function updatePanValue() {
        panNode.pan.value = panSlider.value/100;
    }

    function updateGainValue() {
        gainNode.gain.value = boostSlider.value;
        boostButton.innerText = `x${Number(boostSlider.value).toFixed(2)}`;
    }

    function createButton(name, inner, callback) {
        let button;
        button = document.createElement('button');
        button.id = `${name}Button`;
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '5px';
        //button.style.marginRight = '4px';
        button.style.textShadow = '0px 0px 4px black';
        button.innerText = inner;
        button.style.color = '#fff';
        button.style.fontWeight = 'bold';
        button.onclick = callback;
        return button;
    }

    function createSlider(name, min, max, step, width, callback) {
        let slider;
        slider = document.createElement("input");
        slider.id = `${name}Slider`;
        slider.type = "range";
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = min;
        slider.style.width = width;
        slider.style.verticalAlign = "middle";
        slider.style.margin = "auto 1px";
        slider.style.display = "none";
        slider.oninput = callback;
        return slider;
    }

    function addButtons() {
        const volumeArea = document.querySelector(".ytp-volume-area");

        console.log("addButtons");

        //create sliders
        panSlider = createSlider("pan", "-100", "100", "1", "120px", updatePanValue);
        panSlider.value = "0";

        boostSlider = createSlider("boost", "1", "5", "0.25", "90px", updateGainValue);
        boostSlider.value = "1"

        // Create Buttons, append elements to volume controls
        panButton = createButton("pan", "Pan", togglePanSlider);
        boostButton = createButton("boost", "x1.00", toggleBoostSlider);
        volumeArea.after(boostButton, boostSlider, panButton, panSlider);
        console.log("cliwidth: " + boostButton.clientWidth);
        boostButton.style.width = (boostButton.clientWidth+5) + "px";
    }

    function resetValues() {

        console.log("Reset pan and gain value");

        if (panNode) {
            panSlider.style.display = 'none';
            panNode.pan.value = 0;
            panSlider.value = 0;
        }

        if (gainNode) {
            boostSlider.style.display = 'none';
            boostSlider.value = 0;
            updateGainValue();
        }

    }

    document.addEventListener('yt-navigate-finish', () => {
        // Run the function every time you navigate to a new page
        if (!window.location.pathname.startsWith("/watch")) { return }

        let alreadyAppended = document.getElementById("panButton");
        console.log(alreadyAppended);
        if (alreadyAppended) {
            resetValues();
            return;
        }
        addButtons();
        let audioCtx = new AudioContext();
        let video = document.querySelector("video");
        let source = audioCtx.createMediaElementSource(video);
        panNode = audioCtx.createStereoPanner();
        gainNode = audioCtx.createGain();

        source.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(audioCtx.destination);


    })
})();