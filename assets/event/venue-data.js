// Venue geometry for the 3D floor plan (Hôtel du Port, Nogent-sur-Marne).
// Units are metres in the architect plan frame (x = south, y = west); floors 0–3.
// Copied from the "Compute! Venue Setup" working model; edit there first, then re-copy.

const R = (x0,y0,x1,y1) => [[x0,y0],[x1,y0],[x1,y1],[x0,y1]];
const arc = (cx,cy,rx,ry,a0,a1,n=10) => Array.from({length:n+1},(_,i)=>{const a=(a0+(a1-a0)*i/n)*Math.PI/180;return [cx+rx*Math.cos(a),cy+ry*Math.sin(a)];});
const attente = [[16.8,5.6],[27.0,5.6],...arc(23,11.2,4.0,4.2,0,180,12),[18.9,11.2],[16.8,11.2]];
const core = [
  {n:'Service', sub:'M/C', p:R(0.2,5.5,2,7.3), k:'service', fs:.42},
  {n:'ASC 1', p:R(2,5.5,3.8,7.3), k:'core', fs:.5},
  {n:'ASC 2', p:R(3.8,5.5,5.6,7.3), k:'core', fs:.5, iso:true, isoLabel:'Lifts', isoAt:[3.8,6.4]},
  {n:'Lift lobby', p:R(0.2,7.3,5.6,10.1), k:'circ'},
  {n:'Service stairs?', p:R(0.2,10.1,5.6,12.3), k:'service', fs:.4},
  {n:'Main staircase', p:R(5.6,11.1,11,15.6), k:'core', fs:.5, iso:true, at:[10.05,13.35], flights:[[11.4,14,8.4,10.6,'y'],[14,11.4,6,8.2,'y']]},
];

