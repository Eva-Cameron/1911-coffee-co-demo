// Screen points for world points under Cam(45, .5, S) fitted to a box: node pts.cjs S cx cy "fitpts json" "query pts json"
const [S, cx, cy, fitJ, qJ] = process.argv.slice(2);
const az = Math.PI / 4, k = 0.5, zf = Math.sqrt(1 - k * k), c = Math.cos(az), s = Math.sin(az);
const raw = (x, y, z) => { const X = x * c - y * s, Y = x * s + y * c; return [S * X, S * (Y * k - z * zf)]; };
const f = JSON.parse(fitJ).map((p) => raw(...p));
const ox = cx - (Math.min(...f.map((q) => q[0])) + Math.max(...f.map((q) => q[0]))) / 2;
const oy = cy - (Math.min(...f.map((q) => q[1])) + Math.max(...f.map((q) => q[1]))) / 2;
for (const p of JSON.parse(qJ)) { const q = raw(...p); console.log(p.join(","), "->", Math.round(q[0] + ox) + "," + Math.round(q[1] + oy)); }
