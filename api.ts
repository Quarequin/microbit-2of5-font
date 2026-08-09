
//%block="2of5 font"
//%icon="\uf02a"
//%color="#0749a6"
//%weight=5
namespace font2of5 {

    const pin2of5: Buffer = hex`181412110C0A09060503`
    //  [0b11000, 0b10100, 0b10010, 0b10001, 0b01100, 0b01010, 0b01001, 0b00110, 0b00101, 0b00011]

    const find2of5number = (t: number) => {
        const cmp: (a: number, b: number) => number = (a, b) => b - a;
        let l = 0, r = pin2of5.length - 1;
        while (l <= r) {
            const m = l + ((r - l) >>> 1);
            const compare = cmp(pin2of5[m], t)
            if (compare > 0) r = m - 1;
            else if (compare < 0) l = m + 1;
            else return m;
        }
        return -1;
    }

    const makeb10buf = (n: number, l: number): Buffer => {
        let na: Buffer = pins.createBuffer(l);
        for (let i = 0; i < l; i++) {
            if (!n) break;
            na[i] = (n % 10);
            n = Math.idiv(n, 10);
        }
        return na;
    }

    const drawit = (cond: boolean, x: number, y: number, transpose: boolean) => {
        if (cond) {
            if (transpose) led.plot(y, x);
            else led.plot(x, y);
            return;
        }
        if (transpose) led.unplot(y, x);
        else led.unplot(x, y);
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
        //if ((a < 0 || a > 4)
        //|| (b < 0 || b > 4)) return -1;
        let nb = (1 << a) + (1 << b);
        return find2of5number(nb);
    }

    /**
     * write number to show number in 2of5 code to current screen
     * like 1d barcode
     * @param number input
     * @param make 2of5 guard with reference from 6th number digit
     * @param render in transpose mode
     */
    //%blockid=font2of5_print2of5number
    //%block="show 2of5 number $n with guard? $guard|| and transpose $transpose"
    //%n.defl=84210
    //%group="show screen"
    //%weight=8
    export function show2of5Number(n: number, guard: boolean, transpose?: boolean) {
        n = n | 0;
        let neg = (n < 0);
        if (neg) n = -n;
        if (guard) n = n % 1000000;
        else n = n % 100000;
        let nb10: Buffer = makeb10buf(n, guard ? 6 : 5),
        gn = 0xA, nt = 0;
        if (guard) gn = nb10[5];
        let gnt = pin2of5[gn];
        for (let x = 0; x < 5; x++) {
            nt = nb10[4 - x];
            if (gn < 0xA)
                show2of5SingleNumber(nt, !!(gnt & 1) !== neg, x, transpose);
            else
                show2of5SingleNumber(nt, neg, x, transpose);
            gnt = gnt >>> 1;
        }
    }

    /**
     * show number in one digit to render to current screen
     * @param single digit number
     * @param 2of5 invert flag
     * @param col positon index
     * @param render in transpose mode
     */
    //%blockid=font2of5_showin1digit
    //%block="show 2of5 in 1digit $n but invert? $inv at $col||with transpose $transpose"
    //%n.min=0 n.max=9 n.defl=8
    //%col.min=0 col.max=4 col.defl=2
    //%group="show screen"
    //%weight=4
    export function show2of5SingleNumber(n: number, inv: boolean, col: number, transpose?: boolean) {
        n = n | 0;
        n = n % 10;
        col = Math.min(col, 4);
        col = Math.max(col, 0);
        let nt = pin2of5[n], ntb = 0;
        for (let row = 0; row < 5; row++) {
            ntb = nt & 1;
            if (inv)
                drawit(!!!ntb, col, row, transpose);
            else
                drawit(!!ntb, col, row, transpose);
            nt = nt >>> 1;
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

    /**
     * render two number values in 2of5 code to current screen
     * @param 1st number value
     * @param 2nd number value
     * @param render alignment as offset
     * @param render in transpose mode
     */
    //%blockId=font2of5_showdualnumber
    //%block="show ( $a and $b ) at $align|| with transpose $transpose"
    //%a.min=0 a.max=99 a.defl=26
    //%b.min=0 b.max=99 b.defl=48
    //%align.min=-1 align.max=1 align.defl=0
    //%group="show screen"
    //%weight=2
    export function show2of5DualNumber(a: number, b: number, align: alignment, transpose?: boolean) {
        align = Math.clamp(-1, 1, align);
        a = a | 0; b = b | 0;
        let neg1 = (a < 0); if (neg1) a = -a;
        let neg2 = (b < 0); if (neg2) b = -b;
        let numl1: Buffer = pins.createBuffer(3); numl1[1] = Math.idiv(a, 10) % 10, numl1[2] = a % 10;
        let numl2: Buffer = pins.createBuffer(3); numl2[1] = Math.idiv(b, 10) % 10, numl2[2] = b % 10;
        switch (align) {
            case -1:
                numl1[0] = (Math.idiv(a, 100) % 10);
                show2of5SingleNumber(numl1[0], neg1, 0, transpose);
                show2of5SingleNumber(numl1[1], neg1, 1, transpose);
                show2of5SingleNumber(numl1[2], neg1, 2, transpose);
                show2of5SingleNumber(numl2[2], neg2, 4, transpose);
            return;
            case 0: default:
                show2of5SingleNumber(numl1[1], neg1, 0, transpose);
                show2of5SingleNumber(numl1[2], neg1, 1, transpose);
                show2of5SingleNumber(numl2[1], neg2, 3, transpose);
                show2of5SingleNumber(numl2[2], neg2, 4, transpose);
            return;
            case 1:
                numl2[0] = (Math.idiv(b, 100) % 10);
                show2of5SingleNumber(numl1[2], neg1, 0, transpose);
                show2of5SingleNumber(numl2[0], neg2, 2, transpose);
                show2of5SingleNumber(numl2[1], neg2, 3, transpose);
                show2of5SingleNumber(numl2[2], neg2, 4, transpose);
            return;
        }
    }
}
