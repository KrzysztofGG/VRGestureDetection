AFRAME.registerComponent('hand-connections', {
    schema: {
        connections: {type: 'array', default:[[0, 1], [1, 2], [2, 3], [3, 4],           
                [0, 5], [5, 6], [6, 7], [7, 8],           
                [0, 9], [9, 10], [10, 11], [11, 12],     
                [0, 13], [13, 14], [14, 15], [15, 16],  
                [0, 17], [17, 18], [18, 19], [19, 20],    
                [0, 17], [5, 9], [9, 13], [13, 17]]
            } // Array of connections
    },
    init: function () {
        this.lines = []; // Store line entities
        this.createLines();
        console.log("Hand connections generated")
    },
    createLines: function () {
        this.data.connections.forEach((connection, index) => {
            const line = document.createElement('a-entity');
            line.setAttribute('id', `connection-${index}`);
            line.setAttribute('line', {
                color: '#FFFFFF',
                opacity: 0.5
            });
            this.el.appendChild(line);
            this.lines.push(line);
        });
    },
    updateConnections: function (landmarks) {
        this.lines.forEach((line, index) => {
            const [start, end] = this.data.connections[index];
            const startPos = landmarks[start];
            const endPos = landmarks[end];

            const startPoint = translateLandmarkPointToAFrame(startPos);
            const endPoint = translateLandmarkPointToAFrame(endPos);

            line.setAttribute('line', {
                start: `${startPoint.x} ${startPoint.y} ${startPoint.z}`,
                end: `${endPoint.x} ${endPoint.y} ${endPoint.z}`,
                color: '#FFFFFF',
                opacity: 0.5
            });
        });
    }
});