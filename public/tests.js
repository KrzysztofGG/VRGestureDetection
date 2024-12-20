function hangleRoration(previousIndexPosition, indexPosition, wristPosition) {

    // let point1 = new THREE.Vector3(previousIndexPosition.x, previousIndexPosition.y, previousIndexPosition.z);
    // let point2 = new THREE.Vector3(wristPosition.x, wristPosition.y, wristPosition.z)

    // let originalVector = new THREE.Vector3();
    // originalVector.subVectors(point1, point2);

    // let newPoint1 = new THREE.Vector3(indexPosition.x, indexPosition.y, indexPosition.z);
    // let newVector = new THREE.Vector3();
    // newVector.subVectors(newPoint1, point2);

    // originalVector.normalize();
    // newVector.normalize();

    // let quaternion = new THREE.Quaternion();
    // quaternion.setFromUnitVectors(originalVector, newVector);

    // let euler = new THREE.Euler();
    // euler.setFromQuaternion(quaternion);

    // let xRot = THREE.Math.radToDeg(euler.x);
    // let yRot = THREE.Math.radToDeg(euler.y);
    // let zRot = THREE.Math.radToDeg(euler.z);

    

    // Normalize positions from MediaPipe to A-Frame
    // const distance = calculateDistance(previousIndexPosition, indexPosition);
    // if (distance < 0.1)
    //     return;

    // Increment the frame counter
    // frameCounter++;

    // // Only calculate angles every other frame
    // if (frameCounter % 10 === 0) {
    //     // Calculate angles for each view
    //     const angleX = calculateAngle2D(
    //         { x: previousIndexPosition.x, y: previousIndexPosition.y },
    //         { x: indexPosition.x, y: indexPosition.y },
    //         { x: wristPosition.x, y: wristPosition.y }
    //     );
    //     const angleY = calculateAngle2D(
    //         { x: previousIndexPosition.z, y: previousIndexPosition.y },
    //         { x: indexPosition.z, y: indexPosition.y },
    //         { x: wristPosition.z, y: wristPosition.y }
    //     );
    //     const angleZ = calculateAngle2D(
    //         { x: previousIndexPosition.x, y: previousIndexPosition.z },
    //         { x: indexPosition.x, y: indexPosition.z },
    //         { x: wristPosition.x, y: wristPosition.z }
    //     );
    //     console.log( cube.object3D.rotation)
    //     // Apply the calculated angles to the cube's rotation
    //     cube.object3D.rotation.x += angleX;
    //     cube.object3D.rotation.x %= 360;
    //     cube.object3D.rotation.y += angleY;
    //     cube.object3D.rotation.y %= 360;
    //     cube.object3D.rotation.z += angleZ;
    //     cube.object3D.rotation.z %= 360;

    //     frameCounter = 0;
    // }
}