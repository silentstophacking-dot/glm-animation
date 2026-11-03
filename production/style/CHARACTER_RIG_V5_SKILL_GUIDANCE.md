# Character Rig V5 — skill-guided acting proof

## Scope
V2–V4 passed engineering checks but retained unconvincing knee bending, sideways crouches and weight transfer. This branch preserves the existing Probability Control film and all prior proof variants. V5 uses a new SVG skeleton and an 11-second original acting study.

## Skill guidance applied
- Remotion Markup / Best Practices: derive all frame motion from useCurrentFrame, never CSS animation. World geometry stays under one camera transform, separate from screen-space HUD. Source: https://github.com/remotion-dev/skills/tree/main/skills/remotion-markup
- Animate by Emil Kowalski: move only with purpose; time the notice, anticipation, steps, brace, contact, recoil and settle without decorative swaying. Source: https://github.com/emilkowalski/skills/tree/main/skills/animate
- Vector Illustration: use independent SVG semantic parts, silhouette-based design, overlap, legibility and rendered vector review. Source: https://github.com/syi0808/svg-skills/tree/main/vector-illustration

These guides informed construction. The branch does not claim those skills were installed in the GitHub Actions runner.

## Choreography
1. Notice unusual activity at a low control panel
2. Load weight and take two distinct steps
3. Lower the hips with two visibly separated knees, both feet planted
4. Reach, contact and hold a world-fixed console button
5. Release, rise and react to the system coming alive

## Technical acceptance
- 1920×1080 SVG composition, 330 frames at 30 FPS, 11 seconds
- New skeleton separate from ReferenceHero and CharacterRigV2
- World-space fixed foot locations outside swing windows
- Two-bone IK with explicit unreachable-target error instead of stretching
- Knee separation checked on every frame
- Exact button-hand contact on frames 215–247
- Deterministic poses, no background drift or unmotivated ambient loops
- Render stills for stride, squat, contact and reaction plus whole preview
- Typecheck and 330-frame verification; manual visual review required afterward

Automated checks are not proof of Ifverse-level performance or style. Do not merge or expand to the full film on technical checks alone.
