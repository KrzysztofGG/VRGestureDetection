const CUBE_DIMENSION = 1

const ANGLE_THRESHOLD = 30;
const GRAB_THRESHOLD = Math.sqrt(Math.pow(CUBE_DIMENSION/2, 2) + Math.pow((CUBE_DIMENSION * Math.sqrt(2))/2, 2));

let hands; // Declare hands variable globally
let camera; // Declare camera variable globally
let currentStream = null; // To hold the current camera stream

let videoElement;// = document.getElementById('input_video');
let cameraSelect;// = document.getElementById('camera-select');

async function initializeHandDetection(videoElement) {
    hands = new Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        }
    });
    await camera.start();
    console.log("Hand detection algorithm initialized")
}

window.addEventListener('load', async () => {
    cameraSelect = document.getElementById('camera-select');
    videoElement = document.getElementById('input_video');

    await getCameraDevices();
    if (cameraSelect.options.length > 0) {
        startCamera(cameraSelect.value);
    }

    // const cube
    const cube = document.getElementById('cube')
    //make sure cube has correct dimensions
    cube.setAttribute('width', CUBE_DIMENSION)
    cube.setAttribute('height', CUBE_DIMENSION)
    cube.setAttribute('depth', CUBE_DIMENSION)
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

async function startCamera(deviceId) {
    

    // Stop the current stream if it exists
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
    try {
        // Start the new camera stream
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: deviceId } }
        });
        videoElement.srcObject = currentStream;
        console.log("video element source updated to: " + currentStream.id)
        
        // Restart hand detection with the new camera
        initializeHandDetection(videoElement); // Initialize hand detection with the video element
    } catch (error) {
        console.error('Error accessing media devices.', error);
    }
}

cameraSelect.addEventListener('change', (event) => {
    console.log(event)
    const selectedDeviceId = event.target.value;
    startCamera(selectedDeviceId);
});

function onResults(results) {
    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            detectGrabGesture(landmarks);
            drawHandObjects(landmarks)
        }
    }
}

function detectGrabGesture(landmarks) {
    // console.log("landmark: " + landmarks[4].z)
    const thumbTip = translateLandmarkPointToAFrame(landmarks[4]);
    // console.log("Aframe: " + thumbTip.z)
    const indexTip = translateLandmarkPointToAFrame(landmarks[8]);
    const wrist = translateLandmarkPointToAFrame(landmarks[0]);

    // const pinchDistance = calculateDistance(thumbTip, indexTip);
    const fingersAngle = calculateAngle3D(indexTip, wrist, thumbTip);
    
    // Get the cube's position
    const cubePosition = cube.getAttribute('position');

    // Calculate distances from cube center
    const thumbDistanceToCube = calculateDistance(thumbTip, cubePosition);
    const indexDistanceToCube = calculateDistance(indexTip, cubePosition);

    const isCloseToCube = thumbDistanceToCube <= GRAB_THRESHOLD && indexDistanceToCube <= GRAB_THRESHOLD;
    
    const isGrabbed = 
        fingersAngle < ANGLE_THRESHOLD && isCloseToCube;

    if (isGrabbed != cube.components['falling-cube'].data.isGrabbed) {
        cube.components['falling-cube'].setGrabbed(isGrabbed);
    }

    // return isGrabbed;
}


function drawHandObjects(landmarks) {
    // Update hand landmarks
    const handLandmarksComponent = document.getElementById('hand-landmarks').components['hand-landmarks'];
    handLandmarksComponent.updateLandmarks(landmarks);

    // Update hand connections
    const handConnectionsComponent = document.getElementById('hand-connections').components['hand-connections'];
    handConnectionsComponent.updateConnections(landmarks); // Update connections based on landmarks

    const thumbPosition = translateLandmarkPointToAFrame(landmarks[4]);
    const indexPosition = translateLandmarkPointToAFrame(landmarks[8]);
    
    const averagePosition = {
        x: (thumbPosition.x + indexPosition.x) / 2,
        y: (thumbPosition.y + indexPosition.y) / 2,
        z: (thumbPosition.z + indexPosition.z) / 2
    };

    cube.components['falling-cube'].updatePosition(averagePosition)
}