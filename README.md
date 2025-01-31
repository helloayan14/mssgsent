# mssgsent

mssgsent is a full-stack web application built with Next.js and TypeScript that allows users to receive anonymous messages via a unique URL. The platform leverages AI to generate messages and ensures secure authentication and email verification.

## Features

- **Anonymous Messaging**: Users can receive messages through a unique URL.
- **AI-Powered Message Generation**: Uses Cohere AI to generate messages.
- **Authentication**: Secure login and session management with NextAuth.
- **Email Verification**: Resend is used for email verification.
- **Database**: MongoDB for data storage.

## Tech Stack

- **Frontend**: Next.js, TypeScript
- **Backend**: Next.js API routes, MongoDB
- **Authentication**: NextAuth
- **AI Integration**: Cohere AI
- **Email Services**: Resend
- **Deployment**: [ Vercel]

## Installation


1. Clone the repository:

   ```sh
   git clone https://github.com/helloayan14/mssgsent.git
   cd mssgsent   
   
2.Install dependencies   
npm install
# or
yarn install

3.Setup .env.local file
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
COHERE_API_KEY=your_cohere_key
RESEND_API_KEY=your_resend_key
MONGODB_URI=your_mongodb_uri
4.Run the Developement server
npm run dev
# or
yarn dev

5.Open http://localhost:3000 in your browser.

