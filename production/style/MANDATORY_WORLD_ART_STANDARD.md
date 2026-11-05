# Mandatory cinematic 2.5D art standard (owner requirement)

This is a **hard production rule**, not an optional creative direction.

## Source of authority
Owner approved the latest coherent left-facing character from the 17-second Glass Reversal scene, then explicitly directed that every visible object and city building match that same detailed material and lighting standard. A polished hero subject against simplistic props or a flat skyline is never considered finished.

## Hard rules for every new shot
- No placeholder rectangles, generic city silhouettes, flat blocks or undetailed props in final-reviewed frames.
- City layers must have varied roofs, depth, architectural construction, individual windows, hardware, warm sun integration and distance haze.
- Lab fixtures must be supported in the shared 2.5D world, with metal/glass/wood material separation, bevels, edges, trim, screws, reflections and grounded shadows.
- Never animate scenery independently from the projected camera. Keep window trim, city, wall, glass apparatus and actor aligned.
- Keep the established warm sunset rim plus cool reflected fill. Additional bloom does not replace geometry/materials.
- Never modify approved ClockDiscoveryPerformance source/visuals while preparing a newer scene.
- Keep the approved character correction: entire torso/head/puffer face the vial together, gloves outside jacket silhouette, grounded feet and no independent neck spinning.
- Do not mistake passing automated source checks for artistic approval. Inspect actual rendered frames at phone size.

## Art review: exactly three gates before movie render
1. **Opening wide** at frame 33: inspect city depth, floor, wall, windows, silhouette layering and general asset density.
2. **Glass/bench closeup** at frame 254: inspect apparatus, bench joinery, materials, supports and projected contact.
3. **Character reaction** at frame 416: inspect visible gloves, arms, torso, city parity, background detail and lighting.

Reject any frame with visible 'temporary' low-detail silhouettes. Correct weak assets, rerender stills only, and preserve all previous branches. Only after explicit approval should a 17s final video render run.

## Implementation state (5 November 2026)
- Source branch: feature/environment-city-style-unification.
- Parent reference: feature/reversal-coherent-left-facing-rig, draft PR #48.
- Rich art is opt-in through the LabRoomDepthScene richWorld boolean, enabled only in Glass Reversal. Earlier approved lab windows remain the default for old compositions.
- lab-rich-world.tsx contains layered distant/mid/near architecture and projected bench equipment.
- GitHub Actions workflow world-style-unification-review.yml renders three stills, not a full movie.

## Mobile-only continuity
The repository is https://github.com/silentstophacking-dot/glm-animation and GitHub Actions handles rendering. Codex is **not a production dependency**; its separate workspace/agent service is optional. Repository code, workflows, approved files and branch history persist on GitHub independently of ChatGPT credentials. GitHub Actions artifacts expire after the retention duration set in each workflow, so save approved MP4 and stills outside Actions. After any ChatGPT plan change, connected GitHub tool access can vary; use the GitHub website on mobile if necessary. Do not assume ChatGPT Free has the same connectors/Codex tools as Plus. The owner uses an iPhone only.

## What to do next
Open the latest successful World Style Unification — three checkpoint stills GitHub Actions workflow. Download WORLD-STYLE-THREE-CHECKPOINTS; inspect each actual PNG on iPhone. Improve weak areas before any approved 17s master. Build future scenes on this detailed shared world standard.