const FLOORS = [
 { id:0, name:'Ground floor', short:'G', sub:'Entrance · Amphitheater',
   plate:[R(0,0.3,46.9,15.9), R(12.5,15.9,36.5,29.5), R(36.5,15.9,38.6,21.5)],
   pillars:[[33.8,19.2],[33.8,26.2]],
   rooms:[
     {n:'Ground floor layout unknown', p:R(0.2,0.3,46.9,15.9), k:'unknown', at:[18,13.5], fs:.7},
     {n:'Hotel lobby', p:[[0.2,0.3],[11,0.3],[11,11.1],[5.6,11.1],[5.6,5.5],[0.2,5.5]], k:'circ', approx:true, iso:true, at:[3.2,3.4]},
     ...core,
     {n:'', p:R(41,13.2,46.9,15.9), k:'circ'},
     {n:'Welcome', p:R(41,10.5,46.9,13.2), k:'event', fs:.45, at:[42.2,12.7], iso:true},
     {n:'', p:R(35.2,10.5,41,13.2), k:'circ'},
     {n:'Hallway', p:R(31,13.2,41,15.9), k:'circ', approx:true, fs:.45, at:[37,14.55]},
     {n:'↑ 1st', p:R(19.9,0.3,21.4,5.6), k:'core', fs:.42, at:[20.65,3], flights:[[0.3,5.6,19.9,21.4,'y']]},
     {n:'WC?', p:R(11.1,12,14.1,15.4), k:'wc', approx:true, fs:.5},
     {n:'WC?', p:R(15.6,11.8,18.7,15.4), k:'wc', approx:true, fs:.5},
     {n:'Stairs', sub:'↑ 1st floor', p:R(28.8,10.5,35.2,13.2), k:'core', flights:[[35.2,28.8,10.6,13.1]], at:[29.5,11.7], fs:.5},
     {n:'Grand amphitheater', sub:'≈ 21 × 14 m', p:R(12.5,15.9,33.6,29.5), k:'amphi', approx:true, at:[22,23], iso:true},
     {n:'', p:R(33.6,15.9,36.5,29.5), k:'amphi', approx:true, low:true},
     {n:'', p:R(36.5,15.9,38.6,21.5), k:'circ', approx:true},
   ],
   doors:[[[4.4,0.3],[6.6,0.3]],[[46.9,13.4],[46.9,15.7]],[[36.5,17.5],[36.5,19.6]],[[19.9,0.3],[21.4,0.3]]],
   notes:[{t:'EVENT ENTRANCE', x:48.2, y:14.55, a:'middle'}, {t:'HOTEL ENTRANCE', x:5.5, y:-0.8, a:'middle'}, {t:'stage', x:13.8, y:22.7, a:'middle'}, {t:'under the projection room', x:35.05, y:23, a:'middle'}, {t:'street door', x:20.65, y:-0.7, a:'middle'}],
 },
 { id:1, name:'1st floor', short:'1', sub:'Salons 1–3 · lounge',
   plate:[R(0,0.3,46.9,15.9), R(33.6,15.9,44.9,20.7), R(-10.7,0.3,0,44)], vb:[-12.5,-4.5,65,50],
   rooms:[
     {n:'Hotel wing', sub:'guest rooms · not detailed', p:R(-10.7,0.3,0,44), k:'other', at:[-5.35,22], fs:.75},
     {n:'Hall void', sub:'(open to lobby)', p:R(0.2,0.3,11,5.3), k:'void'},
     {n:'Offices · storage', p:R(11,0.3,26.6,5.5), k:'service', at:[15.5,3]},
     {n:'↓ street', p:R(19.9,0.3,21.4,5.6), k:'core', fs:.42, at:[20.65,3], flights:[[0.3,5.6,19.9,21.4,'y']]},
     ...core,
     {n:'Hotel landing', p:R(5.6,5.5,11,11), k:'circ', fs:.7},
     {n:'Corridor', p:R(11,5.5,16.8,8.6), k:'circ', fs:.62},
     {n:'WC', p:R(11.1,12.0,14.1,15.4), k:'wc', fs:.7},
     {n:'WC', p:R(15.6,11.8,18.7,15.4), k:'wc', fs:.7},
     {n:'to WC', p:R(14.7,10.6,18.9,11.8), k:'circ', fs:.4, at:[16.8,11.2]},
     {n:"Salon d'attente", sub:'140 m²', p:attente, k:'circ', at:[21.6,9.2], iso:true},
     {n:'Fixed bar', p:[...arc(23,11.2,3.4,3.6,25,155,10), ...arc(23,11.2,2.6,2.8,155,25,10)], k:'kitchen', at:[23,14.1], fs:.45},
     {n:'Salon 1', sub:'38.7 m²', p:R(26.6,0.3,34.1,5.6), k:'event', at:[27.7,3]},
     {n:'Salon 2', sub:'64.1 m²', p:R(34.2,0.3,46.9,5.6), k:'event', at:[35.3,3]},
     {n:'Salon 3', sub:'≈ 109 m²', p:[[36.6,5.6],[46.9,5.6],[46.9,15.9],[35.2,15.9],[35.2,10.45],[36.6,10.45]], k:'event', at:[41.8,10.7]},
     {n:'Foyer', p:R(27.0,5.6,36.6,9.9), k:'circ', at:[29.9,8.7]},
     {n:'', p:R(27.0,9.9,28.8,14.0), k:'circ'},
     {n:'Stairs', sub:'↓ entrance', p:R(28.8,9.9,35.2,13.5), k:'core', flights:[[35.2,28.8,10.6,13.1]], at:[29.5,11.7], fs:.5},
     {n:'Service', p:R(28.8,13.5,35.2,15.9), k:'service', fs:.6},
     {n:'Projection room', sub:'full width of the hall', p:R(33.6,15.9,36.6,29.5), k:'amphi', fs:.55, iso:true},
     {n:'Tech', p:R(40.2,15.9,44.5,20.7), k:'service', fs:.6},
   ],
   pillars:[[32.5,8.9],[23.9,10.5]],
   doors:[[[27.6,5.6],[28.5,5.6]],[[32.4,5.6],[33.5,5.6]],[[35.5,5.6],[36.5,5.6]],[[36.6,6.8],[36.6,7.7]],[[27.3,9.9],[28.8,9.9]],[[27.0,7.0],[27.0,9.5]],[[16.8,6.5],[16.8,8.5]],[[17.2,11.2],[18.6,11.2]],[[24.4,5.6],[25.4,5.6]]],
   notes:[],
 },
 { id:2, name:'2nd floor', short:'2', sub:'Salon Plaisance',
   plate:[R(19.4,0.3,36.9,15.9), R(5.6,0.3,19.4,10.8), R(10,10.8,18.7,15.4), R(36.9,-2.9,48.7,19.1)], vb:[-1,-4.5,53,24.5],
   rooms:[
     ...core,
     {n:'Corridor', p:R(5.6,7.3,10,11), k:'circ', approx:true, at:[7.8,9.2], fs:.45},
     {n:'', p:R(11,10.8,18.7,11.8), k:'circ', approx:true},
     {n:'Storage?', p:R(16.5,7.8,19.4,10.8), k:'service', approx:true, fs:.45},
     {n:'Not detailed', p:R(0.2,0.3,5.6,5.5), k:'other', fs:.45},
     {n:'WC', p:R(11.1,12,14.1,15.4), k:'wc', approx:true, fs:.6},
     {n:'WC', p:R(15.6,11.8,18.7,15.4), k:'wc', approx:true, fs:.6},
     {n:'Back room', sub:'shorter than sketch', p:R(5.6,0.3,10,7.3), k:'event', approx:true, fs:.5},
     {n:'Entry', p:R(10,0.3,12.5,10.8), k:'event', approx:true, fs:.45, at:[11.25,6]},
     {n:'', p:R(12.5,0.3,16.5,4.3), k:'event', approx:true},
     {n:'Kitchen', p:R(12.5,4.3,16.5,10.8), k:'kitchen', approx:true, fs:.55},
     {n:'', p:R(16.5,0.3,19.4,7.8), k:'event', approx:true},
     {n:'Salon Plaisance', sub:'≈ 15.6 × 17.5 m', p:R(19.4,0.3,36.9,15.9), k:'event', approx:true, at:[28.2,14.8], iso:true},
     {n:'Terrace', sub:'above Salons 1–3', p:R(36.9,-2.9,48.7,19.1), k:'outdoor', at:[44,-1.6], fs:.6},
     {n:'', p:R(40.55,0.8,41.75,7.8), k:'core', approx:true, flights:[[0.8,7.8,40.55,41.75,'y']]},
   ],
   pillars:[[31.9,5.3],[31.9,10.3],[26.9,5.3],[26.9,10.3],[21.9,5.3],[21.9,10.3]],
   dance:R(26.9,5.3,36.9,10.3),
   doors:[[[36.9,7.1],[36.9,9.6]],[[16.5,5],[16.5,6.5]],[[10,1.8],[10,4.3]],[[7,7.3],[8.6,7.3]],[[16.9,11.8],[18.3,11.8]],[[11.8,11.8],[13.4,11.8]]],
   notes:[{t:'entrance', x:11.25, y:9.7, a:'middle'},{t:'↑ balcony', x:41.15, y:8.8, a:'middle'}],
 },
 { id:3, name:'3rd floor', short:'3', sub:'Salon Panoramique',
   plate:[R(19.4,0.3,36.9,15.9), R(16.1,7.8,19.4,15.9), R(36.9,0.3,40.5,15.9), R(0.2,5.5,16.1,10.8), R(11.1,10.8,14.1,15.4), R(13,0.3,19.4,7.8), R(-14.4,5.5,0.2,24), R(0.2,12.3,6.1,20.9), R(-6.7,24,5.3,42.2)], vb:[-16.5,-4.5,66,48.5],
   rooms:[
     ...core,
     {n:'Breakfast room', sub:'not used', p:R(-14.4,5.5,-6.7,17.8), k:'other', fs:.7},
     {n:'Kitchen', p:R(-6.7,2.0,0.2,5.5), k:'kitchen', approx:true, fs:.6},
     {n:'Espace bar', sub:'not used', p:[[-6.7,5.5],[0.2,5.5],[0.2,12.3],[5.6,12.3],[5.6,15.6],[6.1,15.6],[6.1,20.9],[-1.3,20.9],[-1.3,24],[-4.2,24],[-4.2,20.9],[-6.7,20.9]], k:'other', at:[0.6,17.6], fs:.7, iso:true},
     {n:'WC', p:R(-6.7,20.9,-4.2,24), k:'wc', approx:true, fs:.5},
     {n:'Salon La Galerie', sub:'not used', p:R(-6.7,24,5.3,42.2), k:'other', iso:true},
     {n:'Not detailed', p:[[0.2,0.3],[13,0.3],[13,8],[5.6,8],[5.6,5.5],[0.2,5.5]], k:'other', at:[8,3], fs:.5},
     {n:'to WC', p:R(14.1,10.8,16.1,15.9), k:'circ', approx:true, fs:.4},
     {n:'Corridor', p:R(5.6,8,16.1,10.8), k:'circ', approx:true, at:[9,9.4], fs:.6},
     {n:'WC', p:R(11.1,12,14.1,15.4), k:'wc', approx:true, fs:.6},
     {n:'', p:R(11.1,10.8,14.1,12), k:'circ', approx:true},
     {n:'Kitchen', p:R(13,0.3,19.4,7.8), k:'kitchen', approx:true, fs:.6},
     {n:'', p:R(16.1,7.8,19.4,15.9), k:'event', approx:true},
     {n:'Salon Panoramique', sub:'16 × 19 m', p:R(19.4,0.3,36.9,15.9), k:'event', approx:true, at:[20.4,8.6], iso:true},
     {n:'Balcony', sub:'over the terrace', p:R(36.9,0.3,40.5,15.9), k:'outdoor', at:[38.7,2.2], fs:.5},
     {n:'', p:R(40.55,0.8,41.75,7.8), k:'core', approx:true, flights:[[0.8,7.8,40.55,41.75,'y']]},
   ],
   pillars:[[34.3,3.9],[27.9,3.9],[22,3.9]],
   dance:R(22.6,5,33.7,12.2),
   doors:[[[16.1,8.3],[16.1,10.8]],[[19.4,1.8],[19.4,4.2]],[[36.9,7.1],[36.9,9.5]],[[14.1,13],[14.1,14.4]]],
   notes:[{t:'entrance', x:15.6, y:12.2, a:'middle'},{t:'↓ terrace', x:41.15, y:8.8, a:'middle'}],
 },
];

