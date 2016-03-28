/* Variables -------------------------------------------------------
    C, // luminosity factor
    D, // half visible nb. of cells
    H, // half width of canvas
    I, // direction vector x-coordinate
    J, // direction vector y-coordinate
    N, // size of terrain
    P, // function that draws a cell
    T, // passing time
    X, // x-position on terrain
    Y, // y-position on terrain
    Z, // terrain array
*/

// Demo code -------------------------------------------------------
Z=[];
H=(a.width=a.height=innerHeight)/2; // Slightly adapted to allow iframe-based embedding
N=149;

P=function(w,h,t,u,r){                                                          // Function that draws a block (with height >= 0)
    w*=H/(2*D+1);
    x=H+(i-j)*H/(2*D+1);                                                        // cell coordinates > absolute coordinates...
    y=H*3/2+(i+j-k-k)*H/(2*D+1)/2;                                              // ... = isometric projection
    c.fillStyle='hsl('+t*20+','+99*!r+'%,'+Math.floor(99*Math.pow(u/10,1/C))+'%)'; // HSL color scheme saved my day ! lightness management a bit hard to explain here
    c.beginPath();
    c.moveTo(x+w,y);
    c.lineTo(x,y+w/2);
    c.lineTo(x-w,y);
    c.lineTo(x-w,(y-=h*H/(2*D+1)));
    c.lineTo(x,y-w/2);
    c.lineTo(x+w,y);
    c.fill()
};

D=74;
for(j=-D;j<=D;j++)
    for(i=-D;i<=D;i++)                                                          // For all cells in terrain array
        (Z[j+D]=Z[j+D]||[])[i+D]=[-9,C=I=1];                                    // Initialize array cell [altitude, stack size, first stack element, second stack element, ...]

D=17;
for(T=J=m=0;m++<6e2;){                                                          // Repeat n times (with n in fact depending from N to have correct land/water proportion)
    X=Math.floor(N*Math.random());Y=Math.floor(N*Math.random());                // Get a random position
    for(j=-D;j<=D;j++)
        for(i=-D;i<=D;i++){                                                     // For each cell "not too far" from random position
            p=Z[(X+i*J-j*I+N)%N][(Y-i*I-j*J+N)%N];                              // Get corresponding array cell
            p[0]+=5*Math.exp(-(i*i+j*j)/25)                                     // Increase altitude of this cell with "bell" function factor
        }
}

// This was added to allow control of the demo. It's not part of the official js1k entry
var fn, timer;
document.onclick = function() { timer = timer ? (clearInterval(timer), null) : setInterval(fn, 99) };

(fn = function(w,h,t,u,r){                                                // Bloated signature to please the crusher
    s=Math.sin(T);
    i=j=k=0;P(2*D+1,4*D,10,9);                                                  // Draw sky (always same color, but lightness varying with factor C)
    t=(s>0?D:-D);q=i=J*t*Math.cos(T);r=j=-I*t*Math.cos(T+=1/N);i+j<0&&(k=s*t*3.2,P(2,2,3,9.9,1)); // Draw rising/setting sun/moon. Ephemeris calculation a bit hard to explain here
    for(j=-D;j<=D;j++)
        for(i=-D;i<=D;i++){                                                     // For each visible cell (in an order that solves z-index problem)
            p=Z[(X+i*J-j*I+N)%N][(Y-i*I-j*J+N)%N];                              // Get altitude for current cell (taking orientation into account)
            C=1/20+(p[0]<0&&25*Math.exp(-(q-r-i+j)*(q-r-i+j)))+(t=Math.exp(-(i*i+j*j)/25*2))+(s>0)*s*(2-s)*(1-t); // Lightness depending on hour of day, distance from torch and sun/moon reflection
            (z=Math.floor(p[t=k=0]))>0&&P(1,z,0,1);                             // Draw soil blocks if altitude > 0
            z<0?P(1,(1.4+Math.sin(T*25+(Y-i*I-j*J+N)%N))/6,9-z/3,5):(k=z)?P(1,0,6,3):P(1,0,3,6); // Draw surface (water if altitude < 0, sand if altitude = 0, else grass)
            for(;u=p[t+2];p[1]=++t){                                            // For each user block on current position
                k+=u-1;P(1,1,0,4,1);                                            // Draw dark grey stone block (height=1)
                k++;P(1,0,0,9,1)                                                // Draw light grey surface
            }
            k>15&&P(1,0,0,9,1);                                                 // Draw snow if altitude > 15
            i||j||P(1,0.3,0,5)                                                  // Draw red block at center (you !)
        }
})();                                                                          // Repeat ten times per second (if D not too large...)

onkeydown=function(w,h,t,u,r){                                                  // Bloated signature to please the crusher
    D+=(w.keyCode==34)-(w.keyCode==33);                                         // [PageUp]/[PageDown] decrease/increase visible size
    i=(w.keyCode==39)-(w.keyCode==37);j=(w.keyCode==40)-(w.keyCode==38);        // Arrow keys change current position
    p=Z[X=(X+i*J-j*I+N)%N][Y=(Y-i*I-j*J+N)%N];                                  // Get current cell
    17==w.keyCode&&(t=I,I=-J,J=t);                                              // [Ctrl] rotates +90°
    32==w.keyCode&&p.push(1);                                                   // [Space] adds block
    66==w.keyCode&&p[1]&&p[1+p[1]]++;                                           // [B] lifts top block
    67==w.keyCode&&(p[2]?p.pop():p[0]--)                                        // [C] removes block/digs soil
}
