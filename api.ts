
//%block="2of5 font"
//%icon="\uf02a"
//%color="#0749a6"
//%weight=5
namespace font2of5 {

    let pin2of5: Buffer = hex`181412110C0A09060503`
    //  [0b11000, 0b10100, 0b10010, 0b10001, 0b01100, 0b01010, 0b00110, 0b00101, 0b00011]

    function makeb10buf(n: number, l: number) {
        let na: Buffer = pins.createBuffer(l);
        for (let i = 0; i < l; i++) {
            if (!n) break;
            na[i] = (n % 10);
            n = Math.idiv(n, 10);
        }
        return na;
    }

    function drawit(cond: boolean, x: number, y: number, trans: boolean) {
        if (cond) {
            if (trans) led.plot(y, x);
            else led.plot(x, y);
        } else {
            if (trans) led.unplot(y, x);
            else led.unplot(x, y);
        }
    }

    /**
     * write number to show number in 2of5 code to the screen
     * like 1d barcode
     * @param are the number input to render
     * @param is the guard with place one 2of5 to main 2of5 like invert 2of5 code if true
     * @param as boolean to render in horizontal mode if true
     */
    //%blockid=font2of5_print2of5number
    //%block="show 2of5 number $x with $guard|| in horizontal mode $horizontal"
    //%x.defl=84210
    //%group="show screen"
    //%weight=8
    export function show2of5number(n: number, guard: boolean, horizontal?: boolean) {
        if (guard) n = n % 1000000;
        else n = n % 100000;
        let nb10 = makeb10buf(n, guard ? 6 : 5);
        let gn: number = 0xA;
        if (guard) gn = nb10[6];
        let gnt = pin2of5[gn];
        for (let x = 0; x < 5; x++) {
            let nt = nb10[nb10.length - x];
            if (gn < 0xA)
                show2of5in1d(nt, !!(gnt & 1), x, horizontal);
            else
                show2of5in1d(nt, false, x, horizontal);
            gnt = gnt >> 1;
        }
    }

    /**
     * show number in one digit to render to the screen
     * @param is number to render in one digit
     * @param to get 2of5 invert if true
     * @param to place in position from horizontal if true this pos are placing in x else this pos are placing in y
     * @param to get place in harizontal mode if true
     */
    //%blockid=font2of5_showin1digit
    //%block="show 2of5 in one number $n and get invert? $inv place at $col|| in horizontal? $horizontal"
    //%n.min=0 n.max=9 n.defl=8
    //%col.min=0 col.max=4 col.defl=2
    //%group="show screen"
    //%weight=4
    export function show2of5in1d(n: number, inv: boolean, col: number, horizontal?: boolean) {
        n = n % 10;
        col = Math.min(col, 4);
        col = Math.max(col, 0);
        let nt = pin2of5[n];
        for (let row = 0; row < 5; row++) {
            let ntb = nt & 1;
            if (inv)
                drawit(!!!ntb, col, row, horizontal);
            else
                drawit(!!ntb, col, row, horizontal);
            nt = nt >> 1;
        }
    }

    /**
     * render two number values in 2of5 code to the screen
     * @param is the 1st number value
     * @param is the 2nd number value
     * @param to render in horizontal mode if true
     */
    //%blockid=font2of5_showtwonumbervalues
    //%block="show ( $num1 and $num2 ) at $align|| in horizontal $horizontal"
    //%num1.min=0 num1.max=99 num1.defl=26
    //%num2.min=0 num2.max=99 num2.defl=48
    //%align.min=-1 align.max=1 align.defl=0
    //%group="show screen"
    //%weight=2
    export function showduonum(num1: number = 0, num2: number = 0, align: number, horizontal?: boolean) {
        align = Math.clamp(-1, 1, align);
        let numl1: uint8[] = [Math.idiv(num1, 10) % 10, num1 % 10];
        let numl2: uint8[] = [Math.idiv(num2, 10) % 10, num2 % 10];
        switch (align) {
            case -1:
                numl1.unshift(Math.idiv(num1, 100) % 10);
                numl2.removeAt(0);
                show2of5in1d(numl1[0], false, 0, horizontal);
                show2of5in1d(numl1[1], false, 1, horizontal);
                show2of5in1d(numl1[2], false, 2, horizontal);
                show2of5in1d(numl2[0], false, 4, horizontal);
            return;
            case 0: default:
                show2of5in1d(numl1[0], false, 0, horizontal);
                show2of5in1d(numl1[1], false, 1, horizontal);
                show2of5in1d(numl2[0], false, 3, horizontal);
                show2of5in1d(numl2[1], false, 4, horizontal);
            return;
            case 1:
                numl2.unshift(Math.idiv(num2, 100) % 10);
                numl1.removeAt(0);
                show2of5in1d(numl1[0], false, 0, horizontal);
                show2of5in1d(numl2[0], false, 2, horizontal);
                show2of5in1d(numl2[1], false, 3, horizontal);
                show2of5in1d(numl2[2], false, 4, horizontal);
            return;
        }
    }
}
