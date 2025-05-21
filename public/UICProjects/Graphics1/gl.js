import buildingShaderSrc from './building.vert.js';
import flatShaderSrc from './flat.vert.js';
import fragmentShaderSrc from './fragment.glsl.js';

var gl;

var layers = null

var modelMatrix;
var projectionMatrix;
var viewMatrix;

var modelLoc;
var projectionLoc;
var viewLoc;

var currRotate = 0;
var currZoom = 50;
var currProj = document.querySelector("#Projection").value;

var mousePressed = false;
var oldX = 0;
var oldY = 0
var moveHorizontal = 0;
var moveVertical = 0;


var glCanvas = document.querySelector("#glcanvas");
glCanvas.addEventListener("mousedown", e => {
    console.log("You are holding Down the mouse");
    oldX = e.offsetX;
    oldY = e.offsetY;
    mousePressed = true;
    // console.log(e.offsetX);
})

glCanvas.addEventListener("mousemove", e => {
    // setMouseCoordinates (oldX, oldY, e.offsetX, e.offsetY);
    if (mousePressed){
        setMouseCoordinates (oldX, oldY, e.offsetX, e.offsetY);
        oldX = e.offsetX;
        oldY = e.offsetY;
    }
})

glCanvas.addEventListener("mouseup", e => {
    console.log("You let go of the mouse !");
    // console.log(e.offsetX);
    // setMouseCoordinates(oldX, oldY, e.offsetX, e.offsetY);

    mousePressed = false;

})

function setMouseCoordinates(oldX, oldY, newX, newY){
    var changeX = newX - oldX;
    var changeY = oldY - newY;
    // console.log(" Offset Change IN X : "+ changeX);
    // console.log(" Offset Change IN Y : "+ changeY);
    
    var tempRotate = currRotate + ((changeX / glCanvas.clientWidth) * 360);
    if (tempRotate > 360) {
        currRotate = tempRotate - 360
    } else if (tempRotate < 0) {
        currRotate = tempRotate + 360;
    } else{
        currRotate = tempRotate;
    }

    var tempZoom = currZoom + ((changeY / glCanvas.clientHeight) * 100);
    if (tempZoom > 100){
        currZoom = 100;
    } else if (tempZoom < 0) {
        currZoom = 1;
    } else {
        currZoom = tempZoom;
    }

    // currRotate = (changeX / glCanvas.clientWidth) * 360;
    console.log(" Set Change IN X : "+ currRotate);
    // console.log( " Canvas height : " + glCanvas.height);
    // currZoom = (changeY / glCanvas.clientHeight) * 100;
    console.log(" Set Change IN Y : "+ currZoom);
    
} 
/*
    Vertex shader with normals
*/
class BuildingProgram {
    constructor() {
        // console.log("In Building Program");
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, buildingShaderSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

        // TODO: set attrib and uniform locations
        this.posAttribLoc = gl.getAttribLocation(this.program, "position");
        this.normalAttribLoc = gl.getAttribLocation(this.program, "normal");

        // this.posAttribLoc = gl.getUniformLocation(this.program, "position");
        // this.normalAttribLoc = gl.getUniformLocation(this.program, "normal");
        
        this.colorAttribLoc = gl.getUniformLocation(this.program, "uColor");
        // get uniform locations
        this.modelLoc = gl.getUniformLocation(this.program, "uModel");
        this.projectionLoc = gl.getUniformLocation(this.program, "uProjection");
        this.viewLoc = gl.getUniformLocation(this.program, "uView");
        
    }

    use() {
        gl.useProgram(this.program);
    }
}

/*
    Vertex shader with uniform colors
*/
class FlatProgram {
    constructor() {
        // console.log("In Flat Program")
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, flatShaderSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc);
        // console.log("HELLO 2");
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

        // TODO: set attrib and uniform locations
        this.posAttribLoc = gl.getAttribLocation(this.program, "position");

        this.colorAttribLoc = gl.getUniformLocation(this.program, "uColor");
        // get uniform locations
        this.modelLoc = gl.getUniformLocation(this.program, "uModel");
        this.projectionLoc = gl.getUniformLocation(this.program, "uProjection");
        this.viewLoc = gl.getUniformLocation(this.program, "uView");
    }

    use() {
        gl.useProgram(this.program);
    }
}


