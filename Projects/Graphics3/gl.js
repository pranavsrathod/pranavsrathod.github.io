import vertexSrc from './vertex.glsl.js';
import fragmentSrc from './fragment.glsl.js';

var gl;

var layers = null

var modelMatrix;
var projectionMatrix;
var viewMatrix;

var currRotate = 0;
var currZoom = 0;
var currProj = 'perspective';


/*
    Vertex shader with uniform colors
*/
class LayerProgram {
    constructor() {
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

        this.posAttribLoc = gl.getAttribLocation(this.program, "position");
        this.colorAttribLoc = gl.getUniformLocation(this.program, "uColor");
        this.modelLoc = gl.getUniformLocation(this.program, "uModel");
        this.projectionLoc = gl.getUniformLocation(this.program, "uProjection");
        this.viewLoc = gl.getUniformLocation(this.program, "uView");
        this.hasNormalsAttribLoc = gl.getUniformLocation(this.program, "uHasNormals");
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

    addLayer(name, vertices, indices, color, normals) {
        if(normals == undefined)
            normals = null;
        var layer = new Layer(vertices, indices, color, normals);
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
    constructor(vertices, indices, color, normals = null) {
        this.vertices = vertices;
        this.indices = indices;
        this.color = color;
        this.normals = normals;

        this.hasNormals = false;
        if(this.normals) {
            this.hasNormals = true;
        }
    }

    init() {
        this.layerProgram = new LayerProgram();

        this.vertexBuffer = createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.vertices));
        this.indexBuffer = createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.indices));

        if(this.normals) {
            this.normalBuffer = createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.normals));
            this.vao = createVAO(gl, 0, this.vertexBuffer, 1, this.normalBuffer);
        }
        else {
            this.vao = createVAO(gl, 0, this.vertexBuffer);
        }
    }

    draw(centroid) {
        this.layerProgram.use();

        updateModelMatrix(centroid);
        gl.uniformMatrix4fv(this.layerProgram.modelLoc, false, new Float32Array(modelMatrix));
    
        updateProjectionMatrix();
        gl.uniformMatrix4fv(this.layerProgram.projectionLoc, false, new Float32Array(projectionMatrix));
    
        updateViewMatrix(centroid);
        gl.uniformMatrix4fv(this.layerProgram.viewLoc, false, new Float32Array(viewMatrix));

        gl.uniform4fv(this.layerProgram.colorAttribLoc, this.color);
        gl.uniform1i(this.layerProgram.hasNormalsAttribLoc, this.hasNormals);

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // console.log(this.indices)
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
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
    currProj = document.querySelector("#projection").value;
}

/*
    File handler
*/

function createBuilding(centerX, centerY, size, height, curIndex) {

    var coordinates = []
    var indices = [];
    var normals = [];

    // TODO create faces of the building taking into account center point, size and height
    // curIndex += 4;
    // coordinates.push([centerX+size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY+size/2.0,0, centerX+size/2.0,centerY+size/2.0,height, centerX+size/2.0,centerY-size/2.0,height]);
    // indices.push([curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    
    // curIndex+=4;
    // // front 
    // coordinates.push(...[ centerX-size/2.0,centerY+size/2.0,0,  centerX+size/2.0,centerY+size/2.0,0, centerX+size/2.0,centerY+size/2.0,height, centerX-size/2.0,centerY+size/2.0,height ]);
    // indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    // normals.push(...[0,1,0, 0,1,0, 0,1,0, 0,1,0]);

    // // back face 
    // curIndex+=4;
    // // front 
    // coordinates.push(...[ centerX+size/2.0,centerY-size/2.0,0,  centerX-size/2.0,centerY-size/2.0,0, centerX-size/2.0,centerY-size/2.0,height, centerX+size/2.0,centerY-size/2.0,height ]);
    // indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    // normals.push(...[0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0]);
    
    // // top face
    // curIndex+=4;
    // coordinates.push(...[ centerX-size/2.0,centerY+size/2.0,0,  centerX+size/2.0,centerY+size/2.0,0, centerX+size/2.0,centerY-size/2.0,height, centerX-size/2.0,centerY-size/2.0,height ]);
    // indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    // normals.push(...[0,0,1, 0,0,1, 0,0,1, 0,0,1]);
// ------------------------
    // front face
    coordinates.push(...[centerX-size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY-size/2.0,height, centerX-size/2.0,centerY-size/2.0,height]);
    indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    normals.push(...[0,1,0, 0,1,0, 0,1,0, 0,1,0]);
    
    //back face
    curIndex += 4;
    coordinates.push(...[centerX+size/2.0,centerY+size/2.0,0, centerX-size/2.0,centerY+size/2.0,0, centerX-size/2.0,centerY+size/2.0,height, centerX+size/2.0,centerY+size/2.0,height]);
    indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    normals.push(...[0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0]);
//top face
    curIndex += 4;
    coordinates.push(...[centerX-size/2.0,centerY-size/2.0,height, centerX+size/2.0,centerY-size/2.0,height, centerX+size/2.0,centerY+size/2.0,height, centerX-size/2.0,centerY+size/2.0,height]);
    indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    normals.push(...[0,0,1, 0,0,1, 0,0,1, 0,0,1]);
//bottom face
    curIndex += 4;
    coordinates.push(...[centerX-size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY+size/2.0,0, centerX-size/2.0,centerY+size/2.0,0]);
    indices.push(...[curIndex+0, curIndex+2, curIndex+1, curIndex+0, curIndex+3, curIndex+2]);
    normals.push(...[0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1]);

    //right face
    curIndex += 4;
    coordinates.push(...[centerX+size/2.0,centerY-size/2.0,0, centerX+size/2.0,centerY+size/2.0,0, centerX+size/2.0,centerY+size/2.0,height, centerX+size/2.0,centerY-size/2.0,height]);
    indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    normals.push(...[1,0,0, 1,0,0, 1,0,0, 1,0,0]);

    //left face
    curIndex += 4;
    coordinates.push(...[centerX-size/2.0,centerY+size/2.0,0, centerX-size/2.0,centerY-size/2.0,0, centerX-size/2.0,centerY-size/2.0,height, centerX-size/2.0,centerY+size/2.0,height]);
    indices.push(...[curIndex+0, curIndex+1, curIndex+2, curIndex+0, curIndex+2, curIndex+3]);
    normals.push(...[-1,0,0, -1,0,0, -1,0,0, -1,0,0]);
    // curIndex += 4

    return {'coordinates': coordinates, 'indices': indices, 'normals': normals};


}

