# Mini Udemy Clone 🎓

A full-stack, cloud-native online learning platform that allows instructors to create and sell courses, and students to enroll and watch lessons. 

This project was built with a modern architecture, separating the frontend and backend, and fully deployed using cloud services.

## 🚀 Technologies Used

### Frontend (Client-Side)
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** Tailwind CSS (for modern, responsive, and beautiful UI)
- **Deployment & Hosting:** Vercel
- **Language:** TypeScript
- **Features:** App Router, Server-Side Rendering (SSR), and Client Components.

### Backend (API & Server)
- **Framework:** [NestJS](https://nestjs.com/) (A progressive Node.js framework)
- **Architecture:** Serverless (AWS Lambda & API Gateway) via [Serverless Framework](https://www.serverless.com/)
- **Language:** TypeScript
- **Database ORM:** TypeORM
- **Authentication:** JWT (JSON Web Tokens) with Passport.js
- **Deployment:** AWS (Amazon Web Services)

### Database
- **Database Engine:** PostgreSQL
- **Hosting:** AWS RDS (Relational Database Service) - Free Tier

---

## 🏗️ Cloud Architecture

1. **Vercel** hosts the Next.js Frontend, providing a fast global CDN and automatic CI/CD deployments directly from GitHub.
2. **AWS API Gateway + Lambda** hosts the NestJS Backend. Instead of running a server 24/7, the API is serverless, meaning it only consumes resources (and costs) when an HTTP request is made.
3. **AWS RDS** hosts the PostgreSQL Database in a secure, publicly accessible (via Security Groups) instance on the cloud.

---

## 💻 How to Run Locally

If you want to run the project on your local machine for development:

### 1. Backend Setup
```bash
cd backend
npm install
```
Configure your `.env` file inside the `backend` folder with your database credentials and JWT Secret:
```env
JWT_SECRET=YourSuperSecretKey
POSTGRES_HOST=your-rds-endpoint.amazonaws.com
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=postgres
```
Start the backend server:
```bash
npm run start:dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
```
Configure your `.env.local` file inside the `frontend` folder to point to your backend API:
```env
# For local testing (if your backend is running on localhost)
# NEXT_PUBLIC_API_URL=http://localhost:3000/dev

# For production (AWS API Gateway endpoint)
NEXT_PUBLIC_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```
Start the frontend server:
```bash
npm run dev
```
Open `http://localhost:3001` (or 3000) in your browser!

---

## 👨‍💻 Features Developed
- **Authentication:** Login and Registration for Students and Instructors.
- **Instructor Dashboard:** Creation, editing, and deletion of courses, modules, and lessons.
- **Student Dashboard:** View enrolled courses and a dedicated learning page to watch video lessons.
- **Dynamic Content:** Course progress, video embedding, and module management.