/*
    Collection of layers
*/
class Layers {
    constructor() {
        this.layers = {};
        this.centroid = [0,0,0];
    }

    addBuildingLayer(name, vertices, indices, normals, color){
        var layer = new BuildingLayer(vertices, indices, normals, color);
        layer.init();
        this.layers[name] = layer;
        this.centroid = this.getCentroid();
    }

    addLayer(name, vertices, indices, color) {
        var layer = new Layer(vertices, indices, color);
        layer.init();
        this.layers[name] = layer;
        this.centroid = this.getCentroid();
    }

    removeLayer(name) {
        delete this.layers[name];
    }

    draw() {
        for(var layer in this.layers) {
            this.layers[layer].draw(this.centroid);
        }
    }

    
    getCentroid() {
        var sum = [0,0,0];
        var numpts = 0;
        for(var layer in this.layers) {
            numpts += this.layers[layer].vertices.length/3;
            for(var i=0; i<this.layers[layer].vertices.length; i+=3) {
                var x = this.layers[layer].vertices[i];
                var y = this.layers[layer].vertices[i+1];
                var z = this.layers[layer].vertices[i+2];
    
                sum[0]+=x;
                sum[1]+=y;
                sum[2]+=z;
            }
        }
        return [sum[0]/numpts,sum[1]/numpts,sum[2]/numpts];
    }
}

/*
    Layers without normals (water, parks, surface)
*/
class Layer {
    constructor(vertices, indices, color) {
        this.vertices = vertices;
        this.indices = indices;
        this.color = color;
    }

    init() {
        // TODO: create program, set vertex and index buffers, vao
        this.program = new FlatProgram();

        this.vertexBuffer = createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.vertices));
        this.indexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices));
        this.vao = createVAO(gl, this.program.posAttribLoc, this.vertexBuffer);
        
    }

    draw(centroid) {
        // TODO: use program, update model matrix, view matrix, projection matrix
        // TODO: set uniforms
        // TODO: bind vao, bind index buffer, draw elements

        this.program.use();

        updateModelMatrix(centroid);
        gl.uniformMatrix4fv(this.program.modelLoc, false, new Float32Array(modelMatrix));

        updateProjectionMatrix();
        gl.uniformMatrix4fv(this.program.projectionLoc, false, new Float32Array(projectionMatrix));

        updateViewMatrix(centroid);
        gl.uniformMatrix4fv(this.program.viewLoc, false, new Float32Array(viewMatrix));

        gl.uniform4fv(this.program.colorAttribLoc, new Float32Array(this.color));

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
    }
}

/*
    Layer with normals (building)
*/
class BuildingLayer extends Layer {
    constructor(vertices, indices, normals, color) {
        super(vertices, indices, color);
        // console.log(color);
        this.normals = normals;
        // var bp = new BuildingProgram();
    }
    
    init() {
        // TODO: create program, set vertex, normal and index buffers, vao
        this.program = new BuildingProgram();
        this.vertexBuffer = createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.vertices));
        this.indexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices));
        this.normalBuffer = createBuffer(gl,gl.ARRAY_BUFFER, new Float32Array(this.normals));


        this.vao = createVAO(gl, this.program.posAttribLoc, this.vertexBuffer, this.program.normalAttribLoc, this.normalBuffer);
        // this.program = bp.program;


    
    }

    draw(centroid) {
        // TODO: use program, update model matrix, view matrix, projection matrix
        // this.program = new BuildingProgram();
        // bp.use();
        // TODO: set uniforms
        this.program.use();
        updateModelMatrix(centroid);
        gl.uniformMatrix4fv(this.program.modelLoc, false, new Float32Array(modelMatrix));

        updateProjectionMatrix();
        gl.uniformMatrix4fv(this.program.projectionLoc, false, new Float32Array(projectionMatrix));

        updateViewMatrix(centroid);
        gl.uniformMatrix4fv(this.program.viewLoc, false, new Float32Array(viewMatrix));

        gl.uniform4fv(this.program.colorAttribLoc, this.color);

        // console.log("Gets here 1");
        
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        // console.log("GETS HERE 2");
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);

        // gl.uniform4fv(this.program.colorAttribLoc, this.color);
        // TODO: bind vao, bind index buffer, draw elements
    }
}

