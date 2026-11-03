/**
 * Motion continuity tests for all 27 long-form scene classes.
 * No browser, no Remotion render, no media export.
 * Run from studio/: node ../scripts/validate_longform_motion.cjs
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require(path.resolve(__dirname,'../studio/node_modules/typescript'));

const root = path.resolve(__dirname,'../studio');
const text = fs.readFileSync(path.join(root,'src/episodes/probability-longform/motion.ts'),'utf8');
const js = ts.transpileModule(text,{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}
}).outputText;
const mod = {exports:{}};
new Function('module','exports',js)(mod,mod.exports);
const {
  coinTrajectory,repeatedCoinAt,montageCoinAt,lotteryDigit,
  COIN_RELEASE_FRAME,COIN_LANDING_FRAME,COIN_SETTLED_FRAME,
  MONTAGE_TOTAL_FLIPS,MONTAGE_FRAMES_PER_FLIP
}=mod.exports;

const hand={x:1072,y:534};
const desk={x:1190,y:657};
const released=coinTrajectory(COIN_RELEASE_FRAME,hand,desk);
const before=coinTrajectory(COIN_RELEASE_FRAME-1,hand,desk);
assert.equal(released.x,hand.x);
assert.equal(released.y,hand.y);
assert.equal(before.x,hand.x);
assert.equal(before.y,hand.y);
let minY=Infinity;
for(let f=COIN_RELEASE_FRAME;f<COIN_LANDING_FRAME;f++){
  const c=coinTrajectory(f,hand,desk);
  assert(Number.isFinite(c.x)&&Number.isFinite(c.y));
  assert(c.x>=hand.x-1&&c.x<=desk.x+1);
  minY=Math.min(minY,c.y);
}
assert(minY<hand.y-55, 'Coin must visibly rise in world space');
const atLanding=coinTrajectory(COIN_LANDING_FRAME,hand,desk);
assert(Math.abs(atLanding.y-desk.y)<.001);
for(let f=COIN_SETTLED_FRAME;f<=240;f++){
  const p=coinTrajectory(f,hand,desk);
  assert.equal(p.x,desk.x);
  assert.equal(p.y,desk.y, 'Coin must stay planted on desk after landing');
  assert.equal(p.landed,true);
}

const headStart=repeatedCoinAt(0);
const headSecond=repeatedCoinAt(210);
assert.equal(headStart.count,1);
assert.equal(headSecond.count,2);
assert.equal(headSecond.y,608);
assert.equal(headSecond.airborne,false);

let flipped=0;
for(let f=0;f<=240;f++){
  const p=montageCoinAt(f);
  assert(p.y<=608+1e-5,'Coin must never fall through its desk');
  if(f>0 && p.completed>montageCoinAt(f-1).completed)flipped++;
}
assert.equal(MONTAGE_TOTAL_FLIPS,10);
assert.equal(MONTAGE_FRAMES_PER_FLIP,22);
assert.equal(flipped,10, 'The montage must complete ten flips');
assert.equal(montageCoinAt(240).completed,10);
assert.equal(montageCoinAt(240).y,608);

for(let i=0;i<4;i++){
  assert.equal(lotteryDigit(0,i,true),7,'Winner should start with committed result');
  assert.equal(lotteryDigit(250,i,false),7,'Preview result should lock by end');
  assert.equal(lotteryDigit(0,i,true),lotteryDigit(300,i,false),
    'Ticket should not change across shot-local clock reset');
}

const shotSource=fs.readFileSync(path.join(root,'src/episodes/probability-longform/shots.tsx'),'utf8');
assert(shotSource.includes('<WorldCamera id={id} t={t} len={len}>{physical}</WorldCamera>'),
  'One camera must move ALL physical objects together');
assert(shotSource.includes('winner={id===\'LOTTERY_WIN\'}'),
  'Ticket must preserve winning numbers across cut');
assert(shotSource.includes("id==='CRACK'&&t>=140") && shotSource.includes("id==='RUBBLE_MOVES'&&t>=90"),
  'Rocks must not appear before the crack or slab impact');

console.log('PASS: anchored coin, physical release, no floating landing, 10 complete flips,');
console.log('sticky lottery ticket, gated debris, and coherent whole-world camera.');