// Screens, stage and seating (architect-plan frame: x = south, y = west)
const SEATS = {0:[], 1:[]}, SCREENS = {0:[], 1:[]}, STAGE = {};
// Grand amphitheater: screen on the north wall, stage in front, 193 seats in 15 rows rising gently to the south
SCREENS[0].push([[12.7,18.7],[12.7,26.7]]);
STAGE[0] = R(12.5,16.4,15.6,29);
for (let i = 0; i < 15; i++) { const n = i === 14 ? 11 : 13, x = 17 + i*0.92, y0 = 22.7 - (n-1)*0.55/2; for (let j = 0; j < n; j++) SEATS[0].push({x, y: y0 + j*0.55, r: true, h: i*0.12}); }
// Salon 3: screen on the west wall, 70 chairs; rows skip the line of the two columns
SCREENS[1].push([[40.1,15.75],[42.1,15.75]]);   // large TV screen, about 2 m wide
[14, 13.1, 12.2, 11.3, 9.7, 8.8, 7.9].forEach(y => { for (let j = 0; j < 10; j++) SEATS[1].push({x: 38 + j*0.6, y}); });
// Salon 1 and Salon 2 (separate rooms): screens on their north walls, 6 chairs per row with an aisle along the doors
SCREENS[1].push([[26.8,1.95],[26.8,3.95]], [[34.4,1.95],[34.4,3.95]]);   // large TV screens
for (let x = 28.4; x <= 33.5; x += 0.9) for (let j = 0; j < 6; j++) SEATS[1].push({x, y: 0.9 + j*0.6});
for (let x = 36.0; x <= 46.05; x += 0.9) for (let j = 0; j < 6; j++) SEATS[1].push({x, y: 0.9 + j*0.6});

// Routes: [x, y, level]
const ROUTES = [
 {id:'amphi', cls:'amphi', title:'Amphitheater', tag:'ground floor', color:'--r-amphi',
  steps:['Come in through the event entrance (glass door on the south side, below Salon 3). The welcome desk is on your right.','Keep left: the hallway leads north, alongside the stairs.','Turn left into the short corridor behind the hall: you enter the amphitheater from the south, below the projection room, facing the stage at the north end.'],
  pts:[[51,14.55,0],[46.9,14.55,0],[37.55,14.55,0],[37.55,18.55,0],[35,18.55,0],[32.6,20.2,0],[31.2,22.7,0]]},
 {id:'salons', cls:'salons', title:'Salons 1–3', tag:'1st floor', color:'--r-salons',
  steps:['From the event entrance, walk past the welcome desk on your right; the stairs up are straight ahead.','You arrive in the foyer. Salons 1, 2 and 3 all open onto it.',"Coffee and the bar are in the salon d'attente next door."],
  pts:[[51,14.55,0],[46.9,14.55,0],[38.5,14.3,0],[36.2,12.4,0],[35.2,11.85,0],[28.8,11.85,1],[28.1,9.4,1],[31.8,7.6,1],[36,7.6,1]]},
 {id:'up', cls:'up', title:'Plaisance or Panoramique', tag:'2nd / 3rd floor', color:'--r-up',
  steps:["From the foyer, walk through the salon d'attente into the hotel corridor.",'Take lifts ASC 1/2 or the main stairs up.','2nd floor: walk south along the corridor to the Plaisance entrance; its wing leads into the room above the salons.','3rd floor: corridor past the toilets to the Panoramique entrance.','The Panoramique balcony has outdoor stairs down to the Plaisance terrace.'],
  pts:[[31.8,7.6,1],[27,8.5,1],[22,7.5,1],[16.8,7.5,1],[11,7.2,1],[8,8.6,1],[3,8.6,1],[3,8.6,3],[3,8.6,2],[3,9.2,2],[18.2,9.2,2],[18.2,14.4,2],[20,14.4,2],[20,11.9,2],[20,2.4,2],[33,2.4,2],[3,9.2,2],[3,9.2,3],[26,9.4,3],[27.4,9.4,3],[34,9.4,3]]},
 {id:'free', cls:'free', title:'Step-free access', tag:'via hotel lobby', color:'--r-free',
  steps:['Use the hotel’s main entrance and lobby, not the event entrance.','Amphitheater: from the hotel entrance, go back outside and follow the street south around the building to the event entrance, then the hallway on the left.','Upper floors: take lifts ASC 1/2 to the floor you need.','For the salons: hotel corridor, salon d’attente, foyer. Check the steps shown in the photo first.'],
  branches:[
    [[5.5,2.8,0],[7.6,6.5,0],[7.6,8.6,0],[3,8.6,0],[3,8.6,1],[8,8.6,1],[11,7.2,1],[16.8,7.5,1],[22,7.5,1],[27,8.5,1]],
    [[5.5,2.8,0],[5.5,-1.6,0],[48.6,-1.6,0],[48.6,14.55,0],[46.9,14.55,0],[37.55,14.55,0],[37.55,18.55,0],[34,18.55,0]],
  ]},
];
// Split the 'up' route into the two branches so lines don't backtrack visually
ROUTES[2].pts = null;
const U = a => Object.assign(a, {unsure:true});
ROUTES[2].branches = [
  [[31.8,7.6,1],[27,8.5,1],[22,7.5,1],[16.8,7.5,1],[11,7.2,1],[8,8.6,1],[3,8.6,1]],
  Object.assign([[3,8.6,1],[3,8.6,3],[12,9.4,3],[16.1,9.5,3],[24,9.5,3]], {room:'pan'}),
  Object.assign([[3,8.6,1],[3,8.6,2],[7.8,9.8,2],[11.25,11.3,2],[11.25,2.3,2],[17,2.3,2],[19.4,4,2],[24,6.5,2]], {room:'pla'}),
];
// The app shows one setup: breaks + sponsors in the Plaisance, Friday sprints in the Panoramique, so both branches stay
ROUTES[2].title = 'Plaisance · Panoramique';
const showBr = () => true;
// Welcome area (ground floor): two 1.2 × 0.6 m tables facing arrivals, T-shirt boxes against the east wall
const DESK = [9.3, 2.1, 1.0];   // round hotel reception desk, south-east corner of the lobby: bagagerie (luggage storage)
const WELCOME = { tables: [[43.2,11.9],[44.6,11.9]], boxes: [[41.15,10.6],[41.8,10.6],[45.6,10.6],[46.25,10.6]] };
// Screens showing the COMPUTE! logo where people arrive: top of the event stairs (1st) and at the main staircase (every upper floor)
const LOGO = { 1: [[[27.05,11],[27.05,13]], [[7.4,5.55],[9.4,5.55]]], 2: [[[8.8,7.35],[9.95,7.35]]], 3: [[[8.4,8.05],[10.4,8.05]]] };   // on the wall people face as they step off the stairs
// Umbrella tables seen on the aerial photo: a row on the balcony (3rd), two loose rows on the terrace (2nd)
const TT = {
  3: [1.6,3.9,6.2,10.4,12.7,14.8].map(y => [38.7,y]),
  2: [-1.5,1.2,3.9,6.6,9.3,12,14.7,17.4].map(y => [42.7,y]).concat([-0.5,3.5,8,12.5,16.5].map(y => [46.6,y])),
};
ROUTES.forEach(r => { if (!r.branches) r.branches = [r.pts]; });

const centroid = p => { let x=0,y=0; p.forEach(q=>{x+=q[0];y+=q[1];}); return [x/p.length,y/p.length]; };

