# microbit-2of5-font

README | [TH-README](THREADME.md)
A MakeCode extension for the **micro:bit** that displays numbers on the 5×5 LED matrix in **2 of 5** style.  
Inspired by the 2 of 5 barcode family, especially Interleaved 2 of 5 (ITF).

> **Demo:** [2of5 stopwatch](https://makecode.microbit.org/S01096-15267-22200-79592)  
> Project page: [https://phatisena.github.io/microbit-2of5-font/](https://phatisena.github.io/microbit-2of5-font/)

---

## Features

- Render numbers in classic 2 of 5 patterns on the 5×5 screen
- Support for **negative numbers** (shown via inverted dots)
- Optional **Guard** mode (uses the 6th digit as invert reference)
- Optional **Transpose** mode (swap vertical ↔ horizontal)
- Single-digit display or dual-number display with alignment
- Compact implementation using `Buffer` for the 2 of 5 patterns

---

## Install as Extension

1. Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Create a **New Project**
3. Click the gear icon → **Extensions**
4. Paste this URL and import:

```
https://github.com/Quarequin/microbit-2of5-font
```

*(The previous URL `https://github.com/phatisena/microbit-2of5-font` still works.)*

---

## Main Blocks / Functions

| Function | Description |
|----------|-------------|
| `show2of5Number(n, guard, transpos?)` | Show a full number (up to 5 or 6 digits) |
| `show2of5SingleNumber(n, inv, col, transpos?)` | Show a single digit at a specific column |
| `show2of5DualNumber(num1, num2, align, transpos?)` | Show two numbers side-by-side (Left / Center / Right) |

### Important Parameters

- **guard** — when `true`, the 6th digit controls invert of each digit
- **transpos** — rotate the display (vertical ↔ horizontal)
- **inv** — invert the dots of that digit (also used for negative numbers)
- **align** — `Left` / `Center` / `Right` for dual mode

---

## 2 of 5 Pattern Encoding

Each digit is encoded with 5 bits (exactly two bits set to 1):

```
0 → 11000
1 → 10100
2 → 10010
3 → 10001
4 → 01100
5 → 01010
6 → 01001
7 → 00110
8 → 00101
9 → 00011
```

Stored as a compact Buffer:

```typescript
const pin2of5: Buffer = hex`181412110C0A09060503`
```

---

## Edit this Project

1. Open [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. Click **Import** → **Import URL**
3. Paste:

```
https://github.com/Quarequin/microbit-2of5-font
```

---

## Technical Info

- Target: **micro:bit** (MakeCode / PXT)
- Language: TypeScript
- Current version: see `pxt.json`

---

#### Metadata (used for search, rendering)

* for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
</script>
