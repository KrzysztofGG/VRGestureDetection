import { translateLandmarkPointToAFrame } from './utils.js';
import ObjectGrabber from './objectGrabber.js';

AFRAME.registerComponent('hand-landmarks', {
    schema: {
        count: {type: 'number', default: 21}, // Number of landmarks
    },
    init: function () {
        this.landmarks = [];

        for (let i = 0; i < this.data.count; i++) {
            const sphere = document.createElement('a-sphere');
            sphere.setAttribute('id', `landmark-${i}`);
            sphere.setAttribute('radius', '0.1'); 
            sphere.setAttribute('color', '#EF2D5E');
            sphere.setAttribute('position', '0 0 0');
            this.el.appendChild(sphere);
            this.landmarks.push(sphere);
        }
        console.log("Hand landmarks generated");
    },
    updateLandmarks: function (landmarks) {
        landmarks.forEach((landmark, index) => {
            const translatedPoint = translateLandmarkPointToAFrame(landmark);
            this.landmarks[index].object3D.position.set(translatedPoint.x, translatedPoint.y, translatedPoint.z);
        });
    },
    tick: function () {
        try {
            const objectGrabber = ObjectGrabber.getInstance();
            if (objectGrabber && objectGrabber.landmarks) {
                this.updateLandmarks(objectGrabber.landmarks);
            }
        } catch (error) {
            console.error("ObjectGrabber instance not created yet:", error.message);
        }
    }
});