/* ---------- furniture: option C (Plaisance, 2nd floor) + Friday sprints (Panoramique, 3rd floor) ---------- */
const SPONSORS = ['Inria', 'QuantStack', 'CODRA', 'probabl', 'DATAIA', 'PyLadies Paris'];   // booth 1–6
function layout(id) {
  const D = {booths:[], tables:[], chairs:[], ltables:[], wtabs:[], bufs:[]};
  const booth = (x,y,a,n) => D.booths.push({x, y, a, n});
  const stand = (x,y) => D.tables.push([x,y]);
  const lounge = (cx,cy,o) => { D.ltables.push([cx,cy]); for (let k = 0; k < 3; k++) { const a = (o + k*120)*Math.PI/180; D.chairs.push([cx + 1.05*Math.cos(a), cy + 1.05*Math.sin(a), o + k*120]); } };
  const wtable = (cx,cy) => { D.wtabs.push([cx-.6, cy-.3, 1.2, .6]); [-.3,.3].forEach(dx => D.chairs.push([cx+dx, cy+.75, -90, 'w'])); };
  const bigtable = (cx,cy) => { D.wtabs.push([cx-1.2, cy-.6, 2.4, 1.2]); [-.8,0,.8].forEach(dx => D.chairs.push([cx+dx, cy-.95, 0, 'w'], [cx+dx, cy+.95, 180, 'w'])); D.chairs.push([cx-1.55, cy, 90, 'w'], [cx+1.55, cy, -90, 'w']); };
  const bands = (cx,cy) => { D.bufs.push([cx-4, cy-1.35, 8, .75], [cx-3, cy+.6, 6, .75]); };
  const grid = (x0,x1,y0,y1,step,avoid) => { for (let x=x0;x<=x1+1e-6;x+=step) for (let y=y0;y<=y1+1e-6;y+=step) { if ((avoid||[]).some(([px,py,pr])=>Math.hypot(px-x,py-y)<(pr||1.1))) continue; stand(x,y); } };
  if (id === 'C') {
    // Salon Plaisance (x 19.4–36.9 north→south, y 0.3–15.9 east→west):
    // sponsors along the east and west walls (booths 1–3 east, 4–6 west, north to south)
    [22.5,26.5,30.5].forEach((x,i) => booth(x,0.3,0,i+1));
    [22.5,26.5,30.5].forEach((x,i) => booth(x,15.9,180,i+4));
    // buffet in the middle: a closed rectangle of tables, served from all sides
    D.bufs.push([25.6,6.4,5,.75], [25.6,8.45,5,.75], [25.6,7.15,.75,1.3], [29.85,7.15,.75,1.3]);
    // lounge in the south-east corner
    lounge(35.2,2.3,210); lounge(35,5.5,30);
    // four standing tables
    [[22.6,4.2],[22.6,11.6],[33.4,11.6],[33.6,8.6]].forEach(([x,y]) => stand(x,y));
  } else {
    [24,31].forEach(x => [7,12].forEach(y => bigtable(x,y)));
  }
  return D;
}
const LAYOUTS = [{floor:2, D:layout('C')}, {floor:3, D:layout('S')}];
// area labels per floor, shared by the 2D plans and the 3D model: [text, x, y, colour token]
const ZONES = {
  2: [['Sponsors', 24.5, 3.4, '--z-spons'], ['Sponsors', 24.5, 12.8, '--z-spons'], ['Buffet', 28.1, 7.8, '--z-buffet'], ['Lounge', 33.2, 4.3, '--z-relax']],
  3: [['Sprints', 27.5, 9.5, '--z-relax']],
};

// The app leaves out the hotel spaces north of the lifts that the event doesn't use
// (1st-floor hotel wing; 3rd-floor breakfast room, its kitchen, Espace bar and Salon La Galerie)
{ const HIDE = new Set(['Espace bar', 'Salon La Galerie']), north = p => p.every(([x]) => x <= 0.2);
  FLOORS.forEach(f => { f.rooms = f.rooms.filter(r => !HIDE.has(r.n) && !north(r.p)); f.plate = f.plate.filter(p => !north(p)); }); }

// The Plaisance, its entry and the two small rooms beside the entry are one open space: draw only its outer walls
{ const f = FLOORS[2], parts = f.rooms.filter(r => r.k === 'event' && r.n !== 'Back room');
  f.rooms = f.rooms.filter(r => !parts.includes(r));
  f.rooms.push({n:'Salon Plaisance', sub:'≈ 15.6 × 17.5 m + entry', k:'event', approx:true, at:[28.2,14.8], iso:true,
    p:[[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,4.3],[12.5,4.3],[12.5,10.8],[10,10.8]]}); }

// 1st floor: drop the unusable offices strip over the street stairs, and the projection room
// and the tech room next to it (the two-storey amphitheater keeps that side as its outer wall),
// and the dead-end service strip between the event stairs and the amphitheater
FLOORS[1].rooms = FLOORS[1].rooms.filter(r => r.n !== 'Offices · storage' && r.n !== 'Projection room' && r.n !== 'Tech'
  && !(r.n === 'Service' && r.p[0][0] === 28.8));
// 2nd floor: the room next to the lifts is an unattended cloakroom (vestiaire) for coats and bags
{ const s = FLOORS[2].rooms.find(r => r.n === 'Back room'); if (s) Object.assign(s, {n: 'Cloakroom · bags', sub: 'unattended', iso: true}); }

// Three steps down in the middle of the 1st-floor corridor from the lifts to the salon d'attente.
// Everything south of them (corridor end, salon d'attente, foyer, Salons 1–3) sits lower by their total rise.
const STEPS = [{floor: 1, x0: 13.45, x1: 14.35, y0: 5.5, y1: 8.6, n: 3, rise: .17}];   // treads descend towards +x (south)
const DROP = STEPS[0].n * STEPS[0].rise;
const DZ = (f, x) => f === 1 && x > (STEPS[0].x0 + STEPS[0].x1) / 2 ? -DROP : 0;   // height offset of a point on a floor
{ const f = FLOORS[1], i = f.rooms.findIndex(r => r.n === 'Corridor');
  f.rooms.splice(i, 1, {n:'Corridor', p:R(11,5.5,13.45,8.6), k:'circ', fs:.62}, {n:'', p:R(14.35,5.5,16.8,8.6), k:'circ'});
  // rooms on the lift side keep the floor level; the rest of the floor is lower
  f.rooms.forEach(r => { r.dz = r.n === 'Corridor' || Math.max(...r.p.map(p => p[0])) <= 11.05 ? 0 : -DROP; }); }
// a ramp is available over them for step-free access
ROUTES[3].steps[3] = 'For the salons: hotel corridor, salon d’attente, foyer. A ramp is available for the three steps in the corridor from the lifts.';

// Room names as used at the event (labels in the 3D view)
{ const name = (f, n, label, at) => { const r = FLOORS[f].rooms.find(r => r.n === n); if (r) Object.assign(r, {iso: true, isoLabel: label}, at ? {isoAt: at} : {}); };
  name(0, 'Grand amphitheater', 'Track 1 · Amphitheater');
  name(1, 'Salon 1', 'BoF room · Salon 1', [30.35, 2.95]);
  name(1, 'Salon 2', 'Track 3 · Salon 2', [40.5, 2.95]);
  name(1, 'Salon 3', 'Track 2 · Salon 3', [41.8, 10.7]); }

// Terrace and balcony: a few ordinary round tables (the model's umbrella rows were placeholders from the aerial photo)
TT[3] = TT[3].filter((_, i) => i % 2 === 0);                        // balcony: 3 tables
TT[2] = [[42.7,0], [42.7,6], [42.7,12], [46.6,3], [46.6,9], [46.6,15]];   // terrace: 6 tables in two loose rows

// 2nd floor: the label sits in the open south-east part of the Plaisance, away from the furniture
{ const p = FLOORS[2].rooms.find(r => r.n === 'Salon Plaisance'); if (p) Object.assign(p, {isoAt: [20.6, 8], at: [20.6, 8], sub: ''}); }
{ const s = FLOORS[2].rooms.find(r => r.n === 'Storage?'); if (s) s.n = ''; }

