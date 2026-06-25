# 📝 Notes App

A full-stack Notes application built with Next.js App Router featuring authentication, protected routes, and note management.

## 🚀 Features

- 🔐 User Authentication
- 👤 User Registration & Login
- 📝 Create, Read, Update and Delete Notes
- 🛡️ Protected Routes
- 📱 Responsive Design
- ⚡ Server-side API Routes
- 🎯 TypeScript Support

## 🛠️ Tech Stack

- ⚛️ Next.js 15
- 🔷 TypeScript
- 🎨 CSS Modules
- 🔐 JWT Authentication
- ▲ Vercel Deployment

## 📦 Installation

```bash
git clone https://github.com/KatarginaKate/09-auth.git

cd 09-auth

npm install
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=your_api_url
```

## ▶️ Run Locally

Development mode:

```bash
npm run dev
```

Production build:

```bash
npm run build
npm start
```

## 📂 Project Structure

```text
.
├── app/
│   ├── (auth routes)/
│   ├── (private routes)/
│   ├── @modal/
│   ├── api/
│   │   ├── _utils/
│   │   ├── auth/
│   │   ├── notes/
│   │   ├── users/
│   │   └── api.ts
│   ├── globals.css
│   ├── Home.module.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
├── components/
├── lib/
├── public/
├── types/
│
├── .env
├── .gitignore
└── package.json
```

## 🌐 Live Demo

🔗 https://09-auth-five-omega.vercel.app/

## 👩‍💻 Author

**Kateryna Nehoda**

GitHub: https://github.com/KatarginaKate

⭐ Feel free to star the repository if you found it useful.
