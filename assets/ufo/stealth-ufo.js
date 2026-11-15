/* UFO Abduction — triangular stealth craft
 * Three.js r128 compatible. Include after three.min.js:
 * <script src="assets/ufo/stealth-ufo.js"></script>
 * Then: const craft = createStealthUFO(THREE); scene.add(craft);
 * Animate: craft.userData.update(elapsedSeconds, beamActive);
 */
(function (root) {
  'use strict';

  function createStealthUFO(THREE) {
    if (!THREE) throw new Error('createStealthUFO requires THREE');

    const craft = new THREE.Group();
    craft.name = 'StealthUFO';

    // Rounded triangular planform, extruded into a thin metallic wedge.
    const shape = new THREE.Shape();
    shape.moveTo(-5.8, -3.2);
    shape.quadraticCurveTo(-6.25, -3.65, -5.55, -3.95);
    shape.lineTo(5.55, -3.95);
    shape.quadraticCurveTo(6.25, -3.65, 5.8, -3.2);
    shape.quadraticCurveTo(3.5, 0.15, 0.45, 4.65);
    shape.quadraticCurveTo(0, 5.25, -0.45, 4.65);
    shape.quadraticCurveTo(-3.5, 0.15, -5.8, -3.2);

    const bodyGeo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.78,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.22,
      bevelThickness: 0.16,
      curveSegments: 10
    });
    bodyGeo.rotateX(-Math.PI / 2);
    bodyGeo.translate(0, 0.25, 0);

    const body = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({
      color: 0x171b23,
      metalness: 0.88,
      roughness: 0.28
    }));
    body.name = 'Dark triangular hull';
    craft.add(body);

    // Thin upper armor plate gives the silhouette a sharp stealth profile.
    const topGeo = new THREE.ShapeGeometry(shape, 10);
    topGeo.rotateX(-Math.PI / 2);
    topGeo.translate(0, 1.05, 0);
    const top = new THREE.Mesh(topGeo, new THREE.MeshStandardMaterial({
      color: 0x252b35,
      metalness: 0.92,
      roughness: 0.24,
      side: THREE.DoubleSide
    }));
    top.name = 'Upper armor';
    craft.add(top);

    // Subtle underside emitter: the tractor beam originates from here.
    const emitter = new THREE.Mesh(
      new THREE.CircleGeometry(1.05, 48),
      new THREE.MeshBasicMaterial({
        color: 0xe9fbff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    emitter.rotation.x = -Math.PI / 2;
    emitter.position.set(0, 0.05, 0.15);
    emitter.name = 'Tractor beam emitter';
    craft.add(emitter);

    const emitterRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.22, 0.055, 8, 48),
      new THREE.MeshBasicMaterial({ color: 0xb8f2ff, transparent: true, opacity: 0.85 })
    );
    emitterRing.rotation.x = Math.PI / 2;
    emitterRing.position.set(0, 0.08, 0.15);
    craft.add(emitterRing);

    // Three white corner lamps, matching the reference craft.
    const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const lampPositions = [
      [-5.55, 0.9, 3.15],
      [5.55, 0.9, 3.15],
      [0, 0.9, -4.55]
    ];
    const lamps = lampPositions.map((p) => {
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), lampMaterial);
      lamp.position.set(p[0], p[1], p[2]);
      craft.add(lamp);

      const glow = new THREE.PointLight(0xdffaff, 1.2, 10, 2);
      glow.position.copy(lamp.position);
      craft.add(glow);
      return { lamp, glow };
    });

    // Small dark underside panels add mechanical detail without colorful clutter.
    const panelMat = new THREE.MeshStandardMaterial({
      color: 0x080b10, metalness: 0.7, roughness: 0.42
    });
    [-2.8, 2.8].forEach((x) => {
      const vent = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.32), panelMat);
      vent.position.set(x, 0.05, -1.9);
      craft.add(vent);
    });

    craft.userData.update = function (time, beamActive) {
      const pulse = 0.82 + 0.18 * Math.sin(time * 3.2);
      lamps.forEach(({ lamp, glow }, index) => {
        const flicker = 0.92 + 0.08 * Math.sin(time * 5 + index * 2.1);
        lamp.scale.setScalar(flicker);
        glow.intensity = pulse * flicker * 1.25;
      });
      emitter.material.opacity = beamActive ? 1 : 0.38 + pulse * 0.12;
      emitterRing.material.opacity = beamActive ? 1 : 0.55;
      emitter.scale.setScalar(beamActive ? 1.12 + 0.04 * Math.sin(time * 10) : 1);
    };

    craft.userData.beamOrigin = new THREE.Vector3(0, -0.15, 0.15);
    craft.userData.lampPositions = lampPositions;
    return craft;
  }

  root.createStealthUFO = createStealthUFO;
})(typeof window !== 'undefined' ? window : globalThis);
