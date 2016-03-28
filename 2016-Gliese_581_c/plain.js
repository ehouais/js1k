W = a.height;
H = W/2;
D = 200/H;
R = [L = D/2];         // color array
M = [N = 256];         // terrain array
//N        // terrain size => nb. points = 220
//S             // variable pixel column width
B =             // direction 1st derivative
K = 0;          // keyboard state
A = 1.2;          // direction
X = Y = 1E9;
Z = 9;            // altitude
g = [];

onkeydown = onkeyup = function(e) {
    K = e.which == 37 ? e.type[5] ? 2E-4 : 0 : e.which == 39 ? e.type[5] ? -2E-4 : 0 : K;
    //e.preventDefault(); // to make iframe integration easier, not part of the actual js1k entry
};

// Inverse distance weighting --------------------------------------

// compute random set of points
for (
    k = 0;
    k < 350;
    k++
)
    R[k] = [N*Math.random(), N*Math.random()];

// for each terrain intersection, compute the height
for (
    I = 0;
    I < N;
    I++
)
    for (
        M[I] = [J = N+1], n = 0;
        J;
        J--,
        n = m
    ) {
        for (
            s = t = k = 0;
            u = R[k];
            k++
        ) {
            t += w = 1/(
                (i = Math.min(i = Math.abs(I-u[0]), Math.abs(N-i)))*i
                +
                (i = Math.min(i = Math.abs(J-u[1]), Math.abs(N-i)))*i
            );
            s += k&1 && k*w;
        }

        M[I%N][J%N] = [
            m = s/t/12 + (Math.random() < 0.1 && Math.random()), // altitude
            m > 13 ? 24 : m,
            m,
            Math.max(0, m - 5 + 5*Math.cos(I/41)),
            12 - 8*Math.atan(n-m)
        ]
    }

// rendering procedure ----------------------------------------
setInterval(function(e) {
    a.height = a.height; // canvas white reset

    // draw fillrects grouped by color, to minimize number of fillStyle changes
    for (
        k = 0;
        k < 50;
        k++
    )
        for (
            u = R[k],
            c.fillStyle = 'hsl(28,50%,'+k*2+'%)';
            h = u.shift();
        )
            c.fillRect(u.shift(), u.shift(), u.shift(), h+1);

    for (
        k = 0;
        k < W;
        k += S
    ) {
        S = 0|Math.abs(k-H)/40+2;
        P = (k-H)*B*40+H; // roll + pitch simulation

        E = 1/Math.abs(v = H*Math.cos(r = A-k/W)); // approx: atan(x) ~ x for |x| < 0.4
        F = 1/Math.abs(w = H*Math.sin(r));
        I = 0|X;
        J = 0|Y;
        u = M[I%N][J%N];
        x = X-I;
        y = Y-J;
        e = E*(v < 0 ? x : 1-x);
        f = F*(w < 0 ? y : 1-y);

        n = m = W; // screen y coordinate (current, next)
        q = p = u[4]; // color (current, next)

        i = I>>8&3;
        j = u[i]+4 - Z;

        for (
            l = d = 0;
            d < D;
        ) {

            t = u;

            g = e < f ? [ // [x, y, I, J, d, e, f]
                x = v < 0,
                y += e*w,
                x ? I-- : ++I,
                J+1,
                e,
                E,
                f-e
            ] : [ // [y, x, I, J, d, e, f]
                y = w < 0,
                x += f*v,
                I+1,
                y ? J-- : ++J,
                f,
                e-f,
                F
            ];
            i = I>>8&3;

            o = 0;
            u = M[I%N][J%N]; // next cell
            h = g[o++] ? t[i] : u[i];
            h += g[o++]*(M[g[o++]%N][g[o++]%N][i] - h);
            //i == N && (h = 40);
            d += g[o++];
            e = g[o++];
            f = g[o++];

            z = P-(h-Z)/d; // height on screen from perspective calculations

            p = h+l ? p : 7;
            p = 0|p + (d > L && (d - L)*(50 - p)/L);

            z < m && (
                p-q && n-m && R[q].push(n-m, k, n = m, S),
                q = p,
                m = z
            );

            p = u[4];
            l = h;

        }

        R[q].push(n-m, k, n = m, S); // push last rect in pipe
    }

    A += B += K;
    X += Math.cos(r = A-0.5);
    Y += Math.sin(r);
    Z += j/20;

    //fps(+new Date);
}, 33);
