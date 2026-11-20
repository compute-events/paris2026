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
    [14.8,12.7,10.6].forEach((y,i) => booth(19.4,y,-90,i+1));
    [22.3,24.4,26.5].forEach((x,i) => booth(x,15.9,180,i+4));
    lounge(33,12.9,210); lounge(35.4,14.6,30);
    bands(29.4,7.8);
    // eating on the east side: standing tables along the east wall and around the buffet
    grid(20.5,34.5,1.6,1.6,2.6,[]);
    grid(24,34.4,3.8,9,2.6,[[31.9,5.3],[31.9,10.3],[26.9,5.3],[26.9,10.3],[21.9,5.3],[21.9,10.3],[25.4,7.8,2.3],[27.4,7.8,2.3],[29.4,7.8,2.3],[31.4,7.8,2.3],[33.4,7.8,2.3]]);
    // quiet west side: work tables between the sponsor booths and the lounge
    [28.6,30.6].forEach(x => [12.4,14.4].forEach(y => wtable(x,y)));
  } else {
    [24,31].forEach(x => [7,12].forEach(y => bigtable(x,y)));
  }
  return D;
}
const LAYOUTS = [{floor:2, D:layout('C')}, {floor:3, D:layout('S')}];
// area labels per floor, shared by the 2D plans and the 3D model: [text, x, y, colour token]
const ZONES = {
  2: [['Sponsors', 23.5, 12.9, '--z-spons'], ['Buffet', 29.4, 7.8, '--z-buffet'], ['Work area', 27.3, 13.4, '--z-relax'], ['Lounge', 36.3, 12.4, '--z-relax']],
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
{ const p = FLOORS[2].rooms.find(r => r.n === 'Salon Plaisance'); if (p) Object.assign(p, {isoAt: [35.6, 4.6], at: [35.6, 4.6], sub: ''}); }
{ const s = FLOORS[2].rooms.find(r => r.n === 'Storage?'); if (s) s.n = ''; }

// The fixed bar in the salon d'attente is a counter, not a room
{ const b = FLOORS[1].rooms.find(r => r.n === 'Fixed bar'); if (b) b.counter = 1.1; }   // counter height in m

// "Where is…?": places people look for. rooms = room names (n) on that floor to highlight;
// how = how to get there from anywhere in the building; route = a single-floor route to draw.
const PLACES = [
  {id:'amphi',   short:'Track 1', name:'Track 1 · Amphitheater', floor:0, rooms:['Grand amphitheater'], how:'Ground floor. From the event entrance on the south side, keep left along the hallway; the door is in the short corridor behind it.'},
  {id:'track2',  short:'Track 2', name:'Track 2 · Salon 3',      floor:1, rooms:['Salon 3'], how:'1st floor. From the event entrance, take the stairs straight ahead up to the foyer. From the lifts or main stairs, go through the salon d’attente.'},
  {id:'track3',  short:'Track 3', name:'Track 3 · Salon 2',      floor:1, rooms:['Salon 2'], how:'1st floor, next to Salon 1. Same way as Track 2: up the event stairs to the foyer, or through the salon d’attente from the lifts.'},
  {id:'bof',     short:'BoF room', name:'BoF room · Salon 1',     floor:1, rooms:['Salon 1'], how:'1st floor, the first room on the right in the foyer at the top of the event stairs.'},
  {id:'coffee', short:'☕ Coffee', name:'☕ Coffee', floor:2, rooms:[], area:R(24.8,5.8,34,9.8), how:'2nd floor, at the buffet in the middle of the Salon Plaisance, during every break. Take the lifts or the main stairs.'},
  {id:'plaisance', short:'Sponsors & food', name:'Sponsors, buffet & breaks', floor:2, rooms:['Salon Plaisance'], how:'2nd floor, Salon Plaisance. Take the lifts or the main stairs, then follow the corridor to the entrance. The terrace is just outside.'},
  {id:'sprints', short:'Sprints', name:'Sprints · Salon Panoramique', floor:3, rooms:['Salon Panoramique'], how:'3rd floor, Friday only. Take the lifts or the main stairs, then the corridor past the toilets to the entrance.'},
  {id:'welcome', short:'Welcome', name:'Welcome desk',           floor:0, rooms:['Welcome'], how:'Ground floor, just inside the event entrance on the south side of the building.'},
  {id:'cloak',   short:'Cloakroom', name:'Cloakroom · bags',       floor:2, rooms:['Cloakroom · bags'], how:'2nd floor, next to the lifts. Although it’s in a safe location, it is not attended, so keep valuables with you.'},
  {id:'terrace', short:'Terrace', name:'Terrace',             floor:2, rooms:['Terrace'], how:'2nd floor, outside the Salon Plaisance, on top of the salons. Outdoor stairs lead up to the Panoramique balcony.'},
  {id:'wc',      short:'Toilets', name:'Toilets',                floor:1, all:true, kind:'wc', rooms:[], how:'There are toilets on every floor; the plans show the ones next to the main staircase.'},
  {id:'lifts',   short:'Lifts', name:'Lifts & main stairs',    floor:1, all:true, rooms:['ASC 1','ASC 2','Main staircase'], how:'In the hotel’s core, by the hotel lobby. They connect all floors.'},
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
