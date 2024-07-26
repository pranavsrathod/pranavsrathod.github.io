import layerVertShaderSrc from './layerVert.glsl.js';
import layerFragShaderSrc from './layerFrag.glsl.js';
import shadowFragShaderSrc from './shadowFrag.glsl.js';
import shadowVertShaderSrc from './shadowVert.glsl.js';
import depthFragShaderSrc from './depthFrag.glsl.js';
import depthVertShaderSrc from './depthVert.glsl.js';

var gl;

var layers = null
var renderToScreen = null;
var fbo = null;
var currRotate = 0;
var currLightRotate = 0;
var currLightDirection = null;
var currZoom = 0;
var currProj = 'perspective';
var currResolution = 2048;
var displayShadowmap = document.querySelector('#shadowmap').checked;

var mousePressed = false;
var oldX = 0;
var oldY = 0;

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
    FBO
*/
class FBO {
    constructor(size) {
        // TODO: Create FBO and texture with size
        this.size = size;
        var texture = createTexture2D(gl, this.size, this.size, gl.DEPTH_COMPONENT32F, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null, gl.NEAREST, gl.NEAREST, gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE);
        this.fbo = createFBO(gl, gl.DEPTH_ATTACHMENT, texture);
    }

    start() {
        // TODO: Bind FBO, set viewport to size, clear depth buffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
        // gl.clearColor(190/255, 210/255, 215/255, 1);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, this.size, this.size);
    }

    stop() {
        // TODO: unbind FBO
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}

/*
    Shadow map
*/
class ShadowMapProgram {
    constructor() {
        console.log("In Shadow Program");
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, shadowVertShaderSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shadowFragShaderSrc);
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);
        console.log("Shaders Created");

        this.posAttribLoc = gl.getAttribLocation(this.program, "position");
        this.colorAttribLoc = gl.getUniformLocation(this.program, "uColor");
        this.modelLoc = gl.getUniformLocation(this.program, "uModel");
        this.projectionLoc = gl.getUniformLocation(this.program, "uProjection");
        this.viewLoc = gl.getUniformLocation(this.program, "uView");
        this.lightViewLoc = gl.getUniformLocation(this.program, "uLightView");
        this.lightProjectionLoc = gl.getUniformLocation(this.program, "uLightProjection");
        this.samplerLoc = gl.getUniformLocation(this.program, "uSampler");
        this.hasNormalsAttribLoc = gl.getUniformLocation(this.program, "uHasNormals");
        this.lightDirAttribLoc = gl.getUniformLocation(this.program, "uLightDir");    
    }

    use() {
        // TODO: use program
        gl.useProgram(this.program);
    }
}

/*
    Render to screen program
*/
class RenderToScreenProgram {
    constructor() {
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, depthVertShaderSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, depthFragShaderSrc);
        
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);
        this.posAttribLoc = gl.getAttribLocation(this.program, "position");
        this.samplerLoc = gl.getUniformLocation(this.program, "uSampler");

        // TODO: Create quad VBO and VAO
    }

    draw(texture) {
        // TODO: Render quad and display texture
    }

}

/*
    Layer program
*/
class LayerProgram {
    constructor() {
        this.vertexShader = createShader(gl, gl.VERTEX_SHADER, layerVertShaderSrc);
        this.fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, layerFragShaderSrc);
        this.program = createProgram(gl, this.vertexShader, this.fragmentShader);

        this.posAttribLoc = gl.getAttribLocation(this.program, "position");
        this.colorAttribLoc = gl.getUniformLocation(this.program, "uColor");
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