/*
    Event handlers
*/
window.updateRotate = function() {
    currRotate = parseInt(document.querySelector("#rotate").value);
}

window.updateZoom = function() {
    currZoom = parseFloat(document.querySelector("#zoom").value);
}

window.updateProjection = function() {
    currProj = document.querySelector("#Projection").value;
    // console.log("Projection : " + currProj)
}

/*
    File handler
*/
window.handleFile = function(e) {
    var reader = new FileReader();
    var file = e.target.files[0];
    reader.onload = function(evt) {
        // TODO: parse JSON
        const parsed = JSON.parse(evt.target.result)
        // console.log(parsed.buildings);
        for(var layer in parsed){
            var addLayerArr = parsed[layer]
            switch (layer) {
                // TODO: add to layers
                case 'buildings':
                    // console.log(layer);
                    // console.log(addLayerArr['color']);
                    
                    layers.addBuildingLayer('buildings', addLayerArr['coordinates'], addLayerArr['indices'], addLayerArr['normals'], addLayerArr['color']);
                    break;
                case 'water':
                    // TODO
                    layers.addLayer('water', addLayerArr['coordinates'], addLayerArr['indices'], addLayerArr['color'])
                    // console.log(layer)
                    break;
                case 'parks':
                    // TODO
                    layers.addLayer('parks', addLayerArr['coordinates'], addLayerArr['indices'], addLayerArr['color'])
                    // console.log(layer)
                    break;
                case 'surface':
                    // TODO
                    // console.log(layer)
                    layers.addLayer('surface', addLayerArr['coordinates'], addLayerArr['indices'], addLayerArr['color'])
                    break;
                default:
                    break;
            }
        }
    }
    reader.readAsText(file);
    // reader.readAsText(e.files[0]);
}

/*
    Update transformation matrices
*/
function updateModelMatrix(centroid) {
    // TODO: update model matrix
    modelMatrix = identityMatrix();
    // var scale = scaleMatrix(currZoom/100, currZoom/100, currZoom/100);
    // var rotateX = rotateXMatrix(100 * Math.PI / 180.0);
    // var rotateY = rotateYMatrix(Math.PI / 180.0);
    // var translation = translateMatrix(0, 0, 0);

    // modelMatrix = multiplyArrayOfMatrices([
    //     translation,
    //     rotateX,
    //     rotateY,
    //     scale
    // ]);
}

function updateProjectionMatrix() {
    var aspect = window.innerWidth / window.innerHeight;
    if (currProj == "perspective"){
        projectionMatrix = perspectiveMatrix(45 * Math.PI / 180.0, aspect, 1, 500000);
    } else {
        var zoom = 5000
        var size = zoom - (currZoom/100.0) * zoom * 0.99;
        projectionMatrix = orthographicMatrix(-aspect * size, aspect * size, -size, size, -1, 50000);
    }
    // TODO: update projection matrix
}

function updateViewMatrix(centroid){
    // TODO: update view matrix
    // TIP: use lookat function
    var radRotate = currRotate * Math.PI / 180.0;
    var zoom = 5000;
    var rad = zoom - (currZoom / 100.0) * zoom * 0.99;
    var x = rad * Math.cos(radRotate);
    var y = rad * Math.sin(radRotate);
    viewMatrix = lookAt(add(centroid, [x,y,rad]), centroid, [0,0,1]);
}

/*
    Main draw function (should call layers.draw)
*/
function draw() {

    gl.clearColor(190/255, 210/255, 215/255, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    layers.draw();

    requestAnimationFrame(draw);

}

/*
    Initialize everything
*/
function initialize() {

    var canvas = document.querySelector("#glcanvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    

    gl = canvas.getContext("webgl2");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    layers = new Layers();

    window.requestAnimationFrame(draw);

}


window.onload = initialize;