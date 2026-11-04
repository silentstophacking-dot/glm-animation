# Construction

## Stable proportions

Keep a shared proportion model: head, neck, shoulders, chest, pelvis, joint positions, limb lengths and visual widths. Separate these measurements from pose and camera state. Keep head height and standing height stable across views unless perspective explicitly changes them.

Front, three-quarter and profile views need distinct geometry. Interpolate meaningful anchors and compatible path topology; use authored shape replacements at occlusion boundaries where interpolation would collapse a shape. A full turn is not a horizontal scale of a single drawing.

## Volume during a turn

- Move face features over the head surface and compress spacing toward profile. Hide the far eye through occlusion when warranted; do not fade an eye merely to imply distance. The owner requested equally opaque visible eyes.
- Change chest width, center seam and visible side plane together. Keep the neck attached to the head and torso. The hood should wrap the nape and change visible sides.
- Project left/right shoulders around the torso. Update elbows, wrists, hands and sleeve paths with their shoulder positions. The frontal resting pose needs frontal arms and inward-facing thumbs; do not keep side-view arms under a frontal face.
- Change limb draw order when a limb passes behind the body. Keep ordering deterministic at each frame; inspect the crossing for a pop. Choose a natural occlusion moment for a discrete order change.
- Use view-dependent widths and shortened projected limb lengths for foreshortening. Maintain underlying limb lengths; don't stretch limbs to reach a target.
- Turn cuffs, thumbs and shoes with their respective limbs/body. Check the entire silhouette, including feet, in every view.

## Grounding and contact

Use a shared world space and camera for the actor, prop, floor and shadows. Background parallax follows plane depth and camera motion, not an independent decorative slide.

Hold planted foot world positions. Transfer weight over the support area; give lifts and landings clear phases. Foot rolling must respect the contact pivot. For a turn, either keep support contacts fixed or explicitly author a foot pivot—do not rotate the whole character as a billboard and let the soles drift.

Solve hands to physical prop targets after shoulder/torso transforms. Account for lean, drop, scale and camera projection. Enforce reachable chains and a stable wrist-to-palm offset. Moving controls require a moving shared target. Contact shadows should follow real foot and prop positions.

## Lighting

Choose a light direction from the scene. Apply coherent warm rim/cool fill and restrained side planes. Lighting may distinguish near/far sleeves without reducing facial readability. Shading supports shape changes; it cannot substitute for correct geometry or overlap.

## Acting

Separate gaze, head, chest, pelvis and hand timing. Let attention lead a reach where appropriate. Use anticipation, deliberate pauses, contact, reaction and recovery. Avoid identical motion on all joints and generic sine-wave body bobbing. Do not use spring bounce indiscriminately for weight-bearing contact.