    draw(modelMatrix, viewMatrix, projectionMatrix, lightViewMatrix = null, lightProjectionMatrix = null, shadowPass = false, texture = null) {
        for(var layer in this.layers) {
            if(layer == 'surface') {
                gl.polygonOffset(1, 1);
            }
            else {
                gl.polygonOffset(0, 0);
            }
            this.layers[layer].draw(modelMatrix, viewMatrix, projectionMatrix, lightViewMatrix, lightProjectionMatrix, shadowPass, texture);
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
        this.shadowProgram = new ShadowMapProgram();

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

    draw(modelMatrix, viewMatrix, projectionMatrix, lightViewMatrix, lightProjectionMatrix, shadowPass = false, texture = null) {
        // TODO: Handle shadow pass (using ShadowMapProgram) and regular pass (using LayerProgram)
        if (shadowPass){
            // this.shadowProgram.use();
            var sProgram = this.shadowProgram;
            sProgram.use();
            gl.uniformMatrix4fv(sProgram.modelLoc, false, new Float32Array(modelMatrix));
            gl.uniformMatrix4fv(sProgram.projectionLoc, false, new Float32Array(projectionMatrix));
            gl.uniformMatrix4fv(sProgram.viewLoc, false, new Float32Array(viewMatrix));
            gl.uniformMatrix4fv(sProgram.lightViewLoc, false, new Float32Array(lightViewMatrix));
            gl.uniformMatrix4fv(sProgram.lightProjectionLoc, false, new Float32Array(lightProjectionMatrix));
            gl.uniform4fv(sProgram.colorAttribLoc, this.color);

            gl.uniform3fv(sProgram.lightDirAttribLoc, new  Float32Array(currLightDirection));
            
            gl.uniform1i(sProgram.hasNormalsAttribLoc, this.hasNormals);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.uniform1i(sProgram.samplerLoc, 0);            

        } else {
            this.layerProgram.use();
        // updateModelMatrix(centroid);
            gl.uniformMatrix4fv(this.layerProgram.modelLoc, false, new Float32Array(modelMatrix));

            // updateProjectionMatrix();
            gl.uniformMatrix4fv(this.layerProgram.projectionLoc, false, new Float32Array(projectionMatrix));

            // updateViewMatrix(centroid);
            gl.uniformMatrix4fv(this.layerProgram.viewLoc, false, new Float32Array(viewMatrix));

            gl.uniform4fv(this.layerProgram.colorAttribLoc, this.color);
        }

        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);

    }
}

/*
    Event handlers
*/
window.updateRotate = function() {
    currRotate = parseInt(document.querySelector("#rotate").value);
}

window.updateLightRotate = function() {
    currLightRotate = parseInt(document.querySelector("#lightRotate").value);
}

window.updateZoom = function() {
    currZoom = parseFloat(document.querySelector("#zoom").value);
}

window.updateProjection = function() {
    currProj = document.querySelector("#projection").value;
}

window.displayShadowmap = function(e) {
    displayShadowmap = e.checked;
}

/*
    File handler
*/
window.handleFile = function(e) {
    var reader = new FileReader();
    reader.onload = function(evt) {
        var parsed = JSON.parse(evt.target.result);
        for(var layer in parsed){
            var aux = parsed[layer];
            layers.addLayer(layer, aux['coordinates'], aux['indices'], aux['color'], aux['normals']);
        }
    }
    reader.readAsText(e.files[0]);
}

/*
    Update transformation matrices
*/
function updateModelMatrix(centroid) {
    return identityMatrix();
}

function updateProjectionMatrix() {
    // TODO: Projection matrix
    // var projectionMatrix = identityMatrix();
    // return projectionMatrix;
    var projectionMatrix;
    var aspect = window.innerWidth / window.innerHeight;
    if (currProj == "perspective"){
        projectionMatrix = perspectiveMatrix(45 * Math.PI / 180.0, aspect, 1, 500000);
    } else {
        var zoom = 5000
        var size = zoom - (currZoom/100.0) * zoom * 0.99;
        projectionMatrix = orthographicMatrix(-aspect * size, aspect * size, -size, size, -1, 50000);
    }
    return projectionMatrix;
}

function updateViewMatrix(centroid){
    // TODO: View matrix
    // var viewMatrix = identityMatrix();
    // return viewMatrix;
    var viewMatrix;
    var radRotate = currRotate * Math.PI / 180.0;
    var zoom = 5000;
    var rad = zoom - (currZoom / 100.0) * zoom * 0.99;
    var x = rad * Math.cos(radRotate);
    var y = rad * Math.sin(radRotate);
    viewMatrix = lookAt(add(centroid, [x,y,rad]), centroid, [0,0,1]);
    return viewMatrix;
}

function updateLightViewMatrix(centroid) {
    // TODO: Light view matrix
    // var lightViewMatrix = identityMatrix();
    var lightViewMatrix;
    var radRotate = currLightRotate * Math.PI / 180.0;
    var rad = 500;
    var x = rad * Math.cos(radRotate);
    var y = rad * Math.sin(radRotate);
    var position = add(centroid, [x,y, rad]);
    lightViewMatrix = lookAt(position, centroid, [0,0,1]);
    currLightDirection = normalize(sub(position, centroid));
    return lightViewMatrix;
}

function updateLightProjectionMatrix() {
    // TODO: Light projection matrix
    // var lightProjectionMatrix = identityMatrix();
    var size = 80000;
    var lightProjectionMatrix = orthographicMatrix(-size, size, -size, size, -2500, 2500);
    return lightProjectionMatrix;
}

/*
    Main draw function (should call layers.draw)
*/
function draw() {

    gl.clearColor(190/255, 210/255, 215/255, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TODO: First rendering pass, rendering using FBO
    fbo.start();
    var modelMatrix = updateModelMatrix(layers.centroid);
    var lightViewMatrix = updateLightViewMatrix(layers.centroid);
    var lightProjectionMatrix = updateLightProjectionMatrix();
    layers.draw(modelMatrix, lightViewMatrix, lightProjectionMatrix);
    fbo.stop();

    var modeViewMatrix = updateViewMatrix(layers.centroid);
    var modelProjMatrix = updateProjectionMatrix();
    if(!displayShadowmap) {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // TODO: Second rendering pass, render to screen
        layers.draw(modelMatrix, modeViewMatrix, modelProjMatrix, lightViewMatrix, lightProjectionMatrix, true, fbo.texture);

    }
    else {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // TODO: Render shadowmap texture computed in first pass
        renderToScreen.draw(fbo.texture);        
    }

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

    gl.enable(gl.POLYGON_OFFSET_FILL);

    layers = new Layers();
    fbo = new FBO(currResolution);
    renderToScreen = new RenderToScreenProgram();

    window.requestAnimationFrame(draw);

}


window.onload = initialize;