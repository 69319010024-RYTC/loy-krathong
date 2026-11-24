# LUMINA — The Festival of Lights 🏮✨
### เทศกาลลอยกระทง 3 มิติยามค่ำคืน (3D Interactive Thai Loy Krathong Experience)

[![Three.js](https://img.shields.io/badge/Three.js-r160-black?logo=three.js)](https://threejs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple?logo=vite)](https://vitejs.dev/)

**LUMINA** คือโปรเจกต์เว็บแอปพลิเคชัน 3 มิติแบบสมจริง (High-End Stylized 3D) ที่จำลองบรรยากาศค่ำคืนวันเพ็ญเดือนสิบสองของเทศกาลลอยกระทงไทยได้อย่างงดงาม ตระการตา และมีชีวิตชีวา ด้วยเทคโนโลยี WebGL และ Three.js ล่าสุด

---

## 🌟 จุดเด่นและระบบหลักภายในเกม (Key Features)

### 1. 👑 เวทีประกวดนางงามสุดอลังการ (Miss Lumina Pageant Stage)
* **สถาปัตยกรรมเวทีคอนเสิร์ตระดับโลก:** ได้รับแรงบันดาลใจจากเวที **Miss Grand International (MGI)** พร้อมโครงสร้าง Grand Rotunda Tower, ป้ายไฟนีออน *"GRAND"*, *"Too Grand To Be Ordinary"*, *"Queenergy"*, *"MGI 2026"* และโครงทรัสไฟเวที (Concert Truss) อลังการ
* **พื้นรันเวย์จอ LED ใส คลื่นน้ำสีฟ้า:** พื้นรันเวย์ผิวกระจกสะท้อนเงา ผสาน Custom GLSL Shader แสดงระลอกคลื่นน้ำสีฟ้าครามไหลผ่านตลอดทางเดิน และขอบไฟนีออนสีชมพูมาเจนต้า
* **นางงามชุดว่ายน้ำ & ท่วงท่าการเดินสับสะโพกสุดมั่นใจ:**
  * โมเดลสัดส่วนสมจริง สวมรองเท้าส้นสูงแตะพื้นสนิท ไม่จมพื้นเวที
  * ผู้เข้าประกวด 8 คนจากจังหวัดต่าง ๆ สวมชุดว่ายน้ำไฮแฟชั่นสีสันสดใสไม่ซ้ำกัน
  * แอนิเมชันเดินสับสะโพก (Fierce Catwalk Strut), การเคลื่อนไหวเอว-ไหล่, การโพสท่า Signature Pose และหมุนตัว 360 องศาที่ปลายเวทีอย่างสมบูรณ์แบบ
* **ระบบแสงเวที & ลำแสงโวลูเมตริก (Volumetric Light Beams):** ลำแสงสปอตไลท์พาดผ่านเวที ขยับกวาดไปมาแบบไดนามิก

### 2. 🪷 คลองลอยกระทง & ระลอกน้ำสมจริง (Canal & Floating Krathongs)
* **ระบบฟิสิกส์คลื่นน้ำ (Custom Water Waves & Caustics):** ผิวน้ำในคลองสะท้อนแสงไฟและแสงจันทร์อย่างเป็นธรรมชาติ
* **การปล่อยกระทง & ระลอกคลื่นน้ำกระจายตัว (Interactive Ripples):** เมื่อปล่อยกระทง กระทงจะลอยตามกระแสน้ำอย่างนุ่มนวล พร้อมคลื่นน้ำสีทองแผ่ออกจากจุดที่ปล่อย
* **กระทงหลากหลายรูปแบบ:** เลือกประดับกระทงด้วยกลีบดอกบัว ดอกดาวเรือง ธูปเทียน และแสงประกาย
* **ระบบเซียมซี & ไพ่ทาโรต์พยากรณ์ (Fortune Card Deck):** หลังจากปล่อยกระทง รับคำทำนายดวงชะตาและคำอวยพรมงคลพร้อมเสียงกระดิ่งเซน

### 3. 🛕 วัดไทยสีทองอร่าม (Golden Thai Temple)
* สถาปัตยกรรมพระอุโบสถทรงไทยแท้ หลังคาซ้อนชั้นลดหลั่น ประดับช่อฟ้า ใบระกา หางหงส์สีทองอร่าม
* เสาพาไลระเบียงวัด บันไดพญานาค และลานกราบไหว้ขอพร
* ประชาชนและผู้แสวงบุญในชุดขาวประกอบพิธีพนมมือไหว้พระอย่างสงบ

### 4. 🍢 ตลาดนัดเทศกาล & ป่าช้าเร้นลับ (Night Market & Mystical Forest)
* ตลาดนัดอาหารไทยริมทาง เช่น ร้านผัดไทย หมูสะเต๊ะ ชาไทย ของที่ระลึก
* ระบบฝูงชนจำลอง (Crowd Simulation) เดิน กินอาหาร และส่งเสียงเชียร์ตามจุดต่าง ๆ โดยโมเดลยืนบนพื้นอย่างถูกต้อง
* โคมลอย (Khom Loi) นับสิบดวงลอยขึ้นสู่ฟากฟ้าอย่างช้า ๆ
* ป่าช้าโบราณเร้นลับที่มีหมอกไอวิญญาณและหลุมศพโบราณลึกลับ

### 5. 🌙 บรรยากาศท้องฟ้ายามค่ำคืนที่สว่างนวล (Luminous Celestial Night)
* ท้องฟ้าสีกรมท่าไล่ระดับแซฟไฟร์สดใส (Bright Moonlit Night Sky)
* พระจันทร์เต็มดวงส่องแสงนวลพร้อมวงแหวนออร่าสะท้อนผิวน้ำ
* ระบบแสง Hemisphere Light เติมเต็มความสว่างให้มองเห็นทุกรายละเอียดได้อย่างคมชัด ไม่มืดทึบ

### 6. 🎥 การควบคุมมุมกล้อง 360 องศาอิสระ (360° Free Camera)
* **Drag to Look:** คลิกลากเมาส์ หรือทัชสกรีนเพื่อหมุนมุมมองรอบทิศทาง 360 องศาในทุกโหมด
* **WASD / Arrow Keys:** เคลื่อนที่สำรวจไปได้ทุกทิศทาง
* **Mouse Wheel / Pinch:** ซูมเข้า-ออกอย่างอิสระ
* **Q / E Keys:** บินปรับระดับความสูงของกล้องขึ้น-ลง

### 7. 🎵 ระบบเสียงแบบ 3 มิติตามตำแหน่ง (Spatial Web Audio)
* สร้างคลื่นเสียงสังเคราะห์ (Procedural Audio) แบบเรียลไทม์ตามพิกัดของผู้เล่น เช่น เสียงสายน้ำริมตลิ่ง, เสียงเพลงจังหวะสนุกสนานบริเวณเวที, เสียงระฆังลมในลานวัด และเสียงธรรมชาติในป่าช้า

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Core Engine:** [Three.js](https://threejs.org/) (r160)
* **Framework:** [React 18](https://reactjs.org/) + [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (@react-three/fiber)
* **3D Helpers:** [@react-three/drei](https://github.com/pmndrs/drei)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Icons & Effects:** [Lucide React](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
* **Audio:** Web Audio API (Spatial Gain Nodes & Synthesizers)

---

## 🚀 วิธีการติดตั้งและรันโปรเจกต์ (Getting Started)

### ความต้องการของระบบ (Prerequisites)
* Node.js เวอร์ชัน 18 ขึ้นไป
* npm หรือ yarn / pnpm

### ขั้นตอนการรัน

1. **โคลนคลังโค้ด:**
   ```bash
   git clone https://github.com/69319010024-RYTC/loy-krathong.git
   cd loy-krathong
   ```

2. **ติดตั้ง Dependencies:**
   ```bash
   npm install
   ```

3. **รันเซิร์ฟเวอร์สำหรับ Development:**
   ```bash
   npm run dev
   ```
   เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

4. **บิลด์สำหรับ Production:**
   ```bash
   npm run build
   ```

---

## 🎮 การควบคุม (Controls)

| การกระทำ | ปุ่ม / เมาส์ |
| :--- | :--- |
| **หมุนมุมมอง (Look Around)** | คลิกลากเมาส์ซ้าย (Left Click + Drag) หรือทัชสกรีน |
| **เดินสำรวจ (Move)** | `W`, `A`, `S`, `D` หรือปุ่มลูกศร (Arrow Keys) |
| **บินขึ้น / ลง (Fly Elevation)** | `E` / `Space` (ขึ้น), `Q` / `Shift` (ลง) |
| **ซูมเข้า / ออก (Zoom)** | ล้อเลื่อนเมาส์ (Mouse Wheel) หรือบีบนิ้ว (Pinch) |
| **เปลี่ยนมุมกล้องไฮไลต์** | ปุ่มสลับมุมมองที่แถบด้านล่าง (เวทีนางงาม / ท่าเรือ / วัดไทย / ป่าช้า) |
| **ลอยกระทง** | ปุ่ม *"จุดประทีป & ปล่อยกระทงขอพร"* |

---

## 📄 ลิขสิทธิ์ (License)
โปรเจกต์นี้สร้างขึ้นเพื่อการศึกษาและการอนุรักษ์ส่งเสริมวัฒนธรรมไทย ภายใต้สัญญาอนุญาต MIT License
