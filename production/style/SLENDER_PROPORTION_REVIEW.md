# Slender character proportion revision

The previous preview's head diameter was 74 of 255 actor units (~29% of standing height), and floor-to-hip distance was only 66 (~26%). Adding a neck did not correct that mismatch.

Re-inspected the supplied Reaction Time clip at 00:40 at its original 1280×720 resolution. The standing coral figure occupies roughly y=340–549 and its head spans about 40–42 pixels. This supports a head-height share around 19–20%, allowing for rim light, raster softness and perspective. These are approximate image observations from one shot, not exact channel rig specifications. The 00:50 closer shot also shows a much lighter clothing outline and compact black hands.

The new independent SlenderCharacter uses a 360-unit standing height, 68-unit head diameter (18.9%), a 142-unit floor-to-hip distance (39.4%), a 25-unit profile garment width, 8-unit near sleeve fill, 1.4-unit clothing outlines and smaller black hands. Neck remains visible. Removed the broad hanging hood/backpack shape and chunky rim. Feet remain on the same baseline.

SlenderDesignSheet compares the previous and revised figures at equal standing height, plus front and cap variants. This is a static appearance prototype. The point pose is illustrative, not an animation/contact solver; the existing contact preview and previous experiments are preserved. Pose mechanics must be adapted to the new geometry after appearance review.

Rendered and visually inspected the local 1920×1080 sheet; typecheck passed. A dedicated GitHub workflow renders one still and uploads it for iPhone review, conserving video rendering minutes. The new composition is also registered for manual composition selection.

The revision addresses silhouette and proportions. It is not claimed to be a pixel-identical reconstruction of the reference videos: their lighting, garment variation, shot-specific drawing, facial acting and layered environments still need separate work. No source frames are embedded or committed. No full episode or new motion preview has been rendered for this design revision.