function buildGeometries(imgArray, width, height) {

    var geometries = {'surface': {'coordinates': [], 'indices': [], 'color': [0.9333333333333333, 0.9333333333333333, 0.9333333333333333, 1.0]},
                      'buildings': {'coordinates': [], 'indices': [], 'normals': [], 'color': [0.5, 0.6, 0.9, 1.0]}};

    // TODO loop through array and create building geometry according to red channel value
    var maxHeight = 500;
    var cellsize = 100;
    var buildingsize = 75;
    var curIndex = 0;
    
    // Surface
    
    for(var i = 0; i<width; i++){
        for(var j=0; j<height; j++){
            var buildingHeight = ((imgArray[4 * ((i * width) +j)]) / 255.0) * maxHeight;
            if(buildingHeight > 10 && Math.random() < 0.5){
                var building = createBuilding((i*cellsize + cellsize/2 - width*cellsize/2), (j*cellsize + cellsize/2 - height*cellsize/2), buildingsize, buildingHeight,curIndex);
                geometries['buildings']['coordinates'].push(...building['coordinates']);
                geometries['buildings']['indices'].push(...building['indices']);
                geometries['buildings']['normals'].push(...building['normals']);
                curIndex+=building['coordinates'].length/3;
            }
        }
    }
    geometries['surface']['coordinates'] = [-width*cellsize/2.0,-height*cellsize/2.0,0,  width*cellsize/2.0,-height*cellsize/2.0,0, width*cellsize/2.0,height*cellsize/2.0,0, -width*cellsize/2.0,height*cellsize/2.0,0 ];
    // geometries['surface']['indices'] = [0, 1, 2, 0, 2, 3];
    geometries['surface']['indices'].push(...[0, 1, 2, 0, 2, 3])

    return geometries;
}

window.handleFile = function(e) {
    var img = new Image();
    img.onload = function() {
        var context = document.getElementById('image').getContext('2d');
        context.drawImage(img, 0, 0);
        var data = context.getImageData(0, 0, img.width, img.height).data;
        var geometries = buildGeometries(data, img.width, img.height);
        layers.addLayer('surface', geometries['surface']['coordinates'], geometries['surface']['indices'], geometries['surface']['color']);
        layers.addLayer('buildings', geometries['buildings']['coordinates'], geometries['buildings']['indices'], geometries['buildings']['color'], geometries['buildings']['normals']);
    };
    img.src = URL.createObjectURL(e.files[0]);
}

/*
    Update transformation matrices
*/

function updateProjectionMatrix() {
    var aspect = window.innerWidth / window.innerHeight;
    if (currProj == "perspective"){
        projectionMatrix = perspectiveMatrix(45 * Math.PI / 180.0, aspect, 1, 50000);
    } else {
        var zoom = 5000
        var size = zoom - (currZoom/100.0) * zoom * 0.99;
        projectionMatrix = orthographicMatrix(-aspect * size, aspect * size, -size, size, -1, 50000);
    }

    // var aspect = window.innerWidth /  window.innerHeight;
    // if(currProj == 'perspective') {
    //     projectionMatrix = perspectiveMatrix(45 * Math.PI / 180.0, aspect, 1, 50000);
    // }
    // else {
    //     var maxzoom = 5000;
    //     var size = maxzoom-(currZoom/100.0)*maxzoom*0.99;
    //     projectionMatrix = orthographicMatrix(-aspect*size, aspect*size, -1*size, 1*size, -1, 50000);
    // }
    // TODO: update projection matrix

}

// Option 1: Rotating the model
function updateModelMatrix(centroid) {
    var translation1 = translateMatrix(-centroid[0], -centroid[1], -centroid[2]);
    var translation2 = translateMatrix(centroid[0], centroid[1], centroid[2]);

    var rotate = rotateZMatrix(currRotate * Math.PI / 180.0);
    modelMatrix = multiplyArrayOfMatrices([translation2, rotate, translation1]);
    // modelMatrix = identityMatrix();
}

function updateViewMatrix(centroid){
    // var radRotate = currRotate * Math.PI / 180.0;
    // var zoom = 5000;
    // var rad = zoom - (currZoom / 100.0) * zoom * 0.99;
    // var x = rad * Math.cos(radRotate);
    // var y = rad * Math.sin(radRotate);
    // viewMatrix = lookAt(add(centroid, [x,y,rad]), centroid, [0,0,1]);
    var maxzoom = 5000;
    var zoom = maxzoom - (currZoom/100.0)*maxzoom*0.99;
    var lookat = lookAt(add(centroid, [zoom,zoom,zoom]), centroid, [0,0,1]);
    viewMatrix = lookat;
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