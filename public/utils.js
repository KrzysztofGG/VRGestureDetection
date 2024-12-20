function calculateDistance(point1, point2) {
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

function calculateAngle2D(p1, p2, p3) {
    const vector1 = {
        x: p2.x - p1.x,
        y: p2.y - p1.y
    };
    const vector2 = {
        x: p3.x - p2.x,
        y: p3.y - p2.y
    };

    const magnitude1 = Math.sqrt(vector1.x ** 2 + vector1.y ** 2);
    const magnitude2 = Math.sqrt(vector2.x ** 2 + vector2.y ** 2);

    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0; // Return a default angle if either vector has zero magnitude
    }

    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const angleRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
    const angleDegrees = angleRadians * (180 / Math.PI);

    return angleDegrees;
}

function calculateAngle3D(point1, point2, point3) {
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

function translateLandmarkPointToAFrame(point) {
    return {
        x: -(point.x * 2 - 1) * 5,
        y: -(point.y * 2 - 1) * 5,
        z: (point.z * - 8 ) - 4
        // z: (point.z * 4 - 1),
    };
} 
function prepareListenerForVRButton() {
    document.getElementById('vr-button').addEventListener('click', () => {
        const scene = document.getElementById('scene');
        if (scene.hasAttribute('vr-mode-ui')) {
            scene.exitVR();
        } else {
            scene.enterVR();
        }
    });
}