# ColorEnglish 🎨🇬🇧

Монгол хэлнээс Англи хэл сурах хүмүүст зориулсан, AI дэмжлэгтэй онлайн сургалтын платформ.

## Бүтэц (Monorepo — npm workspaces)

```
colorenglish/
├── frontend/          # Next.js 14 (App Router) + TypeScript + Tailwind + Framer Motion
├── backend/           # NestJS + Prisma + PostgreSQL
├── package.json       # root — workspaces удирдлага
└── README.md
```

## Хэрэглэгчийн 3 тал

1. **Frontend** — суралцагчийн систем (A1–B2, 8 түвшин, түвшин бүрт 8 модуль хичээл)
2. **Backend** — API, Auth, AI grading, прогресс tracking
3. **Admin** — контент удирдлага (хичээл, шалгалт, хэрэглэгч)

## Хичээлийн 8 модуль (түвшин бүрт)

| № | Нэр | Тайлбар |
|---|-----|---------|
| 001 | Дүрэм | Түвшинд тохирсон практик дүрмийн хичээл |
| 002 | Унших | Бодит мэдээгээр алхамчилсан унших дасгал |
| 003 | Dictation & Quiz | Цээж бичиг |
| 004 | Shadowing | "Friends" цувралаар дуудлага сайжруулах |
| 005 | Ярих | AI-тай ярилцаж алдаа засуулах |
| 006 | Бичих | AI багшаар бичвэр шалгуулах |
| 007 | Sentence Sort | Өгүүлбэрийн бүтэц тоглоомоор сурах |
| 008 | Үгийн сан | Context-based vocabulary |

## Хөгжүүлэлт эхлүүлэх

```bash
# Бүх dependency суулгах (root-оос)
npm install

# Хөгжүүлэлтийн орчин (frontend + backend хамт)
npm run dev

# Тус тусад нь
npm run dev:frontend   # http://localhost:3001
npm run dev:backend    # http://localhost:8080
```

## Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion
- **Backend:** NestJS, Prisma ORM, PostgreSQL, JWT (access + refresh token)
- **Monorepo:** npm workspaces
