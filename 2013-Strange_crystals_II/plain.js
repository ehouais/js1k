/* Variables -------------------------------------------------------
    A, // position of Furbee
    X, // cart position (integer)
    Y, // cart position (float)
    H, // last horizon (farthest calculated layer)
    I, // current x
    J, // current x'
    D, // current section index
    E, // reference y'
    B, // current section type
    F, // reference y"
    Q, // current level of depth (0,1)
    K, // current curvature (-1,0,1)
    U, // current y
    V, // current y'
    P, // current slope
    T, // tunnel data [[x ,x',y ,y', lighting info], [], ...]
    Z, // radius
    W, // relative height of railtrack in current section
    L, // distance to nearest light
    C; // canvas half-width
*/

// Demo code -------------------------------------------------------

b.bgColor = A = X = Y = H = I = J = E = Q = U = V = 0;
T = [l = 1];
C = (a.width = a.height = innerHeight)/2;

// This was added to allow control of the demo. It's not part of the official js1k entry
var fn, timer;
document.onclick = function() { timer = timer ? (clearInterval(timer), null) : setInterval(fn, 35) };

// Generation/rendering routin

(fn = function() {

    // generate new chunk of tunnel ------------------------------------------------

    for (
        i = H;       // loop from last calculated position...
        i < X+1400;  // ...to new horizon (N steps ahead of new position)
        H = ++i      // increment position and update horizon accordingly
    ) {

        // update various indicators at the beginning of each section ------

        (s = i%800) || (
            // current section index
            D = i/800,

            // slope: up (-1) / flat (0) / down (1)
            P = D&1 && -Q+(Q=Math.random()>.5),

            // curvature: left (-1) / straight (0) / right (1)
            K = !P && D && (K+2+(Math.random()>.5))%3-1,

            // type of flat section: tunnel with stulls, room
            B = !P && D>9 && !B && Math.random()>.7,

            // relative height of railtrack in current section (if cave)
            W = 1.8*Math.random()-1
        );

        E += F = (s<160)-(s>639);

        p = T[i%1400] = [
            I += J,  // update x
            J += K,  // update x'
            U += V,  // update y
            V = P*E, // update y'
            !P && Math.exp(-(L = i%400-200)*L/3e3)/1.5, // light from bulb
            i%400,   // light transition indicator
            Math.random() > .95 // light malfunction indicator
        ];

        // generate scene elements --------------------------------------

        if (i%10 == 0) {

            // walls ----------------------------------

            for (
                y = Z = 9.8+B*E/15, // radius
                z = W*B*E/15,
                g = Math.random()/6;
                g < 6.3;
                g += 2/Z
            )
                Math.random() > (P || B ? .4 : Math.cos(g) > .5) && // hidden blocks are not generated
                p.push(
                    1.1*Z*Math.cos(g+11),7+B*16,4-F,Z*Math.cos(g)+2+z,4-F  // another brick in the wall
                );

            // stalactites/stalagmites -----

            for (
                t = 2*Z*Math.random()-Z,   // random position for the stalactite
                w = t*t*Math.random()/6;     // random width
                B*w>.2;          // decrease width until stalactite too thin
            )
                p.push(
                    t,7+B*16,w    ,--y+z,1.1, // add block to stalactite
                    t,7+B*16,w*=.8, -y+z,1.1  // add block to stalagmite
                );

            // railtracks ----------------------------

            i%20 || p.push(
                -2,7+B*16,.5,-7,Z-8-z, // left post
                 2,7+B*16,.5,-7,Z-8-z,  // right post
                0,6,6,-6.8,.8 // sleeper
            );

            // lightbulb -------------------------------

            L || p.push(
                0,7+B*16,.2,Z+z,Z+z-5, // electric cord
                0,7,.6,5,.6            // lightbulb
            );

            // stulls ----------------------------------

            P || B || (             // only on flat tunnel sections
                i%40 || p.push(
                    -6,6,1.5,5,14, // left stull
                     6,6,1.5,5,14  // right stull
                ),
                i%20 || p.push(
                    0,6,17,8,3     // horizontal stull
                )
            )

        }

        i%5 || p.push(
            -2,6,.5,-6.5,.6, // left rail
             2,6,.5,-6.5,.6  // right rail
        );

        p.push(
            3*Math.cos(i/40+5),11,.2,2*Math.cos(i/50),.2 // shiny furbee
        );
    }

    // render back to viewer -------------------------------------------------------

    for (
        q = T[X%1400]; // tunnel data at viewer's position
        d = --i-X;    // loop from horizon to viewer's position
    )
        for (
            p = T[i%1400],
            f = C/(d/10+3),     // perspective factor
            v = g = 0,
            t = C+f*(p[g]-q[g++]-d*q[g++])/3e3, // horizontal shift (pixels) for current layer
            u = C+f*(p[g]-q[g++]-d*q[g++])/3e3, // vertical offset (pixels) for current layer
            x = p[g++]*(l = p[g++] ? g++ && l : p[g++] ? Math.random() > .3 : 1)+Math.exp(-(i-A)*(i-A)/3e3)/4,
            y = d/1700;                         // light coming from horizon (y = d/N/1.7)
            z = f*p[g++], w = p[g++], w && (w != 11 || i == A);
        ) {
            //s = w == 13 && 4*f*Math.cos(X/400+g);
            // set rect color (only if different from previous rect)
            v!=w && (v=w, c.fillStyle = 'hsl(0,0%,'+16*(w&7)*(w&8 || y+x*(w<16))+'%)');
            c.fillRect(t+z-(z=f*p[g++])/2, u-f*p[g++], z, f*p[g++])
        }
    Y += 4+q[2]/3e4; // new cart position (float)
    X = 0|Y;         // new cart position (integer)
    A = 0|Y+5e2-4e2*Math.cos(X/2e3) // new Furbee position
})()
