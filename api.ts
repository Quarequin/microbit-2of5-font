
//%block="2of5 font"
//%icon="\uf02a"
//%color="#0749a6"
//%weight=5
namespace font2of5 {

    const pin2of5: Buffer = hex`181412110C0A09060503`;
    //  [0b11000, 0b10100, 0b10010, 0b10001, 0b01100, 0b01010, 0b01001, 0b00110, 0b00101, 0b00011]

    function find2of5number (t: number): number {
        let l = 0, r = 9;
        while (l <= r) {
            const m = l + ((r - l) >>> 1);
            const icmp = t - pin2of5[m];
            if (icmp > 0) r = m - 1;
            else if (icmp < 0) l = m + 1;
            else return m;
        }
        return -1;
    }

    let nb10: Buffer = pins.createBuffer(6)
    function makeb10buf (n: number) {
        for (let i = 0; i < 6; i++) {
            if (!n) break;
            nb10[i] = (n % 10);
            n = Math.idiv(n, 10);
        }
    }

    function drawhere(cond: boolean, x: number, y: number, transpose: boolean, brigth: number) {
        if (cond) {
            brigth = (brigth & 0xff) || -1;
            if (transpose) {
                if (brigth < 0) led.plot(y, x);
                else led.plotBrightness(y, x, brigth);
                return;
            }
            if (brigth < 0)led.plot(x, y);
            else led.plotBrightness(x, y, brigth);
            return;
        }
        if (transpose) {
            led.unplot(y, x);
            return;
        }
        led.unplot(x, y);
    }

    /**
     * write to number in 2of5 code
     * but two param are not existing by two value
     * @param to write 1st 2of5 code
     * @param to write 2nd 2of5 code
     */
    //%blockid=font2of5_write2of5input
    //%block="write 2of5 code ( $a and $b )"
    //%a.min=0 a.max=4 a.defl=1
    //%b.min=0 b.max=4 b.defl=3
    //%group="write code"
    //%weight=1
    export function write2of5(a: number, b: number) {
        a = Math.clamp(0, 4, a);
        b = Math.clamp(0, 4, b);
        if (a === b) return -1;
        let nb = (1 << a) + (1 << b);
        return find2of5number(nb);
    }

    /**
     * write number to show number in 2of5 code to current screen
     * like 1d barcode
     * @param number input
     * @param make 2of5 guard with reference from 6th number digit
     * @param render in transpose mode
     * @param brightness render level
     */
    //%blockid=font2of5_print2of5number
    //%block="show 2of5 number $n with guard? $guard|| transpose $transpose and brigthness $brigth"
    //%n.defl=84210
    //%brigth.min=0 brigth.max=255 //brigth.defl=128
    //%group="show screen"
    //%weight=8
    export function show2of5Number(n: number, guard: boolean, transpose?: boolean, brigth?: number) {
        n = n | 0;
        const neg = (n < 0);
        if (neg) n = -n;
        if (guard) n = n % 1000000;
        else n = n % 100000;
        makeb10buf(n); let gn = 0xA;
        if (guard) gn = nb10[5];
        for (let x = 0, gnt = pin2of5[gn], nt = 0; x < 5; x++, gnt = gnt >>> 1) {
            nt = nb10[4 - x];
            if (gn < 0xA) {
                show2of5SingleNumber(nt, x, !!(gnt & 1) !== neg, transpose, brigth);
                continue;
            }
            show2of5SingleNumber(nt, x, neg, transpose, brigth);
        }
    }