// The fixed bar in the salon d'attente is a counter, not a room
{ const b = FLOORS[1].rooms.find(r => r.n === 'Fixed bar'); if (b) b.counter = 1.1; }   // counter height in m

// "Where is…?": places people look for. rooms = room names (n) on that floor to highlight;
// how = how to get there from anywhere in the building; route = a single-floor route to draw.
const PLACES = [
  {id:'amphi',   cam:'west', short:'Track 1', name:'Track 1 · Amphitheater', floor:0, rooms:['Grand amphitheater'], how:'Ground floor. From the event entrance on the south side, keep left along the hallway; the door is in the short corridor behind it.'},
  {id:'track2',  short:'Track 2', name:'Track 2 · Salon 3',      floor:1, rooms:['Salon 3'], how:'1st floor. From the event entrance, take the stairs straight ahead up to the foyer. From the lifts or main stairs, go through the salon d’attente.'},
  {id:'track3',  short:'Track 3', name:'Track 3 · Salon 2',      floor:1, rooms:['Salon 2'], how:'1st floor, next to Salon 1. Same way as Track 2: up the event stairs to the foyer, or through the salon d’attente from the lifts.'},
  {id:'bof',     short:'BoF room', name:'BoF room · Salon 1',     floor:1, rooms:['Salon 1'], how:'1st floor, the first room on the right in the foyer at the top of the event stairs.'},
  {id:'coffee', short:'☕ Coffee', name:'☕ Coffee', floor:2, rooms:[], area:R(25.3,6.1,30.9,9.5), how:'2nd floor, at the buffet in the middle of the Salon Plaisance, during every break. Take the lifts or the main stairs.'},
  {id:'plaisance', short:'Sponsors & food', name:'Sponsors, buffet & breaks', floor:2, rooms:['Salon Plaisance'], how:'2nd floor, Salon Plaisance. Take the lifts or the main stairs, then follow the corridor to the entrance. The terrace is just outside.'},
  {id:'sprints', short:'Sprints', name:'Sprints · Salon Panoramique', floor:3, rooms:['Salon Panoramique'], how:'3rd floor, Friday only. Take the lifts or the main stairs, then the corridor past the toilets to the entrance.'},
  {id:'welcome', cam:'west', short:'Welcome', name:'Welcome desk',           floor:0, rooms:['Welcome'], how:'Ground floor, just inside the event entrance on the south side of the building.'},
  {id:'cloak',   short:'Cloakroom', name:'Cloakroom · bags',       floor:2, rooms:['Cloakroom · bags'], how:'2nd floor, next to the lifts. Although it’s in a safe location, it is not attended, so keep valuables with you.'},
  {id:'terrace', short:'Terrace', name:'Terrace',             floor:2, rooms:['Terrace'], how:'2nd floor, outside the Salon Plaisance, on top of the salons. Outdoor stairs lead up to the Panoramique balcony.'},
  {id:'wc',      short:'Toilets', name:'Toilets',                floor:1, all:true, kind:'wc', rooms:[], how:'There are toilets on every floor; the plans show the ones next to the main staircase.'},
  {id:'lifts', cam:'northeast',   short:'Lifts', name:'Lifts & main stairs',    floor:1, all:true, rooms:['ASC 1','ASC 2','Main staircase'], how:'In the hotel’s core, by the hotel lobby. They connect all floors.'},
  {id:'lobby', cam:'northeast', short:'Lobby · luggage', name:'Hotel lobby · luggage', floor:0, rooms:['Hotel lobby'], how:'Ground floor, through the hotel’s main entrance on the north side. The reception there keeps luggage; the lifts are right behind it.'},
];
// How each floor connects to the others, shown under its plan
const ACCESS = {
  0: 'Event entrance on the south side, hotel entrance and lifts on the north side. The event stairs lead up to the 1st-floor foyer.',
  1: 'Event stairs down to the entrance. Lifts and main stairs to all floors. Three steps between the lifts and the salons, with a ramp for step-free access.',
  2: 'Lifts and main stairs to all floors. Outdoor stairs from the terrace up to the Panoramique balcony.',
  3: 'Lifts and main stairs to all floors. Outdoor stairs from the balcony down to the Plaisance terrace.',
};

// The small stairs from the salon d'attente down to the street are not used by the event
FLOORS[0].rooms = FLOORS[0].rooms.filter(r => r.n !== '↑ 1st');
FLOORS[1].rooms = FLOORS[1].rooms.filter(r => r.n !== '↓ street');
FLOORS[0].doors = FLOORS[0].doors.filter(([a, b]) => !(a[0] === 19.9 && b[0] === 21.4));
FLOORS[0].notes = FLOORS[0].notes.filter(n => n.t !== 'street door');
// Only the screens in the salons and the amphitheater are shown, not the COMPUTE! signage screens
for (const k in LOGO) delete LOGO[k];

// The lift lobby is simply labelled "Lifts" on the plans
FLOORS.forEach(f => f.rooms.forEach(r => { if (r.n === 'Lift lobby') r.n = 'Lifts'; }));

/* ---------- corrections from the site visit (November) ---------- */
// The one lift for the event is near the main staircase, directly next to the three steps in the 1st-floor corridor.
// The lifts in the core (ASC 1/2) are for hotel guests and only open into the main lobby.
const MAIN_LIFT = [13.15, 9.4];   // centre, plan coordinates
FLOORS.forEach(f => {
  f.rooms.forEach(r => {
    if (r.n === 'Lifts') r.n = 'Hotel lifts';   // the landing in front of ASC 1/2
    if (r.n === 'ASC 2') { r.isoLabel = 'Hotel lifts'; r.iso = true; }
  });
  f.rooms.push({n:'Lift', p:R(12.4,8.6,13.9,10.2), k:'core', fs:.42, iso:true});
});

// Welcome desk: in the hotel's main lobby, inside the main entrance (east side), no longer at the south event entrance
WELCOME.tables = [[9.2,10.3],[10.4,10.3]];
WELCOME.boxes = [[7.6,10.3],[8.2,10.3]];
WELCOME.at = [9.6, 9.3];   // label position
{ const g = FLOORS[0];
  const w = g.rooms.find(r => r.n === 'Welcome'); if (w) Object.assign(w, {n:'', k:'circ', iso:false});
  g.notes = g.notes.map(n => n.t === 'HOTEL ENTRANCE' ? {...n, t:'MAIN ENTRANCE'} : n).filter(n => n.t !== 'EVENT ENTRANCE');
  g.doors = g.doors.filter(([a, b]) => !(a[0] === 46.9 && b[0] === 46.9));   // the south event entrance is not used
}

// Plaisance floor: the two toilets and the corridor in front of them stay where the plan has them (west of the
// entry wing); the kitchen sits in the inner corner; the lift is carved out of the wing
{ const f = FLOORS[2];
  const p = f.rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,10.8],[13.9,10.8],[13.9,8.6],[12.4,8.6],[12.4,10.8],[11,10.8],[11,11.1],[10,11.1]];
  f.rooms = f.rooms.filter(r => !(r.k === 'service' && r.p[0][0] === 16.5 && r.p[0][1] === 7.8));   // the corner block becomes the kitchen
  const k = f.rooms.find(r => r.n === 'Kitchen'); if (k) k.p = R(16.5,7.8,19.4,10.8);
  f.doors = f.doors.filter(([a, b]) => !(a[0] === 16.5 && b[0] === 16.5));   // old kitchen door
  f.notes = f.notes.map(n => n.t === 'entrance' ? {...n, y: 3.2} : n); }

