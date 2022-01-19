const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const UP_ARROW = 38;
const DOWN_ARROW = 40;

let root;

let shipXPos = 0;
let shipYPos = -2;
let shipZPos = -4;

const rockZPos = 50;
const rockSpeedMetresPerSecond = 10;
const rockRadius = 0.2;

let shipTransform;
let shipMatrix;

let nextLightNumber = 0;
function getNextLightNumber() {
    return nextLightNumber++;
}

function init() {
    let canvas = document.getElementById('canvas');
    canvas.addEventListener('keydown', keyPressed);
    canvas.focus();
    disableDefaultManipulator();
    // disableDefaultLight()
}

function createScene() {
    root = new osg.Node();

    let ship = createShip(shipXPos, shipYPos, shipZPos, 1);
    shipTransform = ship[0];
    shipMatrix = ship[1];
    root.addChild(shipTransform);

    root.addChild(createBackground());
    // createRock();
    setInterval(createRock, 200);

    root.addChild(createDirectionalLightSource(0, 2, -5, 1.0, 1.0, 1.0));

    return root;
}

function createBackground() {
    let sizeX = 150;
    let sizeY = sizeX*1.777; // 1980x1080 ratio

    let background = osg.createTexturedBoxGeometry(0, 0, 50, sizeY, sizeX, 0.001);

    let texture = new osg.Texture();
    osgDB.readImageURL('res/background_texture.jpg').then(function (image) {
        texture.setImage(image);
        background.getOrCreateStateSet().setTextureAttributeAndModes(0, texture);
    });
    return background;
}

document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};

