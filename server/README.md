# LINE OA AI Server

Express + TypeScript standalone application server สำหรับรัน LINE OA AI Bot ร่วมกับ `line-oa-ai-module`

## การติดตั้ง (Installation)

เข้าไปที่โฟลเดอร์ `server` และติดตั้ง dependencies:

```bash
npm install
```

## การตั้งค่า Environment Variables

คัดลอกไฟล์ `.env.example` ไปเป็น `.env`:

```bash
cp .env.example .env
```

จากนั้นระบุค่า credential ทั้ง 2 ตัวที่ได้จาก **LINE Developers Console > Messaging API channel**:

- `LINE_CHANNEL_ACCESS_TOKEN` - Channel Access Token
- `LINE_CHANNEL_SECRET` - Channel Secret

## การรัน Server

- **Development mode:**
  ```bash
  npm run dev
  ```
  (รันผ่าน `tsx watch` ที่พอร์ตเริ่มต้น `3002`)

- **Production mode:**
  ```bash
  npm start
  ```

## การตรวจสอบและทดสอบ (Typecheck & Tests)

- **Typecheck:**
  ```bash
  npm run typecheck
  ```
- **Unit Tests:**
  ```bash
  npm test
  ```

## Routes ที่ให้บริการ

- `GET /health` — ตรวจสอบสถานะการทำงานของเซิร์ฟเวอร์ (คืนค่า `{ "ok": true }`)
- `POST /webhook/line` — รับ raw request body จาก LINE Webhook, ตรวจสอบลายเซ็น `x-line-signature` และส่งต่อประมวลผลข้อความผ่าน `handleWebhook`
  - คืนค่า `200 { "status": "OK", "processed": <number> }` เมื่อ signature ถูกต้อง
  - คืนค่า `401 { "error": <reason> }` เมื่อ signature ไม่ถูกต้องหรือไม่พบลายเซ็น

## ข้อจำกัดและสิ่งที่ต้องรู้ (Limitations)

1. **ยังไม่ได้ทดสอบกับ LINE OA Webhook จริง:** เซิร์ฟเวอร์นี้ผ่านการทดสอบเฉพาะ Automated Tests ภายในเครื่องเท่านั้น ยังไม่ได้ยิงทดสอบแบบ End-to-End กับระบบ LINE Messaging API จริง หากต้องการทดสอบจริง จำเป็นต้องมี LINE Developers Channel และใช้ Public URL (เช่น ngrok หรือ Cloudflare Tunnel) ชี้เข้ามายังเซิร์ฟเวอร์เครื่องนี้
2. **เป็นระบบ Standalone / Local เท่านั้น:** เซิร์ฟเวอร์นี้ตั้งใจออกแบบให้ทำงานแบบ Standalone โดยไม่ได้เชื่อมต่อกับ Supabase หรือ Shared Database ใดๆ ซึ่งเป็นไปตามการออกแบบที่กำหนดไว้ ไม่ใช่การตกหล่น
