# Development audit — 2026-11-04

## Scope and baseline
Inspected branch inventories for V2, V3, V4, V5, Ifverse reference match and first-full-film; reviewed the character implementation files, composition registry, long-form registration, depth utilities, style specifications and current character/full-film workflows. No existing film or experiment is replaced.

Use feature/ifverse-character-reference-match (86c102baf53bb78b0d55073876868b6c6864590b) as this change's base: it retains the earlier experiments and 230-second film. Main is substantially behind this work. This PR deliberately targets that feature branch; merging it alone does not install the workflow on main.

## Foundation recommendation (source audit, pending visual validation)
- V2: reusable articulated rig and coordinate transforms, but its heavier silhouette is a weak appearance baseline.
- V3: connected coin micro-story and contact audits; deep pickup and body mechanics need visual scrutiny.
- V4: improved staging, planted steps and supported squat, with a separate macro hand pickup. The insert avoids demonstrating continuous full-body pickup.
- V5: strongest mechanics foundation: explicit two-bone constraints, reachable targets, knee separation, planted feet and fixed-button contact. Retain its math/constraints, rather than adopting its wider body design.
- Ifverse study: strongest appearance candidate: narrow limbs, simple circular heads, restrained facial marks and flat garments. Existing study is not a production motion rig.
- Existing depth25 utilities derive movement from camera state. Contacting objects must share both depth and transform; assigning different depths breaks contact.

Specific next fixes visible in source: left-facing RefCharacter changes facial placement but does not mirror the arm/body geometry; wave switches straight to its raised pose; neutral faces use the smile fallback; a pointing hand appears/disappears on gesture switching. The existing 6-second test has no physical prop contact. Fix and inspect these before expanding the rig.

## Reference limitation and next character gate
The style bible names four supplied videos, but the inspected repository trees contain no source reference video or reference-frame assets. Prior comments saying “based directly” are historical claims, not evidence that this session inspected those references.
Obtain the actual clips/links, inspect representative frames and compare head/body ratios, shoulders, limb thickness and face marks before design changes. Then build a short, isolated reach/contact/release study using the slim design and V5 constraint approach. Review actual stills at phone size, then motion. Do not rebuild or render the complete film for this review.

## Rendering
New workflow: .github/workflows/production-render.yml
- Manual exact composition ID via a string input; IDs are validated and resolved with Remotion selectComposition.
- Automatic pushes only on production/** and relevant file paths. Default is IfverseCharacterMotion; no automatic long-film render.
- Full selected duration with 330-minute job budget; no preview-frame truncation.
- H.264, yuv420p, CRF 20, faststart; preserve composition size/fps/audio.
- Metadata-driven full decoded frame count, duration, dimensions, frame rate, codec and audio checks; top-level MP4 box check and full decode.
- Movie upload only after verification, diagnostics on failure; unique run/attempt artifacts retained 14 days.
- Existing workflows unchanged; this branch name does not match their automatic render triggers.
- Render samples at first/middle/last frame are diagnostics, not a sufficient acting review board.

## iPhone operation
After the workflow is merged onto the default branch: GitHub repository → Actions → Production render → Run workflow. Select a branch containing the workflow and enter the composition ID. Start with IfverseCharacterMotion or CharacterActingV5; ProbabilityLongform01 remains available for an explicitly requested long-form export. Open the successful run, download the MP4 artifact, unzip it in Files and open the movie. Artifacts expire after 14 days.

Before default-branch installation, automatic production/** triggers can run this workflow; GitHub normally requires workflow_dispatch to exist on the default branch before showing its manual Run workflow UI. Do not copy the older feature history wholesale to main without a separate integration review.

## Verification performed
Node syntax check and Python compile passed. A real synthetic H.264/yuv420p/faststart MP4 passed the verifier; wrong expected frame count was rejected.
Local git clone failed twice because the configured proxy port was unavailable. No local dependency installation, Remotion render, source-reference visual comparison, or motion approval is claimed. GitHub workflow execution remains to be verified after installation. No full film rerender was launched.
