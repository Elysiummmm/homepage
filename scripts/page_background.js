const vertex = `
precision highp float;

attribute vec2 a_position;

uniform vec2 u_scalingFactor;

varying vec2 pos;

void main() {
    pos = a_position + 1.0;
    gl_Position = vec4(a_position * u_scalingFactor, 0.0, 1.0);
}
`;

const fragment = `
precision highp float;

uniform float u_noiseShift;

varying vec2 pos;

float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    gl_FragColor = vec4(vec3(rand(pos * u_noiseShift)), 1);
}
`;

const FPS = 30;

let canvas = document.getElementById('background');
let gl = canvas.getContext('webgl');

let bgProgram;

let vertexArray;
let vertexBuffer;
let vertexCount;
let vertexNumComponents = 2;

let aspectRatio;
let currentScale;

let u_scalingFactor;

if (!gl) {
    // do something idk
} else {
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
    bgProgram = createProgram(gl, vertexShader, fragmentShader);

    vertexArray = new Float32Array([
        -1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
        1.0, 1.0, -1.0, -1.0, 1.0, -1.0
    ]);

    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

    vertexCount = vertexArray.length / vertexNumComponents;

    setInterval(renderLoop, 1000 / FPS);
}

function renderLoop() {
    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(bgProgram);

    u_scalingFactor = gl.getUniformLocation(bgProgram, "u_scalingFactor");
    u_noiseShift = gl.getUniformLocation(bgProgram, "u_noiseShift");

    gl.uniform2fv(u_scalingFactor, currentScale);
    gl.uniform1f(u_noiseShift, Math.sin(Date.now()));

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let a_vertexPosition = gl.getAttribLocation(bgProgram, "a_position");
    
    gl.enableVertexAttribArray(a_vertexPosition);
    gl.vertexAttribPointer(
        a_vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}

function createShader(gl, type, source) {
    let shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth  = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;
 
    const needResize = canvas.width  !== displayWidth ||
                     canvas.height !== displayHeight;
 
    if (needResize) {
        canvas.width  = displayWidth;
        canvas.height = displayHeight;
    }

    aspectRatio = (gl.canvas.width / gl.canvas.height);
    currentScale = [1.0, aspectRatio];
 
    return needResize;
}