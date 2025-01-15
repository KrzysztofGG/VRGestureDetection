// import { Camera } from 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
// import { Hands } from 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js';

import ObjectGrabber from './objectGrabber.js';
import './cube.js';
import './hand_landmarks.js';
import './hand_connections.js';
// import * as Utils from './utils.js';
import { prepareListenerForVRButton, translateLandmarkPointToAFrame } from './utils.js';

// const CUBE_DIMENSION = 1
// const ANGLE_THRESHOLD = 30;
// const GRAB_THRESHOLD = Math.sqrt(Math.pow(CUBE_DIMENSION/2, 2) + Math.pow((CUBE_DIMENSION * Math.sqrt(2))/2, 2));

// let hands; // Declare hands variable globally
// let camera; // Declare camera variable globally
// let currentStream = null; // To hold the current camera stream

// let videoElement;// = document.getElementById('input_video');
// let cameraSelect;// = document.getElementById('camera-select');

// async function loadScripts() {
//     try {
//         for (const script of Utils.scripts) {
//             await Utils.loadScript(script);
//         }
//         console.log('All scripts loaded successfully!');
//         // Now you can use Mediapipe
//     } catch (err) {
//         console.error('Error loading scripts:', err);
//     }
// }

// Call the loadScripts function
// loadScripts();

// async function initializeHandDetection(videoElement) {
//     hands = new Hands({
//         locateFile: (file) => {
//             return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
//         }
//     });

//     hands.setOptions({
//         maxNumHands: 1,
//         modelComplexity: 1,
//         minDetectionConfidence: 0.5,
//         minTrackingConfidence: 0.5
//     });

//     hands.onResults(onResults);
    

//     camera = new Camera(videoElement, {
//         onFrame: async () => {
//             await hands.send({ image: videoElement });
//         }
//     });
//     await camera.start();
//     console.log("Hand detection algorithm initialized")
// }

let objectGrabber;
let CUBE_DIMENSION = 1;
let cameraSelect;

window.addEventListener('load', async () => {
    cameraSelect = document.getElementById('camera-select');
    let videoElement = document.getElementById('input_video');
    const cube = document.getElementById('cube')

    cube.setAttribute('width', CUBE_DIMENSION)
    cube.setAttribute('height', CUBE_DIMENSION)
    cube.setAttribute('depth', CUBE_DIMENSION)

    cube.setAttribute('position', {x: 0, y: CUBE_DIMENSION/2, z: -2.75 });

    await getCameraDevices();
    if (cameraSelect.options.length > 0) {
        objectGrabber = ObjectGrabber.getInstance(cube, CUBE_DIMENSION, 30, videoElement, cameraSelect.value, translateLandmarkPointToAFrame);
    }

    cameraSelect.addEventListener('change', (event) => {
        console.log(event)
        const selectedDeviceId = event.target.value;
        objectGrabber.setCamera(selectedDeviceId);
        // startCamera(selectedDeviceId);
    });
    
    //make sure cube has correct dimensions
    prepareListenerForVRButton()
});

async function getCameraDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    

    // Clear existing options
    cameraSelect.innerHTML = '';

    // Populate the dropdown with available cameras
    videoDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Camera ${cameraSelect.length + 1}`;
        cameraSelect.appendChild(option);
    });

    // Set the first camera as the default
    if (videoDevices.length > 0) {
        cameraSelect.value = videoDevices[0].deviceId;
    }
    console.log("Camera set: " + cameraSelect.value) 
}