    /**
     * show number in one digit to render to current screen
     * @param single digit number
     * @param col positon index
     * @param 2of5 invert flag
     * @param render in transpose mode
     * @param brightness render level
     */
    //%blockid=font2of5_showin1digit
    //%block="show 2of5 in 1digit $n at $col inverse $inv|| transpose $transpose brigthness $brigth"
    //%n.min=0 n.max=9 n.defl=8
    //%brigth.min=0 brigth.max=255 //brigth.defl=128
    //%col.min=0 col.max=4 col.defl=2
    //%group="show screen"
    //%weight=4
    export function show2of5SingleNumber(n: number, col: number, inv: boolean, transpose?: boolean, brigth?: number) {
        n = n | 0;
        n = n % 10;
        col = Math.clamp(0, 4, col);
        for (let row = 0, nt = pin2of5[n], ntb = 0;  row < 5; row++, nt = nt >>> 1) {
            ntb = nt & 1;
            if (inv) {
                drawhere(!!!ntb, col, row, transpose, brigth);
                continue;
            }
            drawhere(!!ntb, col, row, transpose, brigth);
        }
    }

    export const enum alignment {
        //%block="Left"
        left = -1,
        //%block="Center"
        center = 0,
        //%block="Right"
        right = 1,
    }

    let numbufinfo: Buffer = pins.createBuffer(12);
    let numl1: Buffer = pins.createBuffer(3);
    let numl2: Buffer = pins.createBuffer(3);

    /**
     * render two number values in 2of5 code to current screen
     * @param 1st number value
     * @param 2nd number value
     * @param render alignment as offset
     * @param render in transpose mode
     * @param brightness render level
     */
    //%blockId=font2of5_showdualnumber
    //%block="show ( $a and $b ) at $align|| transpose $transpose brigthness $brigth"
    //%a.min=0 a.max=99 a.defl=26
    //%b.min=0 b.max=99 b.defl=48
    //%brigth.min=0 brigth.max=255 //brigth.defl=128
    // %align.min=-1 align.max=1 align.defl=0
    //%group="show screen"
    //%weight=2
    export function show2of5DualNumber(a: number, b: number, align: alignment, transpose?: boolean, brigth?: number) {
        align = Math.clamp(-1, 1, align);
        a = a | 0; b = b | 0;
        const ang = (a < 0); if (ang) a = -a;
        const bng = (b < 0); if (bng) b = -b;
        numl1[1] = Math.idiv(a, 10) % 10, numl1[2] = a % 10;
        numl2[1] = Math.idiv(b, 10) % 10, numl2[2] = b % 10;
        switch (align) {
            case -1:
                numl1[0] = (Math.idiv(a, 100) % 10);
                numbufinfo[0x0] = numl1[0], numbufinfo[0x4] = +(ang), numbufinfo[0x8] = 0; numbufinfo[0x1] = numl1[1], numbufinfo[0x5] = +(ang), numbufinfo[0x9] = 1; numbufinfo[0x2] = numl1[2], numbufinfo[0x6] = +(ang), numbufinfo[0xa] = 2; numbufinfo[0x3] = numl2[2], numbufinfo[0x7] = +(bng), numbufinfo[0xb] = 4;
            break;
            case 0: default:
                numbufinfo[0x0] = numl1[1], numbufinfo[0x4] = +(ang), numbufinfo[0x8] = 0; numbufinfo[0x1] = numl1[2], numbufinfo[0x5] = +(ang), numbufinfo[0x9] = 1; numbufinfo[0x2] = numl2[1], numbufinfo[0x6] = +(bng), numbufinfo[0xa] = 3; numbufinfo[0x3] = numl2[2], numbufinfo[0x7] = +(bng), numbufinfo[0xb] = 4;
            break;
            case 1:
                numl2[0] = (Math.idiv(b, 100) % 10);
                numbufinfo[0x0] = numl1[2], numbufinfo[0x4] = +(ang), numbufinfo[0x8] = 0; numbufinfo[0x1] = numl2[0], numbufinfo[0x5] = +(bng), numbufinfo[0x9] = 2; numbufinfo[0x2] = numl2[1], numbufinfo[0x6] = +(bng), numbufinfo[0xa] = 3; numbufinfo[0x3] = numl2[2], numbufinfo[0x7] = +(bng), numbufinfo[0xb] = 4;
            break;
        }
        for (let i = 0; i < 4; i++) show2of5SingleNumber(numbufinfo[i], numbufinfo[i + 8], !!numbufinfo[i + 4], transpose, brigth);
    }
}
