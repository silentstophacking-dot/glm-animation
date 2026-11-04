# Character outfit study

The owner asked to see clothing changes that make the character more distinct from the supplied Ifverse benchmark. This is a still design comparison, not a selected costume or an animation update.

Four equal-height, equal-pose figures use the same sunset lighting and current view-aware rig:

- Current orange hoodie, retained as the comparison/archive default.
- A: muted teal open overshirt, cream T-shirt, pointed collar, chest pocket, shorter layered hem and off-white shoes. Recommended direction.
- B: ochre utility jacket, high folded collar, centre zip, patch pockets and shorter gathered hem, with dark shoes.
- C: navy waistcoat over cream sleeves, V-front, buttons, welt pockets and pointed lower panels, with off-white shoes.

These options change garment construction and silhouette rather than simply recolouring the hoodie. The head, facial treatment, height, limb anchors and pose are unchanged to isolate the clothing decision. They therefore do not establish complete visual distinctiveness or a final character identity. The approved-direction sunset lab still shows option A in context.

Implementation: optional `outfit` on CharacterTurnV5, with hoodie as the existing default; separate garment/palette components and dedicated still compositions. No existing performance or episode adopts a new look. Selection remains with the owner. The non-default outfits need turn, overlap and contact review before animation use, especially their collars and shorter hems.

Local inspection caught the former hoodie hiding an unfinished hip area under the shorter hems. The non-default costumes now include a continuous trouser waist beneath the shirt/jacket, without a separate outlined band.

Validation: inspect the rendered 1440×1700 comparison and 1920×1080 teal lab still, typecheck and run the existing combined rig audit as a shared-component regression check. A dedicated Actions workflow renders only these two PNGs, verifies their dimensions and uploads logs. No movie render is needed to choose an outfit.
