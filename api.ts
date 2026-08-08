
//%block="2of5 font"
//%icon="\uf02a"
//%color="#0749a6"
//%weight=5
namespace font2of5 {

    const pin2of5: Buffer = hex`181412110C0A09060503`
    //  [0b11000, 0b10100, 0b10010, 0b10001, 0b01100, 0b01010, 0b00110, 0b00101, 0b00011]

    const makeb10buf = (n: number, l: number): Buffer => {
        let na: Buffer = pins.createBuffer(l);
        for (let i = 0; i < l; i++) {
            if (!n) break;
            na[i] = (n % 10);
            n = Math.idiv(n, 10);
        }
        return na;
    }

    const drawit = (cond: boolean, x: number, y: number, transpos: boolean) => {
        if (cond) {
            if (transpos) led.plot(y, x);
            else led.plot(x, y);
            return;
        }
        if (transpos) led.unplot(y, x);
        else led.unplot(x, y);
    }

    /**
     * write number to show number in 2of5 code to current screen
     * like 1d barcode
     * @param number input
     * @param make 2of5 guard with reference from 6th number digit
     * @param render in transpos mode
     */
    //%blockid=font2of5_print2of5number
    //%block="show 2of5 number $n with guard? $guard|| and transpos $transpos"
    //%n.defl=84210
    //%group="show screen"
    //%weight=8
    export function show2of5Number(n: number, guard: boolean, transpos?: boolean) {
        let neg = (n < 0);
        if (neg) n = -n;
        if (guard) n = n % 1000000;
        else n = n % 100000;
        let nb10: Buffer = makeb10buf(n, guard ? 6 : 5),
        gn = 0xA, nt = 0;
        if (guard) gn = nb10[6];
        let gnt = pin2of5[gn];
        for (let x = 0; x < 5; x++) {
            nt = nb10[nb10.length - x];
            if (gn < 0xA)
                show2of5SingleNumber(nt, !!(gnt & 1) !== neg, x, transpos);
            else
                show2of5SingleNumber(nt, neg, x, transpos);
            gnt = gnt >>> 1;
        }
    }

    /**
     * show number in one digit to render to current screen
     * @param single digit number
     * @param 2of5 invert flag
     * @param col positon index
     * @param render in transpos mode
     */
    //%blockid=font2of5_showin1digit
    //%block="show 2of5 in 1digit $n but invert? $inv at $col||with transpos $transpos"
    //%n.min=0 n.max=9 n.defl=8
    //%col.min=0 col.max=4 col.defl=2
    //%group="show screen"
    //%weight=4
    export function show2of5SingleNumber(n: number, inv: boolean, col: number, transpos?: boolean) {
        n = n % 10;
        col = Math.min(col, 4);
        col = Math.max(col, 0);
        let nt = pin2of5[n], ntb = 0;
        for (let row = 0; row < 5; row++) {
            ntb = nt & 1;
            if (inv)
                drawit(!!!ntb, col, row, transpos);
            else
                drawit(!!ntb, col, row, transpos);
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
     * @param is the 1st number value
     * @param is the 2nd number value
     * @param render alignment as offset
     * @param render in transpos mode
     */
    //%blockId=font2of5_showdualnumber
    //%block="show ( $num1 and $num2 ) at $align|| with transpos $transpos"
    //%num1.min=0 num1.max=99 num1.defl=26
    //%num2.min=0 num2.max=99 num2.defl=48
    //%align.min=-1 align.max=1 align.defl=0
    //%group="show screen"
    //%weight=2
    export function show2of5DualNumber(num1: number, num2: number, align: alignment, transpos?: boolean) {
        align = Math.clamp(-1, 1, align);
        let neg1 = (num1 < 0); if (neg1) num1 = -num1;
        let neg2 = (num2 < 0); if (neg2) num2 = -num2;
        let numl1: Buffer = pins.createBuffer(3); numl1[1] = Math.idiv(num1, 10) % 10, numl1[2] = num1 % 10;
        let numl2: Buffer = pins.createBuffer(3); numl2[1] = Math.idiv(num2, 10) % 10, numl2[2] = num2 % 10;
        switch (align) {
            case -1:
                numl1[0] = (Math.idiv(num1, 100) % 10);
                show2of5SingleNumber(numl1[0], neg1, 0, transpos);
                show2of5SingleNumber(numl1[1], neg1, 1, transpos);
                show2of5SingleNumber(numl1[2], neg1, 2, transpos);
                show2of5SingleNumber(numl2[2], neg2, 4, transpos);
            return;
            case 0: default:
                show2of5SingleNumber(numl1[1], neg1, 0, transpos);
                show2of5SingleNumber(numl1[2], neg1, 1, transpos);
                show2of5SingleNumber(numl2[1], neg2, 3, transpos);
                show2of5SingleNumber(numl2[2], neg2, 4, transpos);
            return;
            case 1:
                numl2[0] = (Math.idiv(num2, 100) % 10);
                show2of5SingleNumber(numl1[2], neg1, 0, transpos);
                show2of5SingleNumber(numl2[0], neg2, 2, transpos);
                show2of5SingleNumber(numl2[1], neg2, 3, transpos);
                show2of5SingleNumber(numl2[2], neg2, 4, transpos);
            return;
        }
    }
}