function handleTouchMove(evt) {
    document.getElementById('music').play();
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            shipXPos++;
        } else {
            shipXPos--;
        }
    } else {
        if ( yDiff > 0 ) {
            shipYPos++;
        } else {
            shipYPos--;
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;

    let matrix = new osg.Matrix.create();
    matrix = osg.Matrix.makeTranslate(shipXPos, shipYPos+2, shipZPos+3, matrix);
    shipTransform.setMatrix(matrix);
};


function keyPressed(event) {
    document.getElementById('music').play();
    let keyCode = event.keyCode;

    switch(keyCode) {
        case UP_ARROW:
            shipYPos++;
            break;
        case DOWN_ARROW:
            shipYPos--;
            break;
        case LEFT_ARROW:
            shipXPos++;
            break;
        case RIGHT_ARROW:
            shipXPos--;
            break;
    }

    let matrix = new osg.Matrix.create();
    matrix = osg.Matrix.makeTranslate(shipXPos, shipYPos+2, shipZPos+3, matrix);
    shipTransform.setMatrix(matrix);
}

function createRock() {
    let max_x = 3;
    let min_x = -3;
    let max_y = 3;
    let min_y = -3;

    let x = Math.floor(Math.random() * (max_x - min_x + 1) + min_x);
    let y = Math.floor(Math.random() * (max_y - min_y + 1) + min_y);

    let rock = osg.createTexturedSphere(rockRadius);

    let emissiveMaterial = new osg.Material();
    emissiveMaterial.setEmission([1.0, 1.0, 0.0, 1.0]);

    // let light = createPointLight(1.0, 1.0, 0.0, 0.0, 0.0, 1.0);
    // light.getLight().setEnabled(true);

    rock.getOrCreateStateSet().setAttributeAndModes(emissiveMaterial);
    // rock.addUpdateCallback(new animateRockGlow());

    let rockDistanceMatrix = new osg.Matrix.create();
    osg.Matrix.makeTranslate(x, y, rockZPos, rockDistanceMatrix);
    let rockDistanceTransform = new osg.MatrixTransform();
    rockDistanceTransform.setMatrix(rockDistanceMatrix);
    rockDistanceTransform.addChild(rock);
    // rockDistanceTransform.addChild(light);

    rockDistanceTransform.addUpdateCallback(new animateRockMotion());

    root.addChild(rockDistanceTransform);
}

let animateRockMotion = function() {};
animateRockMotion.prototype = {
    startTimeSeconds: -1,

    update: function(rockTransform, updateVisitor) {
        let simulationTimeSeconds = updateVisitor.getFrameStamp().getSimulationTime();

        if(this.startTimeSeconds === -1) {
            this.startTimeSeconds = simulationTimeSeconds;
        }

        let rockTravelTimeSeconds = simulationTimeSeconds - this.startTimeSeconds;
        let distanceTravelledMeters = rockSpeedMetresPerSecond * rockTravelTimeSeconds;

        let matrix = rockTransform.getMatrix();
        let x = matrix[12];
        let y = matrix[13];
        let z = rockZPos - distanceTravelledMeters;

        checkForCollision(osg.Matrix.makeTranslate(x, y, z, matrix));

        if(z < -10) {
            rockTransform.removeUpdateCallback(this);
            rockTransform.getParents()[0].removeChild(rockTransform);
        }
        return true;
    }
};

function checkForCollision(rockMatrix) {
    let shipBoundingSphere = shipTransform.getBoundingSphere();

    let rockX = rockMatrix[12];
    let rockY = rockMatrix[13];
    let rockZ = rockMatrix[14];

    let shipX = shipBoundingSphere['_center'][0];
    let shipY = shipBoundingSphere['_center'][1];
    let shipZ = shipBoundingSphere['_center'][2];
    let shipRadius = shipBoundingSphere['_radius'];

    let distanceBetweenShipAndRock = Math.sqrt(Math.pow(rockX-shipX, 2)
                                                + Math.pow(rockY-shipY, 2)
                                                + Math.pow(rockZ-shipZ, 2));

    if(distanceBetweenShipAndRock < shipRadius + rockRadius) {
        alert('You crashed!');
    }
}

function createShip(x, y, z, length) {
    let engineBodyLength = length*0.5;
    let engineRadius = rockRadius*0.5;
    let faces = 10;

    // create shapes
    let mainBody = createEngineWithNoseCone(rockRadius, length, faces);
    let mainBodyEngine = createShipNoseCone(rockRadius*0.85, length*0.33, faces)
    let leftEngine = createEngineWithNoseCone(engineRadius, engineBodyLength, faces);
    let rightEngine = createEngineWithNoseCone(engineRadius, engineBodyLength, faces);

    // create headlights
    // let leftHeadlight = createDirectionalLightSource(0, 0, 0, 1.0, 1.0, 1.0);
    // let rightHeadlight = createDirectionalLightSource(0, 0, 0, 1.0, 1.0, 1.0);

    // position the main body
    let mainBodyMatrix = new osg.Matrix.create();
    mainBodyMatrix = osg.Matrix.makeTranslate(x, y, z, mainBodyMatrix);
    let mainBodyTransform = new osg.MatrixTransform();
    mainBodyTransform.setMatrix(mainBodyMatrix);
    mainBodyTransform.addChild(mainBody);

    // rotate the cone and attach to back of main body
    let mainEngineRotateMatrix = new osg.Matrix.create();
    mainEngineRotateMatrix = osg.Matrix.makeRotate(Math.PI, 1, 0, 0, mainEngineRotateMatrix);
    let mainEngineRotateTransform = new osg.MatrixTransform();
    mainEngineRotateTransform.setMatrix(mainEngineRotateMatrix);
    mainEngineRotateTransform.addChild(mainBodyEngine);

    let mainEngineTranslateMatrix = new osg.Matrix.create();
    mainEngineTranslateMatrix = osg.Matrix.makeTranslate(x, y, z, mainEngineTranslateMatrix);
    let mainEngineTranslateTransform = new osg.MatrixTransform();
    mainEngineTranslateTransform.setMatrix(mainEngineTranslateMatrix);
    mainEngineTranslateTransform.addChild(mainEngineRotateTransform);

    // attach the side engines
    let leftEngineTranslateMatrix = new osg.Matrix.create();
    leftEngineTranslateMatrix = osg.Matrix.makeTranslate(x-rockRadius, y, z, leftEngineTranslateMatrix);
    let leftEngineTranslateTransform = new osg.MatrixTransform();
    leftEngineTranslateTransform.setMatrix(leftEngineTranslateMatrix);
    leftEngineTranslateTransform.addChild(leftEngine);

    let rightEngineTranslateMatrix = new osg.Matrix.create();
    rightEngineTranslateMatrix = osg.Matrix.makeTranslate(x+rockRadius, y, z, rightEngineTranslateMatrix);
    let rightEngineTranslateTransform = new osg.MatrixTransform();
    rightEngineTranslateTransform.setMatrix(rightEngineTranslateMatrix);
    rightEngineTranslateTransform.addChild(rightEngine);

    let transformArray = [mainBodyTransform,
        mainEngineTranslateTransform,
        leftEngineTranslateTransform,
        rightEngineTranslateTransform];
    let mainTransform = new osg.MatrixTransform();
    transformArray.map(tf => mainTransform.addChild(tf));

    return [mainTransform, mainBodyMatrix];
}

function createEngineWithNoseCone(radius, length, faces) {
    let engineLength = 0.66*length;
    let noseLength = length - engineLength;

    let angle = 0;
    let angleIncrement = (2*Math.PI)/faces;
    let coordinates = [];
    let normals = [];
    let texCoords = [];
    let colors = [];

    let x0 = radius*Math.cos(angle);
    let y0 = radius*Math.sin(angle);
    let nx0 = Math.cos(angle);
    let ny0 = Math.sin(angle);
    let s0 = 0;

    for(let i=0; i<faces; i++) {
        angle += angleIncrement;

        // coordinates
        let x1 = radius*Math.cos(angle);
        let y1 = radius*Math.sin(angle);

        coordinates.push(0, 0, engineLength+noseLength);
        coordinates.push(x0, y0, engineLength);
        coordinates.push(x1, y1, engineLength);

        coordinates.push(x0, y0, 0);
        coordinates.push(x1, y1, engineLength);
        coordinates.push(x0, y0, engineLength);

        coordinates.push(x0, y0, 0);
        coordinates.push(x1, y1, 0);
        coordinates.push(x1, y1, engineLength);

        coordinates.push(x1, y1, 0);
        coordinates.push(x0, y0, 0);
        coordinates.push(0, 0, 0);

        x0 = x1;
        y0 = y1;

        // colors
        for(let j=0; j<12; j++) {
            colors.push(0, 1, 0, 1);
        }

        // normals
        let nx1 = Math.cos(angle);
        let ny1 = Math.sin(angle);

        normals.push(nx0, ny0, 1);
        normals.push(nx0, ny0, 0);
        normals.push(nx1, ny1, 0);

        normals.push(nx0, ny0, 0);
        normals.push(nx1, ny1, 0);
        normals.push(nx0, ny0, 0);

        normals.push(nx0, ny0, 0);
        normals.push(nx1, ny1, 0);
        normals.push(nx1, ny1, 0);

        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        // textures
        let s1 = angle / (2*Math.PI);

        texCoords.push(0.5, 0.5);
        texCoords.push(0.5 + 0.5*nx0, 0.5 + 0.5*ny0);
        texCoords.push(0.5 + 0.5*nx1, 0.5 + 0.5*ny1);

        texCoords.push(s0, 0.0);
        texCoords.push(s1, 1.0);
        texCoords.push(s0, 1.0);

        texCoords.push(s0, 0.0);
        texCoords.push(s1, 0.0);
        texCoords.push(s1, 1.0);

        texCoords.push(0.5 + 0.5*nx1, 0.5 - 0.5*ny1);
        texCoords.push(0.5 + 0.5*nx0, 0.5 - 0.5*ny0);
        texCoords.push(0.5, 0.5);

        s0 = s1;

        nx0 = nx1;
        ny0 = ny1;
    }

    let geometry = new osg.Geometry();

    let vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);

    let textureAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 2);
    textureAttribArray.setElements(new Float32Array(texCoords));
    geometry.setVertexAttribArray('TexCoord0', textureAttribArray);

    let normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals));
    geometry.setVertexAttribArray('Normal', normalAttribArray);

    let colorAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 4);
    colorAttribArray.setElements(new Float32Array(colors));
    geometry.setVertexAttribArray('Color', colorAttribArray);

    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, coordinates.length/3));

    return geometry;
}

