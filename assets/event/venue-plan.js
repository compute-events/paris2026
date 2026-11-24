// 2D floor plans as SVG, drawn from the same data as the 3D model (venue-data.js).
// Light enough for any phone; the 3D view is only loaded on request. Adapted from the
// "Compute! Venue Setup" working model.
window.VenuePlan = (() => {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const f2 = v => v.toFixed(2);
  const ptsStr = p => p.map(q => q.map(f2).join(',')).join(' ');
  const roundD = (pts, r) => {   // SVG path through the points with rounded corners
    let d = `M${f2(pts[0][0])},${f2(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [px,py] = pts[i-1], [cx,cy] = pts[i], [nx,ny] = pts[i+1], l1 = Math.hypot(cx-px, cy-py), l2 = Math.hypot(nx-cx, ny-cy);
      if (!l1 || !l2) continue;
      const k1 = Math.min(r, l1/2)/l1, k2 = Math.min(r, l2/2)/l2;
      d += ` L${f2(cx-(cx-px)*k1)},${f2(cy-(cy-py)*k1)} Q${f2(cx)},${f2(cy)} ${f2(cx+(nx-cx)*k2)},${f2(cy+(ny-cy)*k2)}`;
    }
    const e = pts[pts.length-1]; return d + ` L${f2(e[0])},${f2(e[1])}`;
  };
  const defs = `<defs><pattern id="c26-hatch" width="1" height="1" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="1" height="1" fill="var(--void)"/><line x1="0" y1="0" x2="0" y2="1" stroke="var(--line)" stroke-width=".12"/></pattern></defs>`;

  // furniture of the one setup shown (sponsors, buffet, lounge in the Plaisance; sprint islands in the Panoramique)
  function furniture(fid) {
    const L = LAYOUTS.find(l => l.floor === fid); if (!L) return '';
    const D = L.D; let s = '';
    D.booths.forEach(({x, y, a}) => {   // booths without names: the plan shows where sponsors are, not who is where
      s += `<g transform="translate(${x} ${y}) rotate(${a})"><rect class="booth-fp" x="-1" y="0" width="2" height="1.8"/><rect class="booth-k" x="-.43" y=".08" width=".86" height=".14"/><rect class="booth-t" x="-.6" y=".38" width="1.2" height=".7"/></g>`;
    });
    D.tables.forEach(([x,y]) => s += `<circle class="stand" cx="${x}" cy="${y}" r=".4"/>`);
    D.ltables.forEach(([x,y]) => s += `<circle class="ltable" cx="${x}" cy="${y}" r=".45"/>`);
    D.chairs.forEach(([x,y,a,w]) => s += w ? `<rect class="wchair" x="${f2(x-.22)}" y="${f2(y-.22)}" width=".44" height=".44" rx=".1"/>`
      : `<rect class="lchair" x="${f2(x-.37)}" y="${f2(y-.37)}" width=".74" height=".74" rx=".22" transform="rotate(${a} ${f2(x)} ${f2(y)})"/>`);
    D.wtabs.forEach(([x,y,w,h]) => s += `<rect class="wtab" x="${x}" y="${y}" width="${w}" height="${h}"/>`);
    D.bufs.forEach(([x,y,w,h]) => s += `<rect class="buf" x="${x}" y="${y}" width="${w}" height="${h}"/>`);
    return s;
  }
  // area labels (sponsors, buffet, work area, lounge, sprints), drawn last so they sit on top
  function zones(fid) {
    return (ZONES[fid] || []).map(([t, x, y, c]) => `<text class="zlab" x="${x}" y="${y}" style="fill:var(${c})">${esc(t)}</text>`).join('');
  }

  // f: a floor from FLOORS; active: a route id to draw; hl: room names to highlight (a picked place)
  function svg(f, active, hl = []) {
    // fit the drawing to this floor's rooms (data is in the architect plan's frame, north = left; turned 90° so north is up)
    const all = f.rooms.flatMap(r => r.p);
    const xs = all.map(p => p[0]), ys = all.map(p => p[1]), m = 2.5;
    const ax = Math.min(...xs) - m, ay = Math.min(...ys) - m - 1.5, aw = Math.max(...xs) - ax + m + 2, ah = Math.max(...ys) - ay + m;
    const cx = ax + aw/2, cy = ay + ah/2, vx = cx - ah/2, vy = cy - aw/2, vw = ah, vh = aw;
    const k = Math.min(1, vw / 40);
    let s = `<svg viewBox="${vx} ${vy} ${vw} ${vh}" style="--k:${k}" role="img" aria-label="${esc(f.name)} plan, north up" class="${active ? 'has-active' : ''}">${defs}<g class="flip" transform="rotate(90 ${cx} ${cy})">`;
    s += `<g stroke="var(--line2)" stroke-width=".05">`;   // 5 m grid
    for (let x = Math.ceil(ax/5)*5; x <= ax+aw; x += 5) s += `<line x1="${x}" y1="${ay}" x2="${x}" y2="${ay+ah}"/>`;
    for (let y = Math.ceil(ay/5)*5; y <= ay+ah; y += 5) s += `<line x1="${ax}" y1="${y}" x2="${ax+aw}" y2="${y}"/>`;
    s += `</g>`;
    f.rooms.forEach(r => s += `<polygon class="rm k-${r.k === 'void' ? 'void" style="fill:url(#c26-hatch)' : r.k}${r.approx ? ' approx' : ''}" points="${ptsStr(r.p)}"/>`);
    f.rooms.forEach(r => (r.flights || []).forEach(([xa,xb,ya,yb,axis]) => {
      if (axis === 'y') { for (let i = 0; i <= 20; i++) { const y = xa + (xb-xa)*i/20; s += `<line class="tread" x1="${ya}" y1="${y}" x2="${yb}" y2="${y}"/>`; } return; }
      for (let i = 0; i <= 16; i++) { const x = xa + (xb-xa)*i/16; s += `<line class="tread" x1="${x}" y1="${ya}" x2="${x}" y2="${yb}"/>`; }
    }));
    STEPS.filter(st => st.floor === f.id).forEach(st => { for (let i = 0; i <= st.n; i++) { const x = st.x0 + (st.x1-st.x0)*i/st.n; s += `<line class="steps-t" x1="${x}" y1="${st.y0}" x2="${x}" y2="${st.y1}"/>`; } });
    if (f.dance) s += `<polygon class="dance" points="${ptsStr(f.dance)}"/>`;
    (f.pillars || []).forEach(([x,y]) => s += `<circle class="pillar" cx="${x}" cy="${y}" r=".32"/>`);
    (f.doors || []).forEach(([a,b]) => s += `<line class="door" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
    if (f.id === 0) {
      s += `<circle class="rdesk" cx="${DESK[0]}" cy="${DESK[1]}" r="${DESK[2]}"/><text class="lbl-s" x="${DESK[0]}" y="${DESK[1]+.15}">Reception</text>`;
      WELCOME.tables.forEach(([x,y]) => s += `<rect class="wtab" x="${x-.6}" y="${y-.3}" width="1.2" height=".6"/>`);
      s += `<text class="lbl-s" x="${WELCOME.at[0]}" y="${WELCOME.at[1]}" style="fill:var(--z-spons)">${esc(WELCOME.label || 'Welcome desk')}</text>`;
    }
    (LOGO[f.id] || []).forEach(([a,b]) => s += `<line class="screen logo" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
    (TT[f.id] || []).forEach(([x,y]) => s += `<circle class="ttable" cx="${x}" cy="${y}" r=".85"/>`);
    if (STAGE[f.id]) s += `<polygon class="stage" points="${ptsStr(STAGE[f.id])}"/>`;
    (SEATS[f.id] || []).forEach(c => s += `<rect class="chair${c.r ? ' r' : ''}" x="${f2(c.x-.21)}" y="${f2(c.y-.21)}" width=".42" height=".42" rx=".08"/>`);
    (SCREENS[f.id] || []).forEach(([a,b]) => s += `<line class="screen" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`);
    f.rooms.filter(r => hl.includes(r.n) || hl.includes('kind:' + r.k)).forEach(r => s += `<polygon class="hl" points="${ptsStr(r.p)}"/>`);
    hl.filter(Array.isArray).forEach(p => s += `<polygon class="hl" points="${ptsStr(p)}"/>`);   // an area inside a room
    s += furniture(f.id);
    // only the route picked in the list: a dot where it starts on this floor, an arrow where it ends,
    // and a note where it comes from or continues to another floor
    const fname = z => z === 0 ? 'ground floor' : FLOORS[z].name;
    ROUTES.filter(r => r.id === active).forEach(r => r.branches.forEach(br => {
      let seg = [], from = null;
      const flush = to => {
        if (seg.length > 1) {
          const col = `var(${r.color})`, [a, b] = [seg[seg.length - 2], seg[seg.length - 1]];
          const ang = Math.atan2(b[1] - a[1], b[0] - a[0]), tip = (d, t) => [b[0] + d * Math.cos(ang + t), b[1] + d * Math.sin(ang + t)];
          s += `<path class="route ${r.cls} on${br.unsure ? ' unsure' : ''}" d="${roundD(seg, 1.2)}"/>`;
          s += `<circle cx="${f2(seg[0][0])}" cy="${f2(seg[0][1])}" r=".45" fill="${col}" stroke="#fff" stroke-width=".12"/>`;
          s += `<polygon points="${ptsStr([tip(.35, 0), tip(1, Math.PI - .5), tip(1, Math.PI + .5)])}" fill="${col}"/>`;
          if (from !== null) s += `<text class="lbl-s rnote" x="${f2(seg[0][0] - 2.2)}" y="${f2(seg[0][1])}" style="fill:${col}">from ${esc(fname(from))}</text>`;
          if (to !== undefined) s += `<text class="lbl-s rnote" x="${f2(b[0])}" y="${f2(b[1] + 1.4)}" style="fill:${col}">${to > f.id ? '↑' : '↓'} to ${esc(fname(to))}</text>`;
        }
        seg = [];
      };
      br.forEach((q, i) => {
        if (q[2] === f.id) { if (!seg.length) from = i > 0 ? br[i - 1][2] : null; seg.push([q[0], q[1]]); }
        else if (seg.length) flush(q[2]);
      });
      flush();
    }));
    f.rooms.forEach(r => {
      const name = r.isoLabel || r.n; if (!name || /^ASC /.test(r.n)) return;   // lift shafts: the lobby next to them is labelled "Lifts"
      const [x,y] = r.isoAt || r.at || centroid(r.p), fs = (r.fs || .82) * k;
      s += `<text class="lbl" x="${x}" y="${y}" style="font-size:${fs}px">${esc(name)}</text>`;
      if (r.sub) s += `<text class="lbl-sub" x="${x + fs*1.1}" y="${y}">${esc(r.sub)}</text>`;
    });
    s += zones(f.id);
    (f.notes || []).forEach(n => s += `<text class="side-note" x="${n.x}" y="${n.y}" text-anchor="middle">${esc(n.t)}</text>`);
    s += `</g><text class="side-note" x="${vx+.6}" y="${vy+1.2}">↑ north · ↓ south: the Marne</text>`;
    const sx = vx + 1, sy = vy + vh - 1;   // 10 m scale bar
    s += `<rect x="${sx}" y="${sy-.35}" width="5" height=".35" fill="var(--ink)"/><rect x="${sx+5}" y="${sy-.35}" width="5" height=".35" fill="none" stroke="var(--ink)" stroke-width=".06"/><text class="side-note" x="${sx}" y="${sy-.6}">0</text><text class="side-note" x="${sx+10}" y="${sy-.6}" text-anchor="end">10 m</text>`;
    return s + `</svg>`;
  }
  return { svg };
})();
