// Variables declaration ---------------------------------------
var i, x, y, z, r, h, W, H, t, l, p, d, a, c, n, m, v, u,
    s, k, f, w, o, j, q, T, N, A, D, Z, e, g;

// Demo source -------------------------------------------------

W = a.width/2;
H = a.height/2;
// TODO: recursion factor & focal distance depend on W/H

for (
    n = 1, N = [[100, i=0, T=0, 0]];
    z = N[i];
    i++
) {
    // traverse list of parents to compute height, color
    for (
        e = r = l = f = h = m = o = v = 0, p = i;
        l++, p; // while node is not root node
    ) {
        // compute radius and angle relative to parent
        s = N[p][0]; // size
        t = N[p][1] + (k = N[p][2])*1.047;
        if (k) { e = t+Math.asin(r*Math.sin(e-t)/(r = Math.sqrt(r*r+s*s+2*r*s*Math.cos(e-t)))) }
        p = N[p][3]; // parent index

        // if computed height higher than current, update
        (g = [
            0, // flat (sea)
            Math.sqrt(s*s-r*r*.7)*.6, // dome (terrain)
            Math.sqrt(s*s-r*r*.7), // dome (rocks)
            4*s-4*r, // cone (fir trees)
            (Math.abs(r-s*.6)<.2)*(1+Math.cos(e*20)/10) // cylinder (tower with battlements)
        ][f = N[p][9]], g ? g += N[p][10] : 0) > h && (
            h = g, // save new height
            m = f, // save terrain function
            o = e, // save angle
            v = r/s
        )
    }

    // update node
    j = 0;
    z.push(
        r, // absolute radius
        e, // absolute angle
        h, // height
        u = [
            220, // blue (sea)
            99, // medium green (terrain)
            0, // medium grey (rocks)
            98, // dark green (fir trees)
            0 // dark grey (tower)
            // grey (terrain borders)
        ][m],
        (u != 98)*35+25*Math.cos(o)+5*Math.random()
    );

    // if relevant, go down 1 level
    if (l < [7, 8, 9, 9, 9][m]) {
    z.push( // 1 type per level ?
        f = h ? m == 1 && [
            1, // level 2
            1, // level 3
            Math.random() < .05 ? 4 : 1, // level 4: buildings
            1, // level 5
            Math.random() < .07 ? 3 : 1, // level 6: fir trees
            Math.random() < .03 ? 2 : 1, // level 7: rocks
            0, // level 8
            0 // level 9
        ][l-2] : i == 1 ? 1 : 0,
        (f > 1)*h, // base height
        n++, n++, n++, n++, n++, n++, n++
    );
    //Math.random() > .999 && console.log(l,m,h,f);
    n = N.push(
        [z[0]/2.645, z[1]+1/3, j++, i], // radius, orientation, subnode index, parent index (for each subnode)
        [z[0]/2.645, z[1]+1/3, j++, i],
        [z[0]/2.645, z[1]+1/3, j++, i],
        [z[0]/2.645, z[1]+1/3, j++, i],
        [z[0]/2.645, z[1]+1/3, j++, i],
        [z[0]/2.645, z[1]+1/3, j++, i],
        [z[0]/2.645, z[1]+1/3, j++, i]
    );
    }
}

// This was added to allow control of the demo. It's not part of the official js1k entry
var fn, timer, fw = W/35+3;
document.onclick = function() { timer = timer ? (clearInterval(timer), null) : setInterval(fn, 50) };

(fn = function() {
    t = W*.84;

    T += 2e-3;
    A = 1.5*T;
    D = 8+9*(1+Math.cos(T));
    Z = 4.1*(1-Math.cos(T));

    // empty canvas
    c.clearRect(0, 0, 2*W, H*1.3+Z*t/5);

    for (q = [0], i = 1; i && (z = N[q[--i]]); ) {
        r = z[4];
        e = A-z[5];
        s = z[0];
        d = D - Math.cos(e)*r;
        d < 5+s && d > -s && ( // iterate only if visible descendants
            f = t/d,
            w = s*f/.8, // TODO: optimize
            z[11] && (d < 0 || w > fw) ? (
                o = 0|(A+8.5-z[1])*.955,
                // Let's please the crusher
                // (1) and (2) ensure that sea is drawn first - (TODO: do it at generation time)
                z[11] == 1 && (q[i++] = z[11]), // (1)
                q[i++] = z[12+(o+3)%6],
                q[i++] = z[12+(o+4)%6],
                q[i++] = z[12+(o+2)%6],
                z[11] == 1 || (q[i++] = z[11]), // (2)
                q[i++] = z[12+(o+5)%6],
                q[i++] = z[12+(o+1)%6],
                q[i++] = z[12+(o+0)%6]
            ) : (y = H*1.3+Z*f-(h = z[6]*f)) < H+H
                && Math.abs(x = Math.sin(e)*r*f) < W+w && (
                    c.fillStyle = 'hsl('+z[7]+','+(z[7] && 40)+'%,'+Math.max(l = z[8], l+(d-1)*(100-l)/4)+'%)',
                    c.fillRect(
                        W+x-w/2,
                        y + !h*4*Math.cos(r*3+T*50),
                        w,
                        h || Z*f*s/d
                    )
                )
        )
    }
})()