function createShipNoseCone(radius, height, faces) {
    let coordinates = [];
    let colors = [];
    let normals = [];

    let angle = 0;
    let angleIncrement = (2*Math.PI)/faces;
    let x0 = radius*Math.cos(angle);
    let y0 = radius*Math.sin(angle);
    let nx0 = Math.cos(angle);
    let ny0 = Math.sin(angle);

    for(let i=0; i<faces; i++) {
        angle += angleIncrement;

        // vertices
        let x1 = radius*Math.cos(angle);
        let y1 = radius*Math.sin(angle);

        coordinates.push(0, 0, 0);
        coordinates.push(x1, y1, 0);
        coordinates.push(x0, y0, 0);

        coordinates.push(x0, y0, 0);
        coordinates.push(x1, y1, 0);
        coordinates.push(0, 0, height);

        x0 = x1;
        y0 = y1;

        // normals
        let nx1 = Math.cos(angle);
        let ny1 = Math.sin(angle);

        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        normals.push(nx0, ny0, 1);
        normals.push(nx1, ny1, 1);
        normals.push(0, 0, 1);

        nx0 = nx1;
        ny0 = ny1;
    }

    // colors
    for(let i=0; i<coordinates.length/3; i++) {
        colors.push(0, 1, 0, 1);
    }

    let geometry = new osg.Geometry();

    let vertexCoordAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null , 3);
    vertexCoordAttribArray.setElements(new Float32Array(coordinates));
    geometry.setVertexAttribArray('Vertex', vertexCoordAttribArray);

    let colorAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 4);
    colorAttribArray.setElements(new Float32Array(colors));
    geometry.setVertexAttribArray('Color', colorAttribArray);

    let normalAttribArray = new osg.BufferArray(osg.BufferArray.ARRAY_BUFFER, null, 3);
    normalAttribArray.setElements(new Float32Array(normals));
    geometry.setVertexAttribArray('Normal', normalAttribArray);

    // let material = new osg.Material();
    // material.setDiffuse([0, 1, 0, 1]);
    // geometry.getOrCreateStateSet().setAttributeAndModes(material);

    geometry.getPrimitives().push(new osg.DrawArrays(osg.PrimitiveSet.TRIANGLES, 0, coordinates.length/3));

    return geometry;
}

function createDirectionalLightSource(x, y, z, r, g, b) {
    let directionalLight = new osg.Light(getNextLightNumber());
    directionalLight.setPosition([x, y, z, 0.0]);

    directionalLight.setDiffuse([r, g, b, 1.0]);
    directionalLight.setSpecular([r, g, b, 1.0]);
    directionalLight.setAmbient([0.0, 0.0, 0.0, 1.0]);

    let lightSource = new osg.LightSource();
    lightSource.setLight(directionalLight);

    return lightSource;
}
