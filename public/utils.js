export function translateLandmarkPointToAFrame(point) {
    return {
        x: -(point.x * 2 - 1) * 5,
        y: -(point.y * 2 - 1) * 5,
        z: (point.z * - 8) - 4
    };
}

export function prepareListenerForVRButton() {
    document.getElementById('vr-button').addEventListener('click', () => {
        const scene = document.getElementById('scene');
        if (scene.hasAttribute('vr-mode-ui')) {
            scene.exitVR();
        } else {
            scene.enterVR();
        }
    });
}