// Amphitheater, as on the architect's 1st-floor plan ("vide sur salle de conférences", 163 m², projection room on its
// east side): about 11 × 16 m at the south-west. Entrance on the east wall, where the corridor from the entrance hallway
// ends; stage and screen on the west wall; 193 seats in 12 rows rising towards the east.
{ const g = FLOORS[0];
  g.rooms = g.rooms.filter(r => !(r.k === 'amphi' && r.low));   // old space under the projection room
  const a = g.rooms.find(r => r.n === 'Grand amphitheater');
  Object.assign(a, {p: R(34.8,21.4,46.1,37.4), sub: '≈ 11 × 16 m'}); delete a.at;
  g.plate = g.plate.filter(p => !(p[0][0] === 12.5 && p[0][1] === 15.9)).concat([R(34.8,21.4,46.1,37.4)]);
  g.pillars = [];
  g.doors = g.doors.filter(([p, q]) => !(p[0] === 36.5 && q[0] === 36.5)).concat([[[36.6,21.4],[38.5,21.4]]]);
  SCREENS[0] = [[[37.3,37.2],[43.6,37.2]]];
  STAGE[0] = R(35.3,34.6,45.6,37.2);
  SEATS[0] = [];
  for (let i = 0; i < 12; i++) { const n = i === 11 ? 6 : 17, y = 33.6 - i*0.92, x0 = 40.45 - (n-1)*0.55/2;
    for (let j = 0; j < n; j++) SEATS[0].push({x: x0 + j*0.55, y, r: true, h: i*0.12}); }
  g.notes = g.notes.filter(n => n.t !== 'under the projection room').map(n => n.t === 'stage' ? {...n, x: 40.45, y: 35.9} : n);
}

// Texts that depended on the old entrance and lifts
ACCESS[0] = 'Main entrance with the welcome desk on the east side, in the hotel lobby. The main lift and main stairs lead to all floors. The amphitheater is reached from the 1st floor, down the event stairs.';
ACCESS[1] = 'Event stairs down to the ground floor. The main lift and main stairs to all floors. Three steps between the lift and the salons, with a ramp for step-free access.';
ACCESS[2] = 'The main lift and main stairs to all floors. Outdoor stairs from the terrace up to the Panoramique balcony.';
ACCESS[3] = 'The main lift and main stairs to all floors. Outdoor stairs from the balcony down to the Plaisance terrace.';
{ const P = id => PLACES.find(p => p.id === id);
  Object.assign(P('amphi'), {how: 'Ground floor, south-west. From the lobby, go up to the 1st floor, through the salon d’attente to the foyer, then take the event stairs down; the corridor at the bottom leads to the amphitheater’s east entrance. For step-free access, please contact us.'});
  Object.assign(P('welcome'), {cam: 'northeast', rooms: [], area: R(7.2,9.4,11.4,11.1), how: 'Ground floor, in the hotel’s main lobby, right next to the main staircase, between the stairs and the lift.'});
  Object.assign(P('lobby'), {how: 'Ground floor, through the main entrance on the east side. The welcome desk is here, and the reception keeps luggage.'});
  Object.assign(P('lifts'), {short: 'Lift', name: 'Lift & main stairs', rooms: ['Lift', 'Main staircase'], how: 'The lift is next to the main staircase and serves every floor. The lifts in the main lobby are for hotel guests only.'}); }

// The event uses the main lift (the lobby lifts are for hotel guests)
PLACES.forEach(p => { p.how = p.how.replace('Take the lifts or the main stairs', 'Take the lift or the main stairs').replace('Take the lifts or the main stairs', 'Take the lift or the main stairs'); });
{ const P = id => PLACES.find(p => p.id === id);
  P('track2').how = '1st floor. From the lobby, take the main stairs or the lift up, then go through the salon d’attente to the foyer; Salon 3 opens onto it.';
  P('track3').how = '1st floor, next to Salon 1. From the lobby, take the main stairs or the lift up, then go through the salon d’attente to the foyer.';
  P('bof').how = '1st floor, on the foyer: from the lobby, take the main stairs or the lift up and go through the salon d’attente.';
  P('cloak').how = '2nd floor, near the main staircase and the lift. Although it’s in a safe location, it is not attended, so keep valuables with you.'; }

// Plaisance floor: the cloakroom continues behind the hotel lifts (the area that was "not detailed")
{ const f = FLOORS[2];
  f.rooms = f.rooms.filter(r => !(r.n === 'Not detailed' && r.p[0][0] === 0.2 && r.p[0][1] === 0.3));
  const c = f.rooms.find(r => /^Cloakroom/.test(r.n));
  if (c) Object.assign(c, {p: [[0.2,0.3],[10,0.3],[10,7.3],[5.6,7.3],[5.6,5.5],[0.2,5.5]], at: [5.2,3], isoAt: [5.2,3]}); }
// The lift is by the three steps in the 1st-floor corridor
PLACES.find(p => p.id === 'lifts').how = 'The lift is near the main staircase; on the 1st floor it opens right next to the three steps in the corridor. It serves every floor. The lifts in the main lobby are for hotel guests only.';

// Projection room ("cabine de projection", 31 m² on the architect's plan): on the 1st floor, above the
// amphitheater's east end, looking west over the seats to the screen
FLOORS[1].rooms.push({n:'Projection room', p:R(34.8,16.4,41.6,21.4), k:'amphi', fs:.5, iso:true, dz:-DROP});

// Ground floor: no toilets shown (the two "WC?" were guesses)
FLOORS[0].rooms = FLOORS[0].rooms.filter(r => r.k !== 'wc');

// Ground floor: the main lobby reaches the main lift (south of the welcome desk)
{ const l = FLOORS[0].rooms.find(r => r.n === 'Hotel lobby');
  if (l) l.p = [[0.2,0.3],[12.4,0.3],[12.4,11.1],[5.6,11.1],[5.6,5.5],[0.2,5.5]]; }

// Main lift at its position on the architect's 1st-floor plan (the crossed square at the south-east corner of the
// main staircase). On the 1st floor the corridor is widened up to it, so it opens right by the three steps.
{ const LIFT = R(11.45,10.4,13.45,11.75);
  MAIN_LIFT[0] = 12.45; MAIN_LIFT[1] = 11.075;
  FLOORS.forEach(f => f.rooms.filter(r => r.n === 'Lift').forEach(r => r.p = LIFT));
  const f1 = FLOORS[1];
  f1.rooms.filter(r => r.k === 'circ' && r.p[0][1] === 5.5 && (r.p[0][0] === 11 || r.p[0][0] === 14.35)).forEach(r => { r.p = R(r.p[0][0], 5.5, r.p[1][0], 10.4); });
  STEPS[0].y1 = 10.4;
  const l = FLOORS[0].rooms.find(r => r.n === 'Hotel lobby');
  if (l) l.p = [[0.2,0.3],[11.45,0.3],[11.45,11.1],[5.6,11.1],[5.6,5.5],[0.2,5.5]];   // reaches the lift
  const p = FLOORS[2].rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,10.8],[13.45,10.8],[13.45,10.4],[11.45,10.4],[11.45,10.8],[11,10.8],[11,11.1],[10,11.1]]; }

