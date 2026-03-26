import * as THREE from "three";

let scene, camera, renderer, controls, raycaster, mouse;
let clickableObjects = [];

// --- Initialisation ---
export function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d1b2a);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(0, 5, 10);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Contrôles
  import("../src/controls.js").then(({ default: OrbitControls }) => {
    controls = new OrbitControls(camera, renderer.domElement);
  });

  addLights();
  addGround();

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("click", onMouseClick);
}

function addLights() {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  dirLight.castShadow = true;
  scene.add(dirLight);
}

export function addGround(texturePath = "./textures/grass.jpg") {
  const textureLoader = new THREE.TextureLoader();
  const grassTexture = textureLoader.load(texturePath);
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(10, 10);

  const planeGeometry = new THREE.PlaneGeometry(50, 50);
  const planeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;

  scene.add(plane);
}

// Crée un cube projet interactif
export function createProject(x, y, z, color = 0xff6347, data = {}) {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(x, y, z);
  cube.castShadow = true;

  cube.userData = data;
  scene.add(cube);
  clickableObjects.push(cube);
  return cube;
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(clickableObjects);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    showOverlay(obj.userData);
  }
}

function showOverlay(data) {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.innerHTML = `
    <h2>${data.title || "Projet"}</h2>
    <p>${data.description || "Description non disponible."}</p>
    ${data.link ? `<a href="${data.link}" target="_blank" rel="noopener noreferrer">Voir le projet</a>` : ""}
  `;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

export function animate(objects = []) {
  requestAnimationFrame(() => animate(objects));

  objects.forEach(obj => {
    obj.rotation.y += 0.01;
    obj.position.y = Math.sin(Date.now() * 0.002 + obj.position.x) * 0.5 + 1;
  });

  if (controls) controls.update();
  renderer.render(scene, camera);
}

// Exports
export { scene, camera, renderer, clickableObjects, mouse };