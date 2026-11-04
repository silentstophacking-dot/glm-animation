# Character silhouette V4 — design candidate

Owner feedback after Performance V3: the main remaining concern is **overall proportions and silhouette**. Movement improvements are welcome, but are not character-design approval.

Reviewed actual supplied Reaction Time frames (`reaction-50-full.png`, `standing/40-full.png`) alongside the existing rig. The useful reference relationships are a connected shoulder/garment mass, sleeves with enough visual weight, a readable neck, and uncomplicated hanging-arm shapes. No claim of exact reference measurements or parity is made from these perspective views.

The candidate is an opt-in `design="silhouette-v4"` on CinematicCharacterV2. Default rendering remains unchanged. It changes the shoulder position and slope, shapes chest/waist/hem together, reduces garment narrowing on a turn, increases sleeve and leg thickness, slightly strengthens the neck, opens the resting wrist gap and straightens the resting limbs. Head size, overall height, hip level and shoe shapes are held constant for an equal-height comparison. This deliberately addresses width relationships and stance before changing limb-length ratios.

`CharacterSilhouetteV4Sheet` compares current/revised three-quarter figures, a revised front view and a solid silhouette. During local visual review, the first revised resting-arm target produced excessive elbow bend; extending its fall removed that problem before delivery.

This is a still design candidate. The revised shoulder geometry has not been integrated into the 330-frame performance. Its contacts and sleeve/torso overlaps must be retuned and visually reviewed if this silhouette is selected. Probability Control, Performance V3 and earlier proofs retain their existing default design.

The dedicated Character design review workflow renders one PNG on this feature branch, verifies its dimensions and uploads diagnostics. It avoids spending Actions minutes on another movie while reviewing the figure. Existing production MP4 rendering and manual composition selection are preserved.
