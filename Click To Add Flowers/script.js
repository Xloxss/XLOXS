import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module";

const canvasEl = document.querySelector("#canvas");
const cleanBtn = document.querySelector(".clean-btn");
const music = document.querySelector("#backgroundMusic"); 
const nameText = document.querySelector("#name"); 

const pointer = {
    x: .5, 
    y: .5,
    clicked: false, 
};

let firstUserInteraction = false; 

let basicMaterial, shaderMaterial;
let renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true, // Arka planın şeffaf olmasına izin ver
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
let sceneShader = new THREE.Scene();
let sceneBasic = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
let clock = new THREE.Clock();

let renderTargets = [
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
];

createPlane();
updateSize();

// Renderer'ı ve doku hedeflerini başlangıçta temizle
// Bu sefer şeffaf bir temizlik yapıyoruz
initialClean(); 

window.addEventListener("resize", () => {
    updateSize();
    cleanCanvas();
});

render();

let isTouchScreen = false;

const handleUserInteraction = (e) => {
    if (!firstUserInteraction) { 
        // 1. Müzik çal
        music.play().catch(error => {
            console.log("Müzik çalma hatası:", error);
        });
        
        // 2. Yazıyı gizle
        nameText.style.display = 'none'; 
        
        firstUserInteraction = true; 
    }
    
	if (!isTouchScreen) {
        pointer.x = e.pageX / window.innerWidth;
        pointer.y = e.pageY / window.innerHeight;
        pointer.clicked = true;		
	}
};

const handleUserTouch = (e) => {
    if (!firstUserInteraction) {
        music.play().catch(error => {
            console.log("Müzik çalma hatası:", error);
        });
        nameText.style.display = 'none';
        firstUserInteraction = true;
    }

	isTouchScreen = true;
    pointer.x = e.targetTouches[0].pageX / window.innerWidth;
	pointer.y = e.targetTouches[0].pageY / window.innerHeight;
	pointer.clicked = true;
};

window.addEventListener("click", handleUserInteraction);
window.addEventListener("touchstart", handleUserTouch);


cleanBtn.addEventListener("click", cleanCanvas);

// Canvas'ı başlangıçta şeffaf olarak temizlemek için kritik fonksiyon
function initialClean() {
    renderer.setRenderTarget(renderTargets[0]);
    renderer.setClearColor(0x000000, 0); // Tamamen şeffaf (siyah, alpha 0)
    renderer.clear();
    renderer.setRenderTarget(renderTargets[1]);
    renderer.setClearColor(0x000000, 0); // Tamamen şeffaf
    renderer.clear();
    renderer.setRenderTarget(null);
}

function cleanCanvas() {
    pointer.vanishCanvas = true;
    setTimeout(() => {
        pointer.vanishCanvas = false;
        // Ekranı temizledikten sonra render target'ları tekrar sıfırla
        initialClean(); 
    }, 50);
}

function createPlane() {
    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_stop_time: {type: "f", value: 0.},
            u_stop_randomizer: {type: "v2", value: new THREE.Vector2(Math.random(), Math.random())},
            u_cursor: {type: "v2", value: new THREE.Vector2(pointer.x, pointer.y)},
            u_ratio: {type: "f", value: window.innerWidth / window.innerHeight},
            u_texture: {type: "t", value: null},
            u_clean: {type: "f", value: 1.},
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
    });
    basicMaterial = new THREE.MeshBasicMaterial();
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
    const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
    sceneBasic.add(planeBasic);
    sceneShader.add(planeShader);
}

function render() {

    // Kullanıcı etkileşimi yoksa u_clean'ı sıfırda tut (şeffaf ol)
    shaderMaterial.uniforms.u_clean.value = (pointer.vanishCanvas || !firstUserInteraction) ? 0 : 1;
    
    shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

    if (firstUserInteraction) { // Sadece etkileşim varsa çiçek çizim mantığını işlet
        
        if (pointer.clicked) {
            shaderMaterial.uniforms.u_cursor.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
            shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
            shaderMaterial.uniforms.u_stop_time.value = 0.;
            pointer.clicked = false;
        }
        shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();

    } else {
        // Etkileşim yoksa zamanı sıfırda tut
        shaderMaterial.uniforms.u_stop_time.value = 0.0;
    }
    
    renderer.setRenderTarget(renderTargets[1]);
    renderer.render(sceneShader, camera);
    basicMaterial.map = renderTargets[1].texture;
    renderer.setRenderTarget(null);
    renderer.render(sceneBasic, camera);

    let tmp = renderTargets[0];
    renderTargets[0] = renderTargets[1];
    renderTargets[1] = tmp;

    requestAnimationFrame(render);
}

function updateSize() {
    shaderMaterial.uniforms.u_ratio.value = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);
}