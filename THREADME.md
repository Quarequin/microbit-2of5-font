# microbit-2of5-font

[README](README.md) \| TH-README

ส่วนขยาย MakeCode สำหรับ **micro:bit** ที่แสดงตัวเลขบนหน้าจอ LED 5×5 ในรูปแบบ **2 of 5**  
ได้รับแรงบันดาลใจจากตระกูลบาร์โค้ด 2 of 5 โดยเฉพาะ Interleaved 2 of 5 (ITF)

> **เดโม:**
> - [2of5 stopwatch](https://makecode.microbit.org/S01096-15267-22200-79592)
> - [2of5 password](https://makecode.microbit.org/S85011-20530-96755-53791) *(ตัวอย่างการใช้ `write2of5`)*
>
> หน้าโปรเจกต์: [https://quarequin.github.io/microbit-2of5-font/](https://quarequin.github.io/microbit-2of5-font/)

---

## คุณสมบัติ

- แสดงตัวเลขแบบ 2 of 5 บนหน้าจอ 5×5
- รองรับ**เลขติดลบ** (แสดงด้วยการกลับสีจุด)
- รองรับโหมด **Guard** (ใช้หลักที่ 6 เป็นตัวอ้างอิงการกลับสี)
- รองรับโหมด **Transpose** (สลับแนวตั้ง ↔ แนวนอน)
- รองรับการปรับ **ความสว่าง** (0–255)
- แสดงตัวเลขเดี่ยว หรือสองค่าพร้อมกัน (Dual) พร้อมจัดตำแหน่ง
- มีฟังก์ชัน `write2of5` สำหรับแปลงตำแหน่งบิต 2 ตำแหน่งกลับเป็นตัวเลข (ใช้ binary search)
- ใช้ `Buffer` เดียวเก็บรูปแบบ 2 of 5 ทั้งหมด เพื่อประหยัดหน่วยความจำและทำให้โค้ดสั้นลงมาก

---

## การติดตั้งเป็น Extension

1. เปิด [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. สร้าง **New Project**
3. คลิกไอคอนเฟือง → **Extensions**
4. วางลิงก์นี้แล้วกด Import:

```
https://github.com/Quarequin/microbit-2of5-font
```

*(ลิงก์เดิม `https://github.com/phatisena/microbit-2of5-font` ยังใช้งานได้)*

---

## บล็อก / ฟังก์ชันหลัก

| ฟังก์ชัน | คำอธิบาย |
|---------|----------|
| `write2of5(a, b)` | แปลงตำแหน่งบิต 2 ตำแหน่ง (0–4) เป็นตัวเลข 2of5 (คืนค่า -1 ถ้าไม่ถูกต้อง) |
| `show2of5Number(n, guard, transpose?, brightness?)` | แสดงตัวเลขเต็ม (สูงสุด 5 หรือ 6 หลัก) |
| `show2of5SingleNumber(n, inv, col, transpose?, brightness?)` | แสดงตัวเลข 1 หลักที่ตำแหน่งคอลัมน์ที่กำหนด |
| `show2of5DualNumber(a, b, align, transpose?, brightness?)` | แสดงตัวเลข 2 ค่าพร้อมกัน (ซ้าย / กลาง / ขวา) |

### พารามิเตอร์สำคัญ

- **guard** — ถ้าเป็น `true` จะใช้หลักที่ 6 เป็นตัวกำหนดการกลับสีของแต่ละหลัก
- **transpose** — หมุนการแสดงผล (แนวตั้ง ↔ แนวนอน)
- **brightness** — ระดับความสว่างของ LED (0–255, ค่าเริ่มต้น 255)
- **inv** — กลับสีจุดของหลักนั้น (ใช้แสดงเลขติดลบได้)
- **align** — `Left` / `Center` / `Right` สำหรับโหมด Dual
- **a, b** (ใน `write2of5`) — ตำแหน่งบิต (0–4) ต้องไม่ซ้ำกัน

---

## รูปแบบการเข้ารหัส 2 of 5

แต่ละหลักถูกเข้ารหัสด้วย 5 บิต (มีบิตที่เป็น 1 อยู่พอดี 2 บิต):

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

เก็บใน Buffer แบบเรียงจากมากไปน้อย (เรียกกันเล่น ๆ ว่า **2of5 magic buffer**):

```typescript
const pin2of5: Buffer = hex`181412110C0A09060503`
```

ฟังก์ชัน `write2of5` ใช้ binary search บน Buffer นี้เพื่อแปลงตำแหน่งบิต 2 จุดกลับเป็นตัวเลข

---

## แก้ไขโปรเจกต์นี้

1. เปิด [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. คลิก **Import** → **Import URL**
3. วางลิงก์:

```
https://github.com/Quarequin/microbit-2of5-font
```

---

## ข้อมูลทางเทคนิค

- เป้าหมาย: **micro:bit** (MakeCode / PXT)
- ภาษา: TypeScript
- เวอร์ชันปัจจุบัน: **6.1.0** (ดูจากไฟล์ `pxt.json`)

---

#### Metadata (used for search, rendering)

* for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
</script>
# microbit-2of5-font

[README](README.md) \| TH-README

ส่วนขยาย MakeCode สำหรับ **micro:bit** ที่แสดงตัวเลขบนหน้าจอ LED 5×5 ในรูปแบบ **2 of 5**  
ได้รับแรงบันดาลใจจากตระกูลบาร์โค้ด 2 of 5 โดยเฉพาะ Interleaved 2 of 5 (ITF)

> **เดโม:**
> - [2of5 stopwatch](https://makecode.microbit.org/S01096-15267-22200-79592)
> - [2of5 password](https://makecode.microbit.org/S85011-20530-96755-53791)
> 
> หน้าโปรเจกต์: [https://quarequin.github.io/microbit-2of5-font/](https://quarequin.github.io/microbit-2of5-font/)

---

## คุณสมบัติ

- แสดงตัวเลขแบบ 2 of 5 บนหน้าจอ 5×5
- รองรับ**เลขติดลบ** (แสดงด้วยการกลับสีจุด)
- รองรับโหมด **Guard** (ใช้หลักที่ 6 เป็นตัวอ้างอิงการกลับสี)
- รองรับโหมด **Transpose** (สลับแนวตั้ง ↔ แนวนอน)
- แสดงตัวเลขเดี่ยว หรือสองค่าพร้อมกัน (Dual) พร้อมจัดตำแหน่ง
- มีฟังก์ชัน `write2of5` สำหรับแปลงตำแหน่งบิต 2 ตำแหน่งกลับเป็นตัวเลข
- ใช้ `Buffer` เก็บรูปแบบ 2 of 5 เพื่อประหยัดหน่วยความจำและทำให้โค้ดสั้นลง

---

## การติดตั้งเป็น Extension

1. เปิด [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. สร้าง **New Project**
3. คลิกไอคอนเฟือง → **Extensions**
4. วางลิงก์นี้แล้วกด Import:

```
https://github.com/Quarequin/microbit-2of5-font
```

*(ลิงก์เดิม `https://github.com/phatisena/microbit-2of5-font` ยังใช้งานได้)*

---

## บล็อก / ฟังก์ชันหลัก

| ฟังก์ชัน | คำอธิบาย |
|---------|----------|
| `write2of5(a, b)` | แปลงตำแหน่งบิต 2 ตำแหน่ง (0–4) เป็นตัวเลข 2of5 (คืนค่า -1 ถ้าไม่ถูกต้อง) |
| `show2of5Number(n, guard, transpose?)` | แสดงตัวเลขเต็ม (สูงสุด 5 หรือ 6 หลัก) |
| `show2of5SingleNumber(n, inv, col, transpose?)` | แสดงตัวเลข 1 หลักที่ตำแหน่งคอลัมน์ที่กำหนด |
| `show2of5DualNumber(a, b, align, transpose?)` | แสดงตัวเลข 2 ค่าพร้อมกัน (ซ้าย / กลาง / ขวา) |

### พารามิเตอร์สำคัญ

- **guard** — ถ้าเป็น `true` จะใช้หลักที่ 6 เป็นตัวกำหนดการกลับสีของแต่ละหลัก
- **transpose** — หมุนการแสดงผล (แนวตั้ง ↔ แนวนอน)
- **inv** — กลับสีจุดของหลักนั้น (ใช้แสดงเลขติดลบได้)
- **align** — `Left` / `Center` / `Right` สำหรับโหมด Dual
- **a, b** (ใน `write2of5`) — ตำแหน่งบิต (0–4) ต้องไม่ซ้ำกัน

---

## รูปแบบการเข้ารหัส 2 of 5

แต่ละหลักถูกเข้ารหัสด้วย 5 บิต (มีบิตที่เป็น 1 อยู่พอดี 2 บิต):

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

เก็บใน Buffer แบบกระชับ:

```typescript
const pin2of5: Buffer = hex`181412110C0A09060503`
```

---

## แก้ไขโปรเจกต์นี้

1. เปิด [https://makecode.microbit.org/](https://makecode.microbit.org/)
2. คลิก **Import** → **Import URL**
3. วางลิงก์:

```
https://github.com/Quarequin/microbit-2of5-font
```

---

## ข้อมูลทางเทคนิค

- เป้าหมาย: **micro:bit** (MakeCode / PXT)
- ภาษา: TypeScript
- เวอร์ชันปัจจุบัน: ดูจากไฟล์ `pxt.json`

---

#### Metadata (used for search, rendering)

* for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
</script>
