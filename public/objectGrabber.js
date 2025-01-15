class ObjectGrabber {
    #object;
    #GRAB_THRESHOLD;
    #ANGLE_THRESHOLD;
    #videoElement;
    #currentStream;
    #hands;
    #camera;
    #translateFunction;
    

    constructor(object, objectDimension, angleThreshold, videoElement, deviceId, translateFunction) {
        if (ObjectGrabber.instance) {
            return ObjectGrabber.instance;
        }

        this.#object = object;
        this.#GRAB_THRESHOLD = Math.sqrt(Math.pow(objectDimension / 2, 2) + Math.pow((objectDimension * Math.sqrt(2)) / 2, 2));
        this.#ANGLE_THRESHOLD = angleThreshold;

        this.#videoElement = videoElement;
        this.#currentStream = null;

        this.landmarks = null;
        this.isGrabbed = false;
        this.#hands = null; // Declare hands variable globally
        this.#camera = null; // Declare camera variable globally
        this.#currentStream = null; // To hold the current camera stream
        this.#translateFunction = translateFunction;

        this.loadScripts();
        this.startCamera(deviceId);

        ObjectGrabber.instance = this;
    }

    static getInstance(object = null, objectDimension = null, angleThreshold = null, videoElement = null, deviceId = null, translateFunction = null) {
        if (!ObjectGrabber.instance) {
            if (object && objectDimension && angleThreshold && videoElement && deviceId && translateFunction) {
                ObjectGrabber.instance = new ObjectGrabber(object, objectDimension, angleThreshold, videoElement, deviceId, translateFunction);
            } else {
                throw new Error("ObjectGrabber instance not created yet. Please provide all parameters to create the instance.");
            }
        }
        return ObjectGrabber.instance;
    }

    get landmarks() {
        return this._landmarks;
    }

    set landmarks(value) {
        this._landmarks = value;
    }

    get isGrabbed() {
        return this._isGrabbed;
    }

    set isGrabbed(value) {
        this._isGrabbed = value;
    }

    setCamera(deviceId) {
        this.startCamera(deviceId);
    }

    async startCamera(deviceId) {
        // Stop the current stream if it exists
        if (this.#currentStream) {
            this.#currentStream.getTracks().forEach(track => track.stop());
            this.#videoElement.srcObject = null;
        }
        try {
            // Start the new camera stream
            this.#currentStream = await navigator.mediaDevices.getUserMedia({
                video: { deviceId: { exact: deviceId } }
            });
            this.#videoElement.srcObject = this.#currentStream;
            console.log("video element source updated to: " + this.#currentStream.id);

            // Restart hand detection with the new camera
            this.initializeHandDetection(this.#videoElement); // Initialize hand detection with the video element
        } catch (error) {
            console.error('Error accessing media devices.', error);
        }
    }

    async initializeHandDetection(videoElement) {
        this.#hands = new Hands({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }
        });

        this.#hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        this.#hands.onResults(this.onResults.bind(this));

        this.#camera = new Camera(videoElement, {
            onFrame: async () => {
                await this.#hands.send({ image: videoElement });
            }
        });
        await this.#camera.start();
        console.log("Hand detection algorithm initialized");
    }

    onResults(results) {
        if (results.multiHandLandmarks) {
            for (const landmarks of results.multiHandLandmarks) {
                this.landmarks = landmarks;
                this.detectGrabGesture(landmarks);
            }
        }
    }

    calculateAngle3D(point1, point2, point3) {
        const vector1 = {
            x: point1.x - point2.x,
            y: point1.y - point2.y,
            z: point1.z - point2.z
        };
        
        const vector2 = {
            x: point3.x - point2.x,
            y: point3.y - point2.y,
            z: point3.z - point2.z
        };
    
        const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y + vector1.z * vector2.z;
        const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y + vector1.z * vector1.z);
        const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y + vector2.z * vector2.z);
    
        const angleRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
        return angleRadians * (180 / Math.PI);
    }

    calculateDistance(point1, point2) {
        const x1 = typeof point1.x === 'number' ? point1.x : point1.x.value || 0;
        const y1 = typeof point1.y === 'number' ? point1.y : point1.y.value || 0;
        const z1 = typeof point1.z === 'number' ? point1.z : point1.z.value || 0;
        
        const x2 = typeof point2.x === 'number' ? point2.x : point2.x.value || 0;
        const y2 = typeof point2.y === 'number' ? point2.y : point2.y.value || 0;
        const z2 = typeof point2.z === 'number' ? point2.z : point2.z.value || 0;
    
        const distance = Math.sqrt(
            Math.pow(x1 - x2, 2) + 
            Math.pow(y1 - y2, 2) + 
            Math.pow(z1 - z2, 2)
        );
    
        return distance;
    }

    detectGrabGesture(landmarks) {
        let thumbTip = landmarks[4];
        let indexTip = landmarks[8];
        let wrist = landmarks[0];
        if (this.#translateFunction) {
            thumbTip = this.#translateFunction(thumbTip);
            indexTip = this.#translateFunction(indexTip);
            wrist = this.#translateFunction(wrist);
        }

        const fingersAngle = this.calculateAngle3D(indexTip, wrist, thumbTip);

        const objectPosition = this.#object.getAttribute('position');

        const thumbDistanceToObject = this.calculateDistance(thumbTip, objectPosition);
        const indexDistanceToObject = this.calculateDistance(indexTip, objectPosition);

        const isCloseToObject = thumbDistanceToObject <= this.#GRAB_THRESHOLD && indexDistanceToObject <= this.#GRAB_THRESHOLD;

        const isGrabbed = fingersAngle < this.#ANGLE_THRESHOLD && isCloseToObject;

        this.isGrabbed = isGrabbed;
    }

    async loadScripts() {
        try {
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
            ];

            for (const script of scripts) {
                await this.loadScript(script);
            }
            console.log('All scripts loaded successfully!');
        } catch (err) {
            console.error('Error loading scripts:', err);
        }
    }

    loadScript = (src) => {
        return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.crossOrigin = 'anonymous';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
        });
    };
}

export default ObjectGrabber;