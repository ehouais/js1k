/*
    A : view angle
    B : movement flag
    D : view distance
    E : height correction
    F : current fillStyle
    H : view height
    I : index in nodes lifo
    J : base height of added element
    K : width correction factor for voxels
    L : nodes lifo
    M : characteristics of added element
    N : generation counter
    P : index in table of added elements
    Q : root node
    S : element size
    T : terrain characteristics
    U : new element X coordinate
    V : new element Y coordinate
    X : x offset
    Y : Y offset
    Z : fifo of added elements
*/

D = 1200;
H = 150;
Q = [C = 11, A = B = N = P = 0, 0, 0, 0];
X = a.width/2; // x offset
Y = a.height/1.5; // Y offset
Z = [];

// generation params:
//   0: max radius,
//   1: power,
//   2: ratio,
//   3: luminosity

// rendering procedure ----------------------------------------
setInterval(function(e) {

    // pre-compute useful values
    m = Math.cos(A);
    n = Math.sin(A);
    i = m*D;
    j = n*D;
    K = (5-Math.cos(A*4))/4;
    E = H/2;

    if (
        !B
        && N++ < 200
    ) {
        Z.push(
            200,
            (r = Math.random()*820)*Math.cos(t = Math.random()*44), // 44 ≈ 7*2π
            r*Math.sin(t),
            [4, .1],
            0
        )
    }

    if (
        S = !B
            && N%200
            && Math.random()*Z[P]
    ) {
        P++;
        U = Z[P++];
        V = Z[P++];
        M = Z[P++];
        J = Z[P++];
    } else if (C) {
        // draw canvas background
        a.width = a.width; // cross-browser trick to reset canvas
        c.fillStyle = '#888';
        c.fillRect(F = 0, Y-E, 2*X, Y+E) // ocean
    }

    // quadtree traversal
    for (
        // initialize lifo with root node
        L = [Q],
        I = 1;

        // while there is a node in lifo
        q = C && L[--I];

    ) {
        // node caracteristics
        t = 0; p = q[t++]; x = q[t++]; y = q[t++]; s = q[t++]; h = q[t++]; w = 1<<p;

        if (
            N == 200
            && p == 2
            && h > 10
            && Math.random() < .2
        ) {
            Z.push(
                h < 240 ? 8 : 30,
                x+1,
                y+1,
                [
                    [1, 4, 55], // trees
                    [4, 1, 100], // rocks
                    [80, 2, 90] // building
                ][0|h/120+(h < 18)],
                h
            )
        }

        // are we adding an element ?
        if (S) {
            // is the added element intersecting current node ?
            f = S+w > Math.abs(u = x-U) && S+w > Math.abs(v = y-V);

            if (
                p // if max LOD not reached
                && f // and element intersects current node
                && !q[8] // and node has no children yet
            ) {
                q.push( // then create subnodes
                    0, 0, 0,
                    [p-1, x+w/2, y+w/2, 0, 0],
                    [p-1, x-w/2, y+w/2, 0, 0],
                    [p-1, x-w/2, y-w/2, 0, 0],
                    [p-1, x+w/2, y-w/2, 0, 0]
                )
            }

            if (
                (d = Math.sqrt(u*u+v*v)) < S // center of current node is inside the added element
                && (z = (J || h) + (1-Math.pow(d/S, M[0]))*S*M[1]) > h // new height is greater than previous
            ) {
                // update luminosity
                q[3] = s = M[2] ? 0|M[2]+M[2]*u/(d+1)/9 : z < 16 ? 190 : 80 + 8*(0|z/30),
                // update height
                q[4] = z
            }
        }

        d = D-(m*x+n*y);

        if (
            q[8] // there are child nodes
            && (!S || f) // if we're adding an element, the element intersects the node
            && (S || p > 2*B + d/900) // max LOD is not reached yet (full LOD when adding element or standing still, reduced LOD otherwise)
        ) {
            // determine start quadrant
            t = i < x ^ 3*(j < y);
            // add subnodes in increasing z-index order
            L[I++] = q[8|3&t];
            L[I++] = q[8|3&t+1];
            L[I++] = q[8|3&t+3];
            L[I++] = q[8|3&t+2]
        } else if (
            h > 12
            && !S // not adding element
            && Math.abs(g = m*y-n*x) < d // node is within the view frustrum
        ) {
            h -= 12;
            // set new fill color (only if different from previous: important for FPS !)
            F-s && (F = s, c.fillStyle = 'rgb('+F+','+F+','+F+')'); // parsers don't seem to care about closing parenthesis...

            // draw node
            s = X/d; // perspective factor = width/(d*tan(angle of view frustrum))
            c.fillRect(
                X+s*g-(w *= s*K),
                Y+s*H-(h = s*h)-E,
                w+w+1,
                h+h
            )
        }
    }
    C = S || B;

}, 0)

onkeydown = function(e) {
    B = 1; // change indicator
    H += 8*(e.which == 33) - 8*(e.which == 34)*(H > 20); // height
    A += .01*(e.which == 39) - .01*(e.which == 37); // angle
    D += 8*(e.which == 40) - 8*(e.which == 38) // distance
    e.preventDefault(); // to make iframe integration easier, not part of the actual js1k entry
}

onkeyup = function(e) {
    B = 0 // change indicator
}
