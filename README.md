# mssgsent

mssgsent is a Next.js and TypeScript-powered web application that allows users to send messages to themselves, store them securely, and receive reminders. It also features AI-powered message suggestions using the Cohere AI API.

## 🚀 Features

- 📩 **Send Messages to Yourself** – Save personal notes, reminders, or thoughts.
- 🔄 **CRUD Operations** – Create, update, delete, and manage messages.
- 🤖 **AI Message Suggestions** – Get smart message recommendations with Cohere AI.
- 🔑 **Authentication** – Secure sign-in using NextAuth and custom signup.
- ✉️ **Email Verification** – Sign-up verification via Brevo (Gmail SMTP app password).
- 🛢️ **MongoDB Database** – Efficient and scalable data storage.
- 🌐 **Deployed on Vercel** – Fast and reliable hosting.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** Next.js API Routes, MongoDB, Express-like API handling
- **Auth:** NextAuth (OAuth & credentials-based)
- **Email Service:** Brevo (via Gmail SMTP)
- **AI Integration:** Cohere AI API
- **Deployment:** Vercel

## 🔧 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/mssgsent.git
   cd mssgsent
## Install dependencies 
npm install
NEXTAUTH_URL=<your-vercel-deployment-url or local host url>
MONGODB_URI=<your-mongodb-connection-string>
COHERE_API_KEY=<your-cohere-api-key>
SMTP_EMAIL=<your-gmail-email>
SMTP_PASSWORD=<your-app-password>

## Run the Development server
npm run dev

## Open http://localhost:3000 in your browser.
## 🌍 Live Demo
Check out the live project: https://mssgsent.vercel.app/