// Measured on the architect's 1st-floor plan (40 px per metre at 300 dpi): the main stair hall (22.58 m²) runs from
// y 9.5 to the west wall, with the open area in front of the flights at its east end; the lift sits against its
// south wall there (x 11.5–13.5, y 10.4–11.9). The model's staircase box started 1.6 m too far west.
{ const hall = FLOORS[0].rooms.find(r => r.n === 'Main staircase');   // shared by every floor
  hall.p = R(5.6,9.5,11.1,15.6); hall.at = [8.3, 15]; hall.isoAt = [8.3, 13.3];
  FLOORS.forEach(f => f.rooms.filter(r => r.n === 'Lift').forEach(r => r.p = R(11.45,10.4,13.45,11.9)));
  MAIN_LIFT[0] = 12.45; MAIN_LIFT[1] = 11.15;
  const cut = (f, test, y1) => FLOORS[f].rooms.filter(test).forEach(r => { const [a, , c] = r.p; r.p = R(a[0], a[1], c[0], y1); });
  cut(1, r => r.n === 'Hotel landing', 9.5);
  cut(2, r => r.n === 'Corridor' && r.p[0][0] === 5.6, 9.5);
  cut(3, r => r.n === 'Corridor' && r.p[0][0] === 5.6, 9.5);
  // ground floor: the lobby runs along the stair hall up to the lift; the welcome desk faces the foot of the stairs
  const l = FLOORS[0].rooms.find(r => r.n === 'Hotel lobby');
  if (l) l.p = [[0.2,0.3],[11.45,0.3],[11.45,11.9],[11.1,11.9],[11.1,9.5],[5.6,9.5],[5.6,5.5],[0.2,5.5]];
  WELCOME.tables = [[8.9,9.0],[10.1,9.0]]; WELCOME.boxes = [[6.4,8.9],[7.0,8.9]]; WELCOME.at = [9.5, 8.2];
  PLACES.find(p => p.id === 'welcome').area = R(6.2,7.9,11.4,9.5);
  // Plaisance floor: the entry wing's wall meets the stair hall
  const p = FLOORS[2].rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,10.8],[13.45,10.8],[13.45,10.4],[11.45,10.4],[11.45,10.8],[11.1,10.8],[11.1,9.5],[10,9.5]]; }

// Amphitheater, from the site visit: 13 seats per row, 14 full rows and an unfinished last row (193 seats) rising
// from the stage (west) to the entrance (east). The projection room (≈31 m²) overhangs the whole east end on the
// 1st floor, carried by two columns; the last rows sit beneath it.
{ SEATS[0] = [];
  for (let i = 0; i < 15; i++) { const n = i === 14 ? 11 : 13, y = 33.8 - i*0.85, x0 = 40.45 - (n-1)*0.55/2;
    for (let j = 0; j < n; j++) SEATS[0].push({x: x0 + j*0.55, y, r: true, h: i*0.12}); }
  const OVER = 24.1;   // west edge of the overhang, between two rows
  FLOORS[0].pillars = [[38.6, OVER], [42.3, OVER]];
  FLOORS[1].rooms = FLOORS[1].rooms.filter(r => r.n !== 'Projection room');
  FLOORS[1].rooms.push({n:'Projection room', p:R(34.8,21.4,46.1,OVER), k:'amphi', fs:.5, iso:true, dz:-DROP}); }

// The welcome desk label sits on the desk itself
WELCOME.at = [9.5, 9.0];

// 1st floor: keep only the toilets right by the lift (as on the architect's plan); the second block and its
// passage from the salon d'attente are dropped
{ const f = FLOORS[1];
  f.rooms = f.rooms.filter(r => !(r.k === 'wc' && r.p[0][0] === 15.6) && r.n !== 'to WC');
  f.doors = f.doors.filter(([a, b]) => !(a[1] === 11.2 && b[1] === 11.2)); }

// Plaisance entry, back to the earlier model (which matched the hotel's sketch) with only the kitchen moved into
// the inner corner: the wing's south side opens onto the corridor that leads from the main stairs and the lift to the
// toilets; the entrance door is in that wall, just past the lift.
{ const f = FLOORS[2];
  const p = f.rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,10.4],[11.1,10.4],[11.1,9.5],[10,9.5]];
  const k = f.rooms.find(r => r.n === 'Kitchen'); if (k) k.p = R(16.5,7.8,19.4,10.4);
  const c = f.rooms.find(r => r.k === 'circ' && r.p[0][1] === 10.8 && r.p[0][0] === 11);
  if (c) c.p = [[11.1,10.4],[16.5,10.4],[16.5,10.8],[18.7,10.8],[18.7,11.8],[11.1,11.8]];
  f.doors = f.doors.concat([[[13.8,10.4],[15.8,10.4]]]);
  f.notes = f.notes.map(n => n.t === 'entrance' ? {...n, x: 14.8, y: 9.8} : n); }

// 2D treads of the main staircase, matching the 3D flights: up on the north side beside the welcome desk, landing at
// the west end, back on the south side to arrive above the desk
FLOORS[0].rooms.find(r => r.n === 'Main staircase').flights = [[9.5,14,6,8.2,'y'],[14,9.5,8.4,10.6,'y']];

// Welcome desk label in the lobby just east of the desk, clear of the staircase
WELCOME.at = [9.5, 7.4];

// Amphitheater, longer to the east: its east end (with the projection room above) is right next to Salon 3 on the
// 1st floor. Stage and screen on the west wall; rows rise towards the east entrance; the projection room (≈31 m²)
// overhangs the east end on two columns, above the last row.
{ const g = FLOORS[0], AMPHI = R(34.8,16.0,46.1,33.5), OVER = 18.74;
  const a = g.rooms.find(r => r.n === 'Grand amphitheater'); a.p = AMPHI; a.sub = '≈ 11 × 17.5 m';
  g.rooms = g.rooms.filter(r => !(r.k === 'circ' && r.p[0][0] === 36.5 && r.p[0][1] === 15.9));   // corridor now inside the room
  g.plate = g.plate.filter(p => !(p[0][0] === 34.8 && p[0][1] === 21.4)).concat([AMPHI]);
  g.doors = g.doors.filter(([p, q]) => !(p[1] === 21.4 && q[1] === 21.4)).concat([[[36.6,16.0],[38.5,16.0]]]);
  SCREENS[0] = [[[37.3,33.3],[43.6,33.3]]];
  STAGE[0] = R(35.3,30.9,45.6,33.3);
  SEATS[0] = [];
  for (let i = 0; i < 15; i++) { const n = i === 14 ? 11 : 13, y = 30.1 - i*0.85, x0 = 40.45 - (n-1)*0.55/2;
    for (let j = 0; j < n; j++) SEATS[0].push({x: x0 + j*0.55, y, r: true, h: i*0.12}); }
  g.pillars = [[38.6, OVER], [42.3, OVER]];
  g.notes = g.notes.map(n => n.t === 'stage' ? {...n, y: 32.1} : n);
  const pr = FLOORS[1].rooms.find(r => r.n === 'Projection room'); pr.p = R(34.8,16.0,46.1,OVER); }

// No columns drawn in the amphitheater
FLOORS[0].pillars = [];

// Welcome desk: one table only (the other stood right before the stairs), boxes beside it, label below (south of) it
WELCOME.tables = [[10.1, 9.0]];
WELCOME.boxes = [[9.3,7.9],[9.9,7.9]];
WELCOME.at = [11.15, 9.0];
PLACES.find(p => p.id === 'welcome').area = R(9.2,7.8,11.4,9.5);

