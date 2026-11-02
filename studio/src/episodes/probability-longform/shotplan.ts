/**
 * First long-form 16:9 episode's canonical editing timeline.
 * Times are editorial placeholders until real narration is recorded/aligned.
 *
 * Exact match with production/probability-longform/episode-manifest.json;
 * authoring process MUST update both, and validator checks exact match.
 */
export const LONGFORM_FPS = 30;
export const LONGFORM_TOTAL_FRAMES = 6900;
export const LONGFORM_SHOTS = [
  {id:"COLD_OPEN",start:0,end:240,stage:"cave",voice:"He changed his chance of dying to zero. And then the ground swallowed him."},
  {id:"BURIED_PROMISE",start:240,end:450,stage:"cave",voice:"Pinned beneath concrete, he could still breathe. He just couldn't move."},
  {id:"FLASHBACK",start:450,end:690,stage:"study",voice:"A few hours earlier, he had discovered the strangest ability imaginable."},
  {id:"FIRST_CONSOLE",start:690,end:900,stage:"interface",voice:"He could select any event and set its probability anywhere from zero to one hundred percent."},
  {id:"COIN_TOSS",start:900,end:1140,stage:"study",voice:"So he tried something harmless. A coin toss. He chose heads: one hundred percent."},
  {id:"HEADS_RESULT",start:1140,end:1350,stage:"desk",voice:"Heads. He flipped it again. Heads."},
  {id:"TEN_HEADS",start:1350,end:1590,stage:"desk",voice:"Ten flips, ten heads. Not luck. A guarantee."},
  {id:"LOTTERY_TEST",start:1590,end:1890,stage:"kiosk",voice:"Then he tried a lottery ticket. Not because he needed the money. Because he wanted to know if there was a limit."},
  {id:"LOTTERY_WIN",start:1890,end:2130,stage:"kiosk",voice:"The numbers matched. Every single one."},
  {id:"EUPHORIA",start:2130,end:2370,stage:"overlook",voice:"It felt like he had found a cheat code for real life. But he missed the tiny warning on the screen."},
  {id:"ONE_ACTIVE_RULE",start:2370,end:2610,stage:"interface",voice:"Only one probability can be controlled at a time. Change the target, and the old guarantee disappears."},
  {id:"DEATH_ZERO",start:2610,end:2880,stage:"study",voice:"He decided there was one setting more valuable than money: the chance of dying. Zero percent."},
  {id:"NEAR_MISS",start:2880,end:3120,stage:"city",voice:"With that active, a falling sign missed his head by inches. He laughed instead of running."},
  {id:"WALK_HOME",start:3120,end:3360,stage:"street",voice:"He was still celebrating as he headed home."},
  {id:"SITE_WARNING",start:3360,end:3630,stage:"street",voice:"Rain soaked the street. A truck rolled past a construction site, and the pavement trembled under his shoes."},
  {id:"CRACK",start:3630,end:3900,stage:"street",voice:"He heard one sharp crack. Then another. The road began breaking apart beneath him."},
  {id:"FALL",start:3900,end:4170,stage:"sinkhole",voice:"Before he could jump, the asphalt vanished. He fell into the darkness."},
  {id:"TRAPPED",start:4170,end:4470,stage:"cave",voice:"Rubble slammed down around him. Dust filled the air. When everything stopped, he realized the impossible: he was alive."},
  {id:"THE_LIMIT",start:4470,end:4770,stage:"cave",voice:"His protection had worked. But it only prevented death. It didn't promise comfort, rescue, or freedom."},
  {id:"NO_RESCUE",start:4770,end:5010,stage:"cave",voice:"He pushed against the concrete. Nothing moved. And nobody on the street could hear him."},
  {id:"ONE_PERCENT",start:5010,end:5310,stage:"interface",voice:"The interface gave him a number: the chance of escaping by himself. One percent. One outcome in a hundred."},
  {id:"BAD_CHOICE",start:5310,end:5640,stage:"cave",voice:"He could change it to one hundred. But he'd have to overwrite the protection keeping him alive."},
  {id:"OVERRIDE_DECISION",start:5640,end:5910,stage:"interface",voice:"He stared at the choice. Stay buried and guaranteed alive? Or escape, with no guarantee of what happens next?"},
  {id:"RUBBLE_MOVES",start:5910,end:6150,stage:"cave",voice:"He chose escape. One hundred percent. The zero-percent death protection vanished immediately."},
  {id:"LAUNCHED",start:6150,end:6390,stage:"sinkhole",voice:"The concrete shifted. A slab lifted. Something beneath him gave way, and he was thrown upward through the broken street."},
  {id:"HEADLIGHTS",start:6390,end:6630,stage:"street",voice:"For one perfect second, it worked. He was free. Then he saw the headlights coming straight toward him."},
  {id:"PRE_IMPACT",start:6630,end:6900,stage:"street",voice:"His escape was guaranteed. His survival wasn't. Controlling one probability doesn't mean controlling what happens next."},
] as const;

export type LongformShotId = typeof LONGFORM_SHOTS[number]['id'];
export type LongformStage = typeof LONGFORM_SHOTS[number]['stage'];

export const assertLongformTimeline = () => {
  let end=0;
  for(const shot of LONGFORM_SHOTS){
    if(shot.start!==end || shot.end<=shot.start){
      throw new Error('Invalid long-form shot continuity at '+shot.id);
    }
    end=shot.end;
  }
  if(end!==LONGFORM_TOTAL_FRAMES || LONGFORM_SHOTS.length!==27){
    throw new Error('Longform episode expected 27 shots and 6900 frames');
  }
};
assertLongformTimeline();
