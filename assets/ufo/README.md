# Stealth UFO asset

A reusable Three.js model factory for the triangular, dark-metal stealth craft.

## Add to the game

Load this script after Three.js and before the game script:

```html
<script src="assets/ufo/stealth-ufo.js"></script>
```

Replace the existing UFO construction with:

```js
const ufo = createStealthUFO(THREE);
scene.add(ufo);
```

In the animation loop, call:

```js
ufo.userData.update(elapsedSeconds, beamActive);
```

The factory returns a Three.js Group with a low-profile triangular hull, three bright white corner lamps, dark underside vents, and a central tractor-beam emitter. The beam origin is available at `ufo.userData.beamOrigin`.

This is a procedural 3D asset, so it does not depend on an external model download or texture file.
