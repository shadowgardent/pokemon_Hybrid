# 📱 Pokédex App

แอปพลิเคชัน Pokédex พัฒนาด้วย **React Native (Expo)** สำหรับค้นหาและจัดการข้อมูลโปเกมอน ออกแบบธีมตามแนว [Pokémon GO](https://pokemongo.com/) ด้วยโทนสี Dark Navy และ Golden Yellow

![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_57-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript)
![PokeAPI](https://img.shields.io/badge/PokeAPI-v2-EF5350)

---

## ✨ ฟีเจอร์หลัก

### 🔍 ค้นหาโปเกมอน
- ค้นหาจากชื่อแบบ **Case-Insensitive** (ไม่สนตัวพิมพ์เล็ก-ใหญ่)
- รายการโปเกมอนเปลี่ยนตามข้อความค้นหาแบบ Real-time
- แสดงข้อความแจ้งเตือนเมื่อไม่พบผลลัพธ์
- ช่องค้นหาแยกเป็นคอมโพเนนต์ `PokemonSearchBar`

### 🏷️ ค้นหาตามชนิด (Type)
- กดที่ **Type Badge** ในหน้ารายละเอียดโปเกมอน เพื่อดูโปเกมอนชนิดเดียวกันทั้งหมด
- แสดงชื่อชนิดเป็นภาษาไทย (เช่น ไฟ, น้ำ, พืช, มังกร)
- เปิดหน้าใหม่แสดงรายการโปเกมอนตามชนิดที่เลือก

### ❤️ ระบบรายการโปรด (Favorites)
- กดปุ่มรูปหัวใจเพื่อ **เพิ่ม/ลบ** โปเกมอนออกจากรายการโปรด
- สถานะรายการโปรดแสดงทั้งในหน้ารายการและหน้ารายละเอียด
- สถานะ **คงอยู่ถาวร** เมื่อเปลี่ยนหน้าหรือปิดแอป (ใช้ AsyncStorage)
- หน้าแสดงรายการโปเกมอนที่ชื่นชอบ พร้อม Empty State เมื่อยังไม่มีรายการ

### 🧩 Reusable Components (4 คอมโพเนนต์)

| Component | คำอธิบาย |
|---|---|
| `PokemonCard.tsx` | การ์ดแสดงข้อมูลโปเกมอน (รูป, ชื่อ, ชนิด, ปุ่มโปรด) |
| `PokemonSearchBar.tsx` | ช่องรับข้อความค้นหาจากผู้ใช้ |
| `EmptyState.tsx` | แสดงเมื่อไม่มีข้อมูล (ไม่พบจากการค้นหา / ไม่มีรายการโปรด) |
| `TypeBadge.tsx` | Badge แสดงชนิดโปเกมอน (กดได้เพื่อกรองตามชนิด) |

---

## 🎨 Design Theme — Pokémon GO

| Element | สี / สไตล์ |
|---|---|
| พื้นหลังหลัก | Dark Navy `#0B1929` |
| Header / Tab Bar | Dark Blue `#0F1F3D` / `#0A1628` |
| การ์ดโปเกมอน | Navy Card `#1E2D4A` |
| สี Accent | Pokémon Yellow `#FFCB05` |
| ข้อความหลัก | ขาว `#FFFFFF` |
| ปุ่มหัวใจ (Active) | Golden Yellow `#FFCB05` |

---

## 📁 โครงสร้างโปรเจค

```
PokemonApp/
├── app/                          # หน้าจอ (Expo Router file-based routing)
│   ├── _layout.tsx               # Root Layout + FavoritesProvider
│   ├── +not-found.tsx            # หน้า 404
│   ├── (tabs)/                   # Tab Navigation
│   │   ├── _layout.tsx           # Tab Layout (Pokédex + โปรด)
│   │   ├── index.tsx             # หน้ารายการโปเกมอน + ค้นหา
│   │   └── favorites.tsx         # หน้ารายการโปรด
│   ├── pokemon/
│   │   └── [id].tsx              # หน้ารายละเอียดโปเกมอน
│   └── type/
│       └── [type].tsx            # หน้าแสดงโปเกมอนตามชนิด
├── components/                   # Reusable Components
│   ├── PokemonSearchBar.tsx
│   ├── PokemonCard.tsx
│   ├── EmptyState.tsx
│   └── TypeBadge.tsx
├── contexts/
│   └── FavoritesContext.tsx      # React Context จัดการรายการโปรด
├── constants/
│   └── Pokemon.ts                # ค่าคงที่, สีชนิด, API URL
├── assets/                       # ฟอนต์ และ รูปภาพ
├── app.json                      # การตั้งค่า Expo
├── package.json
└── tsconfig.json
```

---

## 🚀 วิธีติดตั้งและรัน

### ความต้องการ
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Expo Go App (สำหรับทดสอบบนมือถือ)

### ติดตั้ง

```bash
# Clone หรือเข้าไปยังโฟลเดอร์โปรเจค
cd PokemonApp

# ติดตั้ง dependencies
npm install
```

### รันแอป

```bash
# เริ่ม development server
npm start

# รันบน Android
npm run android

# รันบน iOS
npm run ios

# รันบน Web
npm run web
```

---

## 🌐 API ที่ใช้

- **[PokeAPI](https://pokeapi.co/)** — RESTful Pokémon API (ฟรี, ไม่ต้อง API Key)
  - `GET /pokemon?limit=151` — รายการโปเกมอน Gen 1
  - `GET /pokemon/{id}` — รายละเอียดโปเกมอน
  - `GET /type/{type}` — โปเกมอนตามชนิด
- **[PokeAPI Sprites](https://github.com/PokeAPI/sprites)** — รูปภาพ Official Artwork

---

## 🛠️ เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | วัตถุประสงค์ |
|---|---|---|
| React Native | 0.86.0 | Framework หลัก |
| Expo | SDK 57 | Development Platform |
| Expo Router | 57.x | File-based Navigation |
| TypeScript | 6.0 | Type Safety |
| AsyncStorage | latest | เก็บข้อมูลรายการโปรดแบบถาวร |
| @expo/vector-icons | 15.x | ไอคอน (Ionicons) |

---

## 📸 หน้าจอแอปพลิเคชัน

| หน้าจอ | คำอธิบาย |
|---|---|
| 🏠 หน้าหลัก | รายการโปเกมอน 151 ตัว แบบ Grid 2 คอลัมน์ + ค้นหา |
| 📋 รายละเอียด | ข้อมูลโปเกมอน สถิติ ความสามารถ กดชนิดเพื่อกรอง |
| ❤️ รายการโปรด | โปเกมอนที่ชื่นชอบ พร้อม Empty State |
| 🏷️ กรองตามชนิด | รายการโปเกมอนตามชนิดที่เลือก |

## สมาชิกและหน้าที่ในการทำงานของแต่ละคน
|นาย นวพรหม ภูผาผิว 663450040-2 ทำส่วน ออกแบบระบบ Backend|
|นาย นัฐพล พินิจลึก 663450182-2 ทำส่วน ตกแต่งui Frontend|
