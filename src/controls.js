import * as THREE from "three";

export class FPSControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    this.moveForward = false;
    this.moveBackward = false;
    this.moveLeft = false;
    this.moveRight = false;

    this.velocity = { x: 0, y: 0, z: 0 };
    this.direction = { x: 0, y: 0, z: 0 };
    this.speed = 5;

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 2;
    this.yawObject.add(this.pitchObject);

    this.domElement.requestPointerLock =
      this.domElement.requestPointerLock ||
      this.domElement.mozRequestPointerLock;

    this.domElement.onclick = () => {
      this.domElement.requestPointerLock();
    };

    this.enabled = false;

    document.addEventListener(
      "pointerlockchange",
      () => {
        this.enabled =
          document.pointerLockElement === this.domElement ||
          document.mozPointerLockElement === this.domElement;
      },
      false
    );

    this.domElement.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    this.prevTime = performance.now();
  }

  onMouseMove(event) {
    if (!this.enabled) return;

    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;

    this.yawObject.rotation.y -= movementX * 0.002;
    this.pitchObject.rotation.x -= movementY * 0.002;
    this.pitchObject.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.pitchObject.rotation.x)
    );
  }

  onKeyDown(event) {
    switch (event.code) {
      case "KeyW":
        this.moveForward = true;
        break;
      case "KeyA":
        this.moveLeft = true;
        break;
      case "KeyS":
        this.moveBackward = true;
        break;
      case "KeyD":
        this.moveRight = true;
        break;
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "KeyW":
        this.moveForward = false;
        break;
      case "KeyA":
        this.moveLeft = false;
        break;
      case "KeyS":
        this.moveBackward = false;
        break;
      case "KeyD":
        this.moveRight = false;
        break;
    }
  }

  update(delta) {
    if (!this.enabled) return;

    const speed = this.speed;
    const velocity = this.velocity;
    const direction = this.direction;

    direction.x = Number(this.moveRight) - Number(this.moveLeft);
    direction.z = Number(this.moveBackward) - Number(this.moveForward);
    direction.y = 0;

    // Calcul du mouvement
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.x += direction.x * speed * delta;
    velocity.z += direction.z * speed * delta;

    // Déplacement de la caméra
    this.yawObject.translateX(velocity.x * delta);
    this.yawObject.translateZ(velocity.z * delta);

    this.camera.position.copy(this.yawObject.position);
    this.camera.rotation.x = this.pitchObject.rotation.x;
    this.camera.rotation.y = this.yawObject.rotation.y;
  }
}