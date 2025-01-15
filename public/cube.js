import ObjectGrabber from './objectGrabber.js';

import { translateLandmarkPointToAFrame } from './utils.js';

AFRAME.registerComponent('falling-cube', {
    schema: {
        velocity: {type: 'number', default: 0},
        gravity: {type: 'number', default: 0.01},
        height: {type: 'number', default: 1},
        defaultColor: {type: 'string', default: '#4CC3D9'},
        grabbedColor: {type: 'string', default: '#EF0E14'},
    },
    init: function () {
        this.el.setAttribute('material', 'color', this.data.defaultColor);
        console.log("Cube initialized")
    },
    updateCubePosition: function (landmarks, isGrabbed) {
        // console.log("isGrabbed: ", isGrabbed)
        if (isGrabbed) {
            this.el.setAttribute('material', 'color', this.data.grabbedColor);
            this.data.velocity = 0;
            const thumbTip = landmarks[4];
            const indexTip = landmarks[8];
        
            const thumbPosition = translateLandmarkPointToAFrame(thumbTip);
            const indexPosition = translateLandmarkPointToAFrame(indexTip);
            
            const averagePosition = {
                x: (thumbPosition.x + indexPosition.x) / 2,
                y: (thumbPosition.y + indexPosition.y) / 2,
                z: (thumbPosition.z + indexPosition.z) / 2
            };
            this.el.setAttribute('position', averagePosition);
        } else {
            this.el.setAttribute('material', 'color', this.data.defaultColor);
            this.data.velocity -= this.data.gravity;
            const position = this.el.getAttribute('position');
            const halfHeight = this.data.height / 2;
            if (position.y + this.data.velocity > halfHeight) {
                position.y += this.data.velocity;
            } else {
                position.y = halfHeight;
            }
        }

    },

    tick: function () {
        try {
            const objectGrabber = ObjectGrabber.getInstance();
            if (objectGrabber && objectGrabber.landmarks) {
                this.updateCubePosition(objectGrabber.landmarks, objectGrabber.isGrabbed);
            }
        } catch (error) {
            console.error("ObjectGrabber instance not created yet:", error.message);
        }

    },
});