const vertex = `
precision highp float;

attribute vec2 a_position;

uniform vec2 u_scalingFactor;
uniform float u_seconds;

varying vec2 pos;

void main() {
    pos = a_position;
    gl_Position = vec4(a_position * u_scalingFactor, 0.0, 1.0);
}
`;

// thanks https://www.shadertoy.com/view/wtdSzX for the maths
const fragment = `
precision highp float;

uniform float u_seconds;
uniform float u_hexagonSize;
uniform float u_darkenCoeff;

varying vec2 pos;

const vec2 side = vec2(1.0, 1.7320508);

float hex(in vec2 point) {
    point = abs(point);
    return max(dot(point, side * 0.5), point.x);
}

vec4 getHex(vec2 point) {
    vec4 hexagonCenters = floor(vec4(point, point - vec2(0.5, 1)) / side.xyxy) + 0.5;
    vec4 hexes = vec4(point - hexagonCenters.xy * side, point - (hexagonCenters.zw + 0.5) * side);

    return dot(hexes.xy, hexes.xy) < dot(hexes.zw, hexes.zw)
        ? vec4(hexes.xy, hexagonCenters.xy)
        : vec4(hexes.zw, hexagonCenters.zw + 0.5);
}

void main() {
    vec4 currentHex = getHex(pos * u_hexagonSize + side.yx * u_seconds / 4.0);
    float edgeDistance = hex(currentHex.yx);

    vec3 col = mix(vec3(0.7), vec3(1.4), mix(0.3, 1.2, edgeDistance));
    col *= vec3(pos.x,
                pos.y,
                0) + 0.4;

    col *= u_darkenCoeff;

    gl_FragColor = vec4(col, 1.0);
}
`;

const FPS = 60;
const hexagonSize = 6;

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
let u_seconds;
let u_hexagonSize;
let u_darkenCoeff;

let startTime;
let darkenCoeff;

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
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.DYNAMIC_DRAW);

    vertexCount = vertexArray.length / vertexNumComponents;

    startTime = Date.now() / 1000;
    darkenCoeff = 1.0;

    setInterval(renderLoop, 1000 / FPS);
}

function renderLoop() {
    let timeRunning = Date.now() / 1000 - startTime;

    resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(bgProgram);

    u_scalingFactor = gl.getUniformLocation(bgProgram, "u_scalingFactor");
    u_seconds = gl.getUniformLocation(bgProgram, "u_seconds");
    u_hexagonSize = gl.getUniformLocation(bgProgram, "u_hexagonSize");
    u_darkenCoeff = gl.getUniformLocation(bgProgram, "u_darkenCoeff");

    gl.uniform2fv(u_scalingFactor, currentScale);
    gl.uniform1f(u_seconds, timeRunning);
    gl.uniform1f(u_hexagonSize, hexagonSize);
    gl.uniform1f(u_darkenCoeff, darkenCoeff);

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