// Plaisance outline as on the hotel's sketch (Plan Salon Plaisance): the main room, then the entry wing about 7.5 m
// wide next to it, narrowing to about 4 m, and a 2.5 m entry strip at its north end. The notch beside the narrow part
// is not part of the room: the kitchen sits in its corner next to the step, the toilets below it by the entry strip.
// The entrance opens from the main-staircase landing; the stair hall and the lift are cut out of the strip.
{ const f = FLOORS[2];
  const p = f.rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,4.3],[12.5,4.3],[12.5,10.4],[11.45,10.4],[11.45,10.8],[11.1,10.8],[11.1,9.5],[10,9.5]];
  const k = f.rooms.find(r => r.n === 'Kitchen'); if (k) k.p = R(14.5,4.3,16.5,10.8);
  f.rooms = f.rooms.filter(r => !(r.k === 'wc' && r.p[0][0] === 12.5));
  f.rooms.push({n:'WC', p:R(12.5,4.3,14.5,10.4), k:'wc', fs:.55});
  if (!f.rooms.some(r => r.n === 'Storage?' || (r.k === 'service' && r.p[0][0] === 16.5 && r.p[0][1] === 7.8)))
    f.rooms.push({n:'', p:R(16.5,7.8,19.4,10.8), k:'service', approx:true});
  const c = f.rooms.find(r => r.k === 'circ' && Array.isArray(r.p) && r.p[0][0] === 11.1 && r.p[0][1] === 10.4);
  if (c) c.p = R(11.1,10.8,18.7,11.8);
  f.doors = f.doors.filter(([a, b]) => !(a[1] === 10.4 && b[1] === 10.4)).concat([[[10.05,9.5],[11.05,9.5]]]);
  f.notes = f.notes.map(n => n.t === 'entrance' ? {...n, x: 10.6, y: 8.8} : n); }
WELCOME.boxes = [];   // the welcome desk is a single table, no T-shirt boxes

// Plaisance floor: only the toilets in the entry wing; drop the two blocks copied from the floor below and their
// corridor and doors
{ const f = FLOORS[2];
  f.rooms = f.rooms.filter(r => !(r.k === 'wc' && (r.p[0][0] === 11.1 || r.p[0][0] === 15.6)) && !(r.k === 'circ' && r.p[0][0] === 11.1 && r.p[0][1] === 10.8));
  f.doors = f.doors.filter(([a, b]) => !(a[1] === 11.8 && b[1] === 11.8)); }

// Compute! desk (welcome desk): two 1.2 × 0.6 m tables side by side, east of the stair hall
WELCOME.tables = [[10.1, 8.4], [10.1, 9.0]];
WELCOME.label = 'Compute! desk';
WELCOME.at = [11.15, 8.7];
PLACES.find(p => p.id === 'welcome').area = R(9.3,7.9,11.4,9.4);

// 3rd floor: no toilets shown for now (location to be confirmed)
FLOORS[3].rooms = FLOORS[3].rooms.filter(r => r.k !== 'wc');
FLOORS[3].doors = FLOORS[3].doors.filter(([a, b]) => !(a[1] === 14.1 && b[1] === 14.1));

// Compute! desk: the two tables joined on their short sides into one 2.4 m line, closing the gap between the stair
// hall and the lift (north–south), with about 0.8 m behind it (west) for the people at the desk
WELCOME.tables = [[9.6, 8.4], [10.8, 8.4]];
WELCOME.at = [10.2, 8.4];
PLACES.find(p => p.id === 'welcome').area = R(8.9,7.9,11.45,9.5);

// Kitchens are not needed on the map: drop the kitchen rooms (the bar counter stays); the Plaisance and Panoramique
// keep their own walls
FLOORS.forEach(f => { f.rooms = f.rooms.filter(r => r.k !== 'kitchen' || r.counter); });

// Ground floor: the lobby extends south past the lift, so the lift is entered from the east
{ const l = FLOORS[0].rooms.find(r => r.n === 'Hotel lobby');
  if (l) l.p = [[0.2,0.3],[13.6,0.3],[13.6,10.4],[11.1,10.4],[11.1,9.5],[5.6,9.5],[5.6,5.5],[0.2,5.5]]; }

// The lift always opens to the east, onto the hallway in front of it; no stray floor patches around it.
// 2nd floor: the entry strip reaches the lift's east face (toilets move one step south), and the grey block behind the
// notch goes. 3rd floor: a short hallway links the lift to the corridor; the old passages to the toilets go.
{ const f2 = FLOORS[2];
  const p = f2.rooms.find(r => r.n === 'Salon Plaisance');
  if (p) p.p = [[10,0.3],[36.9,0.3],[36.9,15.9],[19.4,15.9],[19.4,7.8],[16.5,7.8],[16.5,4.3],[13.45,4.3],[13.45,10.4],[11.45,10.4],[11.45,10.8],[11.1,10.8],[11.1,9.5],[10,9.5]];
  const wc = f2.rooms.find(r => r.k === 'wc'); if (wc) wc.p = R(13.45,4.3,15.45,10.4);
  f2.rooms = f2.rooms.filter(r => !(r.k === 'service' && r.p[0][0] === 16.5 && r.p[0][1] === 7.8));
  const f3 = FLOORS[3];
  f3.rooms = f3.rooms.filter(r => r.n !== 'to WC' && !(r.k === 'circ' && r.p[0][0] === 11.1 && r.p[0][1] === 10.8));
  f3.rooms.push({n:'', p:R(11.45,9.5,13.45,10.4), k:'circ'}); }

// 1st floor: the architect's plan does show two toilet blocks side by side south of the lift (15.94 m² with three
// WCs, and 8.36 m² with three WCs and basins, reached through a small passage from the salon d'attente): restore both
{ const f = FLOORS[1];
  if (!f.rooms.some(r => r.k === 'wc' && r.p[0][0] === 15.6)) f.rooms.push({n:'WC', p:R(15.6,11.8,18.7,15.4), k:'wc', fs:.7});
  if (!f.rooms.some(r => r.n === 'to WC')) f.rooms.push({n:'to WC', p:R(14.7,10.6,18.9,11.8), k:'circ', fs:.4, at:[16.8,11.2]});
  f.doors.push([[17.2,11.2],[18.6,11.2]]); }

// 3rd floor: the area above the cloakroom has no use for the event
FLOORS[3].rooms = FLOORS[3].rooms.filter(r => r.n !== 'Not detailed');

// 2nd floor: the main stairs arrive on the south half of the stair hall's east edge (x 8.4–10.6). Move the wall
// between the corridor and the Plaisance/cloakroom from x 10 to 10.6 so the arriving flight lands fully in the corridor;
// the Plaisance entrance is in that wall, right by the stairs.
{ const f = FLOORS[2], W = 10.6;
  const move = r => { r.p = r.p.map(([x, y]) => [x === 10 ? W : x, y]); };
  f.rooms.filter(r => r.n === 'Salon Plaisance' || /^Cloakroom/.test(r.n)).forEach(move);
  const c = f.rooms.find(r => r.n === 'Corridor' && r.p[0][0] === 5.6); if (c) c.p = R(5.6,7.3,W,9.5);
  f.doors = f.doors.filter(([a, b]) => !(a[1] === 9.5 && b[1] === 9.5)).map(([a, b]) => a[0] === 10 && b[0] === 10 ? [[W, a[1]], [W, b[1]]] : [a, b]);
  f.doors.push([[W,7.9],[W,9.3]]);
  f.notes = f.notes.map(n => n.t === 'entrance' ? {...n, x: 11.3, y: 8.6} : n); }

// 1st floor: the restored second toilet block and its passage are on the lower side of the three steps, like the
// salon d'attente next to them
FLOORS[1].rooms.filter(r => (r.k === 'wc' && r.p[0][0] === 15.6) || r.n === 'to WC').forEach(r => r.dz = -DROP);
