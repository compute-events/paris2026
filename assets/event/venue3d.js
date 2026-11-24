// 3D floor plan of the venue (used by venue.js on venue.html). Adapted from the "Compute! Venue Setup" working model:
// one fixed setup (sponsors + breaks in the Plaisance, sprints in the Panoramique), mobile controls.
window.Venue3D = function Venue3D(host, ui) {
  if (!window.THREE || !THREE.OrbitControls) { host.innerHTML = '<div class="msg">The 3D plan could not load.</div>'; return null; }
  let renderer;
  try { renderer = new THREE.WebGLRenderer({antialias:true, alpha:true}); }
  catch (e) { host.innerHTML = '<div class="msg">This browser can’t show 3D graphics (WebGL is off).</div>'; return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  host.appendChild(renderer.domElement);

  const css = n => getComputedStyle(host).getPropertyValue(n).trim() || '#999';
  const col = n => new THREE.Color(css(n));
  const scene = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(38, 1, 0.5, 600);
  const ctl = new THREE.OrbitControls(cam, renderer.domElement);
  ctl.enableDamping = true; ctl.maxPolarAngle = Math.PI*0.49;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8f8c, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.55); sun.position.set(40, 80, -30); scene.add(sun);

  const H = 3.4, gap = 6;                       // wall height, extra space between floors
  const lvlY = id => id * (H + 0.3 + gap);
  const KIND = {event:'--event', circ:'--circ', service:'--service', core:'--core', void:'--void', amphi:'--amphi', outdoor:'--circ', other:'--service', wc:'--wc', kitchen:'--kitchen'};
  const FY = 20;
  const T = (x,y) => [FY - y, x];               // north-up, same as the hotel plans
  const shapeOf = p => new THREE.Shape(p.map(([x,y]) => new THREE.Vector2(...T(x,y))));
  const prism = (p, h) => { const g = new THREE.ExtrudeGeometry(shapeOf(p), {depth:h, bevelEnabled:false}); g.rotateX(Math.PI/2); g.translate(0, h, 0); return g; };
  const lineMat = new THREE.LineBasicMaterial({color: col('--ink2'), transparent:true, opacity:.55});

  function label(text, size=1.6, color='--ink') {
    const c = document.createElement('canvas'), x = c.getContext('2d');
    const font = `700 64px Inter, system-ui, sans-serif`;
    x.font = font; const w = Math.ceil(x.measureText(text).width) + 40;
    c.width = w; c.height = 96; x.font = font;
    x.fillStyle = css('--paper'); x.globalAlpha = .82; x.fillRect(0, 8, w, 80); x.globalAlpha = 1;
    x.fillStyle = css(color); x.textBaseline = 'middle'; x.fillText(text, 20, 50);
    const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({map:t, depthTest:false, transparent:true}));
    const k = size * .8;   // all labels a bit smaller than their nominal size
    s.scale.set(k * w/96, k, 1); s.renderOrder = 10; return s;
  }
  const box = (w,h,d,mat,x,y,z) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat); m.position.set(x,y,z); return m; };

  const tall = [];
  const floors = FLOORS.map(f => {
    const g = new THREE.Group(), floorG = g;
    f.rooms.forEach(r => {
      if (r.flights) return;   // drawn as real steps below
      const g = new THREE.Group(); g.position.y = r.dz || 0; floorG.add(g);
      if (r.k === 'unknown') {
        const e = new THREE.LineSegments(new THREE.EdgesGeometry(prism(r.p, .05)), new THREE.LineDashedMaterial({color: col('--mute'), dashSize:.8, gapSize:.6}));
        e.computeLineDistances(); g.add(e); return;
      }
      if (r.counter) {   // a solid counter: one surface, outlined only where the faces actually turn
        const geo = prism(r.p, r.counter);
        g.add(new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color: col('--kitchen')})), new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), lineMat));
        return;
      }
      const slab = new THREE.Mesh(prism(r.p, .3), new THREE.MeshLambertMaterial({color: col(KIND[r.k] || '--circ'), transparent: r.k==='outdoor' || r.k==='void', opacity: r.k==='outdoor' ? .5 : r.k==='void' ? .35 : 1}));
      slab.position.y = r.k === 'core' ? -.29 : -.3; g.add(slab);
      if (['event','amphi','core','wc','kitchen'].includes(r.k)) {
        const wall = prism(r.p, H);
        const m = new THREE.Mesh(wall, new THREE.MeshLambertMaterial({color: col(r.k==='amphi' ? '--r-amphi' : r.k==='core' ? '--core-s' : r.k==='wc' ? '--wc-s' : r.k==='kitchen' ? '--kitchen-s' : '--event-s'), transparent:true, opacity: (r.k==='wc' || r.k==='kitchen') ? .35 : .10, depthWrite:false, side:THREE.DoubleSide}));
        const ed = new THREE.LineSegments(new THREE.EdgesGeometry(wall), lineMat);
        g.add(m, ed);
        if (r.k === 'amphi' && f.id === 0 && !r.low) tall.push(m, ed);   // amphitheater: two storeys high
      } else if (r.k !== 'outdoor') {
        g.add(new THREE.LineSegments(new THREE.EdgesGeometry(prism(r.p, .05)), lineMat));
      }
      if ((r.iso || r.k==='wc') && r.n) {
        const [cx,cy] = r.isoAt || r.at || centroid(r.p), small = r.k==='wc';
        const s = label(r.isoLabel || r.n, small ? 1.2 : 1.7, small ? '--wc-s' : '--ink'); const [tx,ty] = T(cx,cy); s.position.set(tx, H + 1.2, ty); g.add(s);
      }
    });
    (f.pillars || []).forEach(([x,y]) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,H,12), new THREE.MeshLambertMaterial({color: col('--ink2')})); const [tx,ty] = T(x,y); m.position.set(tx, H/2 + DZ(f.id, x), ty); g.add(m); });
    const seats = SEATS[f.id] || [];
    [seats.filter(c => c.r), seats.filter(c => !c.r)].forEach((list, gi) => {
      if (!list.length) return;
      const im = new THREE.InstancedMesh(new THREE.BoxGeometry(.45,.8,.45), new THREE.MeshLambertMaterial({color: col(gi === 0 ? '--r-amphi' : '--ink2')}), list.length), d = new THREE.Object3D();
      list.forEach((c,i) => { const [tx,ty] = T(c.x,c.y); d.position.set(tx, .4 + (c.h || 0) + DZ(f.id, c.x), ty); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
      g.add(im);
    });
    (SCREENS[f.id] || []).forEach(([a,b]) => { const [ax,ay] = T(...a), [bx,by] = T(...b); g.add(box(Math.max(Math.abs(bx-ax),.12), f.id === 0 ? 2.2 : 1.15, Math.max(Math.abs(by-ay),.12), new THREE.MeshBasicMaterial({color: 0x1b211e}), (ax+bx)/2, (f.id === 0 ? 3.2 : 1.6) + DZ(f.id, (a[0]+b[0])/2), (ay+by)/2)); });
    if (STAGE[f.id]) g.add(new THREE.Mesh(prism(STAGE[f.id], .6), new THREE.MeshLambertMaterial({color: col('--paper')})));
    if (f.id === 0) {
      const [tx,ty] = T(DESK[0], DESK[1]); const m = new THREE.Mesh(new THREE.CylinderGeometry(DESK[2], DESK[2], 1.1, 32, 1, true), new THREE.MeshLambertMaterial({color: col('--paper'), side: THREE.DoubleSide})); m.position.set(tx, .55, ty); g.add(m);
      const s = label('Reception · luggage', 1.1, '--ink2'); s.position.set(tx, 2.2, ty); g.add(s);
      WELCOME.tables.forEach(([x,y]) => { const [wx,wy] = T(x,y); g.add(box(.6,.75,1.2, new THREE.MeshLambertMaterial({color: 0xa0703f}), wx,.375,wy)); });   // wood
      WELCOME.boxes.forEach(([x,y]) => { const [bx,by] = T(x + .3, y + .2); for (let k = 0; k < 2; k++) g.add(box(.4,.38,.6, new THREE.MeshLambertMaterial({color: col('--kitchen')}), bx, .2 + k*.4, by)); });
      const w = label(WELCOME.label || 'Welcome desk', 1.6, '--z-spons'); const [lx,ly] = T(...WELCOME.at); w.position.set(lx, 1.4, ly); w.renderOrder = 12; g.add(w);   // tag right on the desk
    }
    (LOGO[f.id] || []).forEach(([a,b]) => {
      const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
      x.fillStyle = '#14181a'; x.fillRect(0,0,512,256); x.fillStyle = '#ffffff'; x.font = '800 92px "Space Grotesk", system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('COMPUTE!', 256, 132);
      const [ax,ay] = T(...a), [bx,by] = T(...b);
      g.add(box(Math.max(Math.abs(bx-ax),.06), 1.0, Math.max(Math.abs(by-ay),.06), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(c)}), (ax+bx)/2, 1.8 + DZ(f.id, (a[0]+b[0])/2), (ay+by)/2));
    });
    (TT[f.id] || []).forEach(([x,y]) => {   // large round banquet tables (about 1.7 m across) on the terrace and balcony
      const [tx,ty] = T(x,y);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(.85,.85,.05,32), new THREE.MeshLambertMaterial({color: col('--paper')})); t.position.set(tx,.74,ty);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(.08,.25,.72,12), new THREE.MeshLambertMaterial({color: col('--ink2')})); p.position.set(tx,.36,ty);
      g.add(t, p);
    });
    if (f.id === 3) {   // glass railing around the balcony
      const glass = new THREE.MeshLambertMaterial({color: col('--core'), transparent:true, opacity:.35, depthWrite:false});
      [[[40.5,0.3],[40.5,15.9]], [[36.9,0.3],[40.5,0.3]], [[36.9,15.9],[40.5,15.9]]].forEach(([a,b]) => { const [ax,ay] = T(...a), [bx,by] = T(...b); g.add(box(Math.max(Math.abs(bx-ax),.05), 1, Math.max(Math.abs(by-ay),.05), glass, (ax+bx)/2, .5, (ay+by)/2)); });
    }
    const tag = label(`${f.name} · ${f.sub}`, 2.0, '--ink2'); const [gx,gy] = T(30,-9); tag.position.set(gx, 1.5, gy); g.add(tag);
    g.position.y = lvlY(f.id);
    scene.add(g); return g;
  });
  tall.forEach(o => o.scale.y = (lvlY(1) - lvlY(0) - DROP + H) / H);   // up to the ceiling of the (lowered) south part of the 1st floor

  // furniture for the one setup the app shows
  const M = n => new THREE.MeshLambertMaterial({color: col(n)});
  const mT = M('--paper'), mS = M('--z-spons'), mB = M('--z-buffet'), mR = M('--z-relax'), mI = M('--ink2');
  const ang = a => -(a + 90) * Math.PI / 180;
  LAYOUTS.forEach(({floor, D}) => {
    const g = floors[floor];
    const put = (geo, mat, x, y, h, rot) => { const m = new THREE.Mesh(geo, mat); const [tx,ty] = T(x,y); m.position.set(tx, h, ty); if (rot !== undefined) m.rotation.y = rot; g.add(m); };
    const bl = (b, lx, ly) => { const a = b.a * Math.PI / 180; return [b.x + lx*Math.cos(a) - ly*Math.sin(a), b.y + lx*Math.sin(a) + ly*Math.cos(a)]; };
    D.booths.forEach(b => {
      put(new THREE.BoxGeometry(1.2,.75,.7), mT, ...bl(b,0,.73), .375, ang(b.a)); put(new THREE.BoxGeometry(.85,2,.05), mS, ...bl(b,0,.15), 1, ang(b.a));
    });
    D.tables.forEach(([x,y]) => { put(new THREE.CylinderGeometry(.4,.4,.05,16), mI, x, y, 1.1); put(new THREE.CylinderGeometry(.04,.04,1.1,6), mI, x, y, .55); });   // standing tables: dark top
    D.ltables.forEach(([x,y]) => put(new THREE.CylinderGeometry(.45,.45,.4,16), mT, x, y, .2));
    D.chairs.forEach(([x,y,a,w]) => w ? put(new THREE.BoxGeometry(.44,.9,.44), mI, x, y, .45) : put(new THREE.BoxGeometry(.74,.6,.74), mR, x, y, .3, ang(a)));
    D.wtabs.forEach(([x,y,w,h]) => put(new THREE.BoxGeometry(h,.75,w), mT, x + w/2, y + h/2, .375));
    D.bufs.forEach(([x,y,w,h]) => put(new THREE.BoxGeometry(h,.9,w), mB, x + w/2, y + h/2, .45));
    const zl = (t, x, y, c) => { const s = label(t, 1.4, c); const [tx,ty] = T(x,y); s.position.set(tx, 4.2, ty); g.add(s); };
    (ZONES[floor] || []).forEach(([t, x, y, c]) => zl(t, x, y, c));
  });

  // routes (tubes) and the stairs between floors
  const tubes = [];
  ROUTES.forEach(r => r.branches.filter(showBr).forEach(br => {
    const V = br.map(q => { const [x,y] = T(q[0],q[1]); return new THREE.Vector3(x, lvlY(q[2]) + .5 + DZ(q[2], q[0]), y); });
    const path = new THREE.CurvePath(); let cur = V[0];
    for (let i = 1; i < V.length - 1; i++) {   // round each corner with a short curve
      const p = V[i-1], c = V[i], n = V[i+1], l1 = c.distanceTo(p), l2 = n.distanceTo(c);
      if (!l1 || !l2) continue;
      const a = c.clone().lerp(p, Math.min(1.2, l1/2)/l1), b = c.clone().lerp(n, Math.min(1.2, l2/2)/l2);
      if (cur.distanceTo(a) > 1e-3) path.add(new THREE.LineCurve3(cur, a));
      path.add(new THREE.QuadraticBezierCurve3(a, c, b)); cur = b;
    }
    path.add(new THREE.LineCurve3(cur, V[V.length-1]));
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(path, br.length*32, .14, 8, false), new THREE.MeshBasicMaterial({color: col(r.color), transparent:true, opacity:1}));
    mesh.userData.r = r.id; mesh.userData.u = !!br.unsure; mesh.userData.fl = [...new Set(br.map(q => q[2]))]; mesh.renderOrder = 5; scene.add(mesh); tubes.push(mesh);
  }));
  const coreMat = new THREE.MeshLambertMaterial({color: col('--core')}), edge = new THREE.LineBasicMaterial({color: col('--core-s')});
  // stairs and lift shafts between two floors: one group per pair, shown only while both floors are shown
  const links = [];
  const link = (a, b) => { const g = new THREE.Group(); g.userData.fl = [a, b]; scene.add(g); links.push(g); return g; };
  let stairs = null;   // the group the next steps go into
  const step = (xa, xb, ya, yb, top, th) => { const [ua,va] = T(xa,ya), [ub,vb] = T(xb,yb); const geo = new THREE.BoxGeometry(Math.abs(ub-ua), th, Math.abs(vb-va)); const m = new THREE.Mesh(geo, coreMat); m.position.set((ua+ub)/2, top - th/2, (va+vb)/2); const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge); e.position.copy(m.position); stairs.add(m, e); };
  for (let z = 0; z < 3; z++) {   // lift shaft
    const [x,y] = T(...MAIN_LIFT);
    link(z, z + 1).add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(x,lvlY(z),y), new THREE.Vector3(x,lvlY(z+1),y)), 4, .12, 6, false), new THREE.MeshBasicMaterial({color: col('--core-s'), transparent:true, opacity:.6})));
  }
  { const n = 12;   // main staircase: two flights per storey with a landing
    for (let z = 0; z < 3; z++) { const base = lvlY(z), rise = lvlY(z+1) - lvlY(z); stairs = link(z, z + 1);
      // flights start and end at y0, where the landings of the floors end (10.8–11.1 m), so they meet the floor
      const y0 = 9.5, run = 14 - y0;   // flights start and end at the stair hall's edge (y 9.5), where the floors meet it
      for (let i = 0; i < n; i++) step(6, 8.2, y0 + run*i/n, y0 + run*(i+1)/n, base + rise/2*(i+1)/n, rise/2/n);   // up from beside the welcome desk
      step(6, 10.6, 14, 15.3, base + rise/2, .15);
      for (let i = 0; i < n; i++) step(8.4, 10.6, 14 - run*(i+1)/n, 14 - run*i/n, base + rise/2 + rise/2*(i+1)/n, rise/2/n);   // arrives above the welcome desk
    }
  }
  { const rise = lvlY(1) - lvlY(0) - DROP, n = 24; stairs = link(0, 1);   // event stairs, ground → 1st (lower part of the floor)
    for (let i = 0; i < n; i++) step(35.2 - 6.4*(i+1)/n, 35.2 - 6.4*i/n, 10.6, 13.1, rise*(i+1)/n, rise/n);
  }

  STEPS.forEach(s => {   // short flights inside a floor, e.g. the 3 steps in the 1st-floor corridor
    const w = (s.x1 - s.x0) / s.n, g = floors[s.floor];
    for (let i = 0; i < s.n; i++) { const [ua,va] = T(s.x0 + i*w, s.y0), [ub,vb] = T(s.x0 + (i+1)*w, s.y1), h = DROP - i * s.rise; const geo = new THREE.BoxGeometry(Math.abs(ub-ua), h, Math.abs(vb-va)); const m = new THREE.Mesh(geo, coreMat); m.position.set((ua+ub)/2, h/2 - DROP, (va+vb)/2); const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge); e.position.copy(m.position); g.add(m, e); }
    if (s.label) { const l = label(s.label, 1.1, '--ink2'); const [lx,ly] = T((s.x0 + s.x1)/2, (s.y0 + s.y1)/2); l.position.set(lx, 2.2, ly); g.add(l); }
  });
  { const rise = lvlY(3) - lvlY(2), base = lvlY(2), n = 16; stairs = link(2, 3);   // outdoor stairs, balcony → terrace
    for (let i = 0; i < n; i++) step(40.55, 41.75, 7.8 - 7*(i+1)/n, 7.8 - 7*i/n, base + rise*(i+1)/n, rise/n);
  }

  /* ---------- state: active route, visible floors, camera ---------- */
  let act = null;
  let shown = new Set(FLOORS.map(f => f.id));   // floors switched on (toggled from the floor buttons)
  function apply() {
    floors.forEach((g, i) => g.visible = shown.has(i));
    links.forEach(g => g.visible = g.userData.fl.every(f => shown.has(f)));   // stairs/lifts between two shown floors
    tubes.forEach(t => {   // a route is only drawn once it is picked in the route list
      t.visible = t.userData.r === act && t.userData.fl.some(f => shown.has(f));
      t.material.opacity = t.userData.u ? .4 : 1;
    });
    dirty = true;
  }
  const VIEWS = {   // camera position + target per floor (null = all floors)
    all: [[75, 70, 95], [8, 9, 22]],
  };
  // per floor: look at the centre of its event rooms (plan x, y) from the same direction as the overview, closer in
  const FOCUS = {0: [38, 20], 1: [36, 8], 2: [22.5, 8], 3: [28, 8]};
  // camera side: default south-east; 'west' (amphitheater, welcome desk) and 'northeast' (lifts, hotel lobby)
  // look past the hotel core instead of through it. In 3D, +x is east and +z is south.
  const SIDE = {west: [-1, 1], northeast: [1, -1]};
  const fv = (i, side, at) => { const [u, v] = T(...(at || FOCUS[i])), y = lvlY(i), [sx, sz] = SIDE[side] || [1, 1]; return [[u + 40*sx, y + 37, v + 44*sz], [u, y, v]]; };
  const fall = side => { const [p, t] = VIEWS.all, [sx, sz] = SIDE[side] || [1, 1]; return [[t[0] + (p[0]-t[0])*sx, p[1], t[2] + (p[2]-t[2])*sz], t]; };   // whole building
  const ZOOM = 0.95 ** 2;   // two mouse-wheel zoom steps closer (OrbitControls zooms by 0.95 per step)
  function view(i, animate = true, side, at) {
    const [raw, t] = i === null ? fall(side) : fv(i, side, at);
    const p = raw.map((v, k) => t[k] + (v - t[k]) * ZOOM);   // every preset view a bit closer than the raw offsets
    if (!animate) { cam.position.set(...p); ctl.target.set(...t); ctl.update(); dirty = true; return; }
    const p0 = cam.position.clone(), t0 = ctl.target.clone(), P = new THREE.Vector3(...p), Tg = new THREE.Vector3(...t), t1 = performance.now();
    (function tween(now) { const k = Math.min(1, (now - t1) / 450), e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2; cam.position.lerpVectors(p0, P, e); ctl.target.lerpVectors(t0, Tg, e); ctl.update(); dirty = true; if (k < 1) requestAnimationFrame(tween); })(t1);
  }
  // narrow screens: hold a fixed horizontal field of view so the building fills the width
  const fit = () => { cam.fov = cam.aspect < 1.2 ? 2 * Math.atan(Math.tan(13 * Math.PI / 180) / cam.aspect) * 180 / Math.PI : 38; cam.updateProjectionMatrix(); };

  let dirty = true, running = false;
  ctl.addEventListener('change', () => dirty = true);
  const size = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); renderer.domElement.style.width = w+'px'; renderer.domElement.style.height = h+'px'; cam.aspect = w / h; fit(); dirty = true; };
  new ResizeObserver(size).observe(host); size();
  view(null, false); apply();
  function loop() { if (!running) return; ctl.update(); if (dirty) { renderer.render(scene, cam); dirty = false; } requestAnimationFrame(loop); }

  // a picked place: its rooms glow gold on their floor
  let glow = [];
  const glowMat = new THREE.MeshBasicMaterial({color: col('--beam-gold'), transparent: true, opacity: .45, depthWrite: false});
  function highlight(p) {
    glow.forEach(m => { m.parent.remove(m); m.geometry.dispose(); }); glow = [];
    if (!p) return;
    (p.all ? FLOORS : [FLOORS[p.floor]]).forEach(f => f.rooms.filter(r => p.rooms.includes(r.n) || (p.kind && r.k === p.kind)).forEach(r => {   // all: on every floor (lifts, toilets)
      const m = new THREE.Mesh(prism(r.p, H + .1), glowMat); m.renderOrder = 4;
      floors[f.id].add(m); glow.push(m);
    }));
    if (p.area) { const m = new THREE.Mesh(prism(p.area, 1.6), glowMat); m.renderOrder = 4; floors[p.floor].add(m); glow.push(m); }   // an area inside a room
  }

  return {
    route(id) { act = id; apply(); },
    place(p) { highlight(p); act = p && p.route || null; apply(); if (p) { shown = new Set(FLOORS.map(f => f.id)); apply(); view(p.all ? null : p.floor, true, p.cam, p.cam && !p.all ? centroid(p.area || FLOORS[p.floor].rooms.find(r => p.rooms.includes(r.n)).p) : null); } },
    floor(i) { shown = new Set(i === null ? FLOORS.map(f => f.id) : [i]); apply(); view(i); },
    show(ids) { shown = new Set(ids); apply(); },   // any set of floors, camera unchanged
    reset() { shown = new Set(FLOORS.map(f => f.id)); act = null; apply(); view(null); },
    start() { if (!running) { running = true; size(); loop(); } },
    stop() { running = false; },
    controls(on) { ctl.enabled = on; },   // off while the page should scroll over the model (touch screens)
  };
};
