import * as THREE from "three";
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

function main() {

    const canvas = document.getElementById("c");
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

    const colorAmb = 0xFFFFFF;
    const intensityAmb = 0.1;
    const ambientLight = new THREE.AmbientLight(colorAmb, intensityAmb);

    const colorDir = 0xFFFFFF;
    const intensityDir = 2;
    const dirLight = new THREE.DirectionalLight(colorDir, intensityDir);
    dirLight.position.set(4, 20, -6);
    dirLight.target.position.set(-5, 0, 0);


    const loader = new THREE.TextureLoader();

    const materials = [
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/wall.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/wall.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/roof.jpeg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/roof.jpeg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/wall.jpg')}),
        new THREE.MeshPhongMaterial({map: loadColorTexture('resources/wall.jpg')}),
      ];

    function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        return texture;
    }

    const planeSize = 40;

    const texture = loader.load('resources/ground.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);
    planeMesh.rotation.x = Math.PI * -.5;

    const cylinderGeom = new THREE.CylinderGeometry(1, 1, 0.5, 8);
    const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x333333});
    const wheel = new THREE.Mesh(cylinderGeom, wheelMaterial);
    wheel.rotation.x = 1.57;
    wheel.position.set(0,4,0);

    const sphereGeom = new THREE.SphereGeometry(3, 10, 10);
    const bushMaterial = new THREE.MeshPhongMaterial({color: 0x228822});
    const bush = new THREE.Mesh(sphereGeom, bushMaterial);
    bush.position.set(-4,-1,-4);

    const sunGeom = new THREE.SphereGeometry(1, 10, 10);
    const sunMaterial = new THREE.MeshPhongMaterial({color: 0xFFFF00});
    const sun = new THREE.Mesh(sunGeom, sunMaterial);
    sun.position.set(4, 20, -6);

    const fov = 45;
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 10, 20);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0,5,0);
    controls.update();

    const scene = new THREE.Scene();


    const boxWidth = 4;
    const boxHeight = 10;
    const boxDepth = 4;
    const boxGeom = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const building = new THREE.Mesh(boxGeom, materials);
    building.position.set(0, 5, 5);
    scene.add(building);
    scene.add(ambientLight);
    scene.add(planeMesh);
    scene.add(wheel);
    scene.add(bush);
    scene.add(dirLight);
    scene.add(dirLight.target);
    scene.add(sun);


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }


    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        wheel.rotation.y = time;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}


main();