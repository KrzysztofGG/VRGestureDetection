AFRAME.registerComponent('falling-cube', {
    schema: {
        velocity: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        gravity: {type: 'number', default: 0.01},
        resistance: {type: 'number', default: 0.01},
        height: {type: 'number', default: 1},
        isGrabbed: {type: 'boolean', default: false},
        defaultColor: {type: 'string', default: '#4CC3D9'},
        grabbedColor: {type: 'string', default: '#EF0E14'},
        previousPosition: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        cumulativeVelocity: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        frameCount: {type: 'number', default: 0}
    },
    init: function () {
        this.el.setAttribute('material', 'color', this.data.defaultColor);
        this.data.previousPosition = {x: 0, y: 0, z: -2};
        console.log("Cube initialized")
    },
    update: function () {
        const position = this.el.getAttribute('position');
        // const halfHeight = this.data.height / 2;

        // Only run the logic if the position has changed
        const deltaX = position.x - this.data.previousPosition.x;
        const deltaY = position.y - this.data.previousPosition.y;
        const deltaZ = position.z - this.data.previousPosition.z;
        // console.log(this.data.previousPosition)

        if (deltaX !== 0 || deltaY !== 0 || deltaZ !== 0) {
            console.log(`Position changed: ${position.x}, ${position.y}, ${position.z}`);
            this.data.previousPosition = position; // Update previousPosition

            // Update velocity based on the change in position
            this.data.velocity.x = deltaX;
            this.data.velocity.y = deltaY;
            this.data.velocity.z = deltaZ;

            this.data.cumulativeVelocity.x += this.data.velocity.x;
            this.data.cumulativeVelocity.y += this.data.velocity.y;
            this.data.cumulativeVelocity.z += this.data.velocity.z;
        }
    },
    tick: function () {
        // Increment frame count
        // console.log("tick")
        this.data.frameCount++;

        if (this.data.isGrabbed) {
            if (this.data.frameCount % 10 == 0) {
                this.update(); // Call update to check for position changes
            }
        } else {
            this.updateVelocityAndPosition();
        }
    },
    updateVelocityAndPosition: function () {
        // Update velocities
        if (Math.abs(this.data.velocity.x) < this.data.resistance) {
            this.data.velocity.x = 0;
        } else {
            if (this.data.velocity.x > 0) {
                this.data.velocity.x -= this.data.resistance;
            } else if (this.data.velocity.x < 0) {
                this.data.velocity.x += this.data.resistance;
            }
        }
        if (Math.abs(this.data.velocity.z) < this.data.resistance) {
            this.data.velocity.z = 0;
        } else {
            if (this.data.velocity.z > 0) {
                this.data.velocity.z -= this.data.resistance;
            } else if (this.data.velocity.z < 0) {
                this.data.velocity.z += this.data.resistance;
            }
        }

        this.data.velocity.y -= this.data.gravity;

        // Update position based on velocities
        if (!this.data.isGrabbed) { 
            
            const position = this.el.getAttribute('position');
            const halfHeight = this.data.height / 2;
            if (position.y + this.data.velocity.y > halfHeight) {
                position.y += this.data.velocity.y;
            } else {
                position.y = halfHeight;
            }
            position.x += this.data.velocity.x;
            position.z += this.data.velocity.z;
        }
    },
    setGrabbed: function (grabbed) {
        this.data.isGrabbed = grabbed;
        if (grabbed) {
            this.data.velocity = {x: 0, y: 0, z: 0};
            this.data.cumulativeVelocity = {x: 0, y: 0, z: 0};
            this.data.frameCount = 0;
            this.el.setAttribute('material', 'color', this.data.grabbedColor);
        } else {
            this.el.setAttribute('material', 'color', this.data.defaultColor);
            const averageVelocity = {
                x: this.data.cumulativeVelocity.x / this.data.frameCount || 0,
                y: this.data.cumulativeVelocity.y / this.data.frameCount || 0,
                z: this.data.cumulativeVelocity.z / this.data.frameCount || 0
            };
            this.data.velocity = averageVelocity
        }
        console.log("Cube isGrabbed changed to: " + grabbed)
    },
    updatePosition: function (averageFingersPosition) {
        if (this.data.isGrabbed) {
            this.el.setAttribute('position', averageFingersPosition);
        }
    }
});