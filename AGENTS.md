# Rules for AI agents (Codex, ChatGPT, Claude, Copilot, etc.)

This repo is **UFO Abduction**, a 3D browser game by Mando (GitHub: Mando49).
It is live at https://mando49.github.io/ufo-abduction/. **Anything pushed to `main` goes live right away**, so `main` must always work.

## 1. Never push to `main`

- Make a new branch for every change: `agent/<your-name>-<short-topic>`
  (for example `agent/codex-ocean-ruins`).
- Open a **Pull Request** into `main`. Do not merge it yourself.
- Mando or a reviewer agent checks the PR first. Only then does it get merged.
- Keep each PR to **one feature or one fix**. Don't bundle unrelated changes.

## 2. What to write in the PR description

- **What changed**, in plain words (Mando is not a programmer).
- **How to see it in the game** (where to fly, what to press).
- **How you tested it** (see section 4).
- Anything you were **not** able to test.

## 3. How the game is built (read before editing)

- The whole game is one file: `index.html`. Don't split it into several files and don't add a build step.
- It uses **three.js r128** from the CDN (`three@0.128.0`). Only use features that exist in r128.
  - Example: `THREE.CapsuleGeometry` does **not** exist in r128. There is a small polyfill near the top of the file; don't remove it.
- Worlds are built between `beginTown('name')` and `endTown('name',[fogNear,fogFar])`. Per-frame animation goes in `planetAnim.push({town:'name',f:(t,dt)=>{...}})`.
- **If you add a new world/town, you must also add:**
  - a music entry in `TRACKS` (otherwise the game freezes)
  - an entry in `TOWN_NAMES` and `TOWN_SECTOR`
  - a way to get there (a portal, the black hole, etc.)
- **Abductable things (`targets`)**: never set `mesh.position.y` every frame unless `T.state==='ground'`, or the tractor beam can't lift them.
- Don't rename or reset the save data in localStorage (`ufoSave`, `ufoMissions`, `ufoBadges`, `ufoSecrets`, `ufoRaceBest`). Players would lose their progress.
- It must run well on an **iPhone**. Avoid huge numbers of objects or heavy work every frame. Prefer `InstancedMesh` for repeated things.
- Don't commit test or debug files such as `dbg.html`.

## 4. Testing checklist (do this before opening the PR)

1. Open the game and press **PLAY**. There should be **no errors in the browser console**.
2. Go to the place you changed and check it looks right.
3. Make sure the basics still work there: flying, the **BEAM** abducting something, the music, and the timer counting down (if the timer stops, the game has frozen).
4. If you changed a world, also visit one other world to make sure it still loads.

## 5. Commits

- Use clear commit messages, for example "Add hydrothermal vents to the ocean".
- Update `README.md` when you add something a player would notice.
