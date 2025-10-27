#  Fasih — AI-Powered Arabic Learning Platform

> **Fasih (فصيح)** is an AI-powered Arabic language learning platform that combines traditional linguistic sciences with modern technology to help learners master Arabic grammar, morphology, rhetoric, and poetry through interactive and gamified learning experiences.

---

## Overview

Fasih is designed as a **comprehensive Arabic language learning ecosystem** that blends education, community, and artificial intelligence.  
Learners can explore levels, lessons, and quizzes while interacting with smart features such as:

- **AI Grammar Analysis (إعراب وتحليل نحوي)**
- **Word Morphology (الصرف والجذور)**
- **Word Meaning, Synonyms, Antonyms & Plurals**
- **Poetry Generation (توليد الشعر العربي)**
- **Gamified Progress Tracking & Streaks**
- **Community Discussions (نقاشات عامة)**
- **Arabic Educational Articles & Insights**

---

##  Core Features

| Module | Description |
|--------|-------------|
| **Authentication** | Secure JWT-based login, signup, OTP verification, and token refresh system. |
| **Courses System** | Levels → Units → Lessons → Quizzes with user progress tracking. |
| **AI Modules** | Integrated Python models for Grammar, Morphology, Poetry, and Word Meaning. |
| **Progress Tracking** | Calendar-based streaks and daily engagement tracking. |
| **Community System** | Category-based discussions and user interactions. |
| **Admin Panel (Planned)** | Management of courses, users, AI results, and reports. |

---

##  Tech Stack

### 🔹 Backend
- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **Zod** for data validation
- **JWT** for authentication
- **Nodemailer** for OTP email verification
- **MVC + Service Layer (MVCS)** architecture

### 🔹 Database
- **MongoDB Atlas** (Cloud)
- Seeded sample data for Levels, Lessons, and AI tasks.

### 🔹 Deployment
- Backend: **Render**
- Database: **MongoDB Atlas**
- Environment variables managed securely via Render Dashboard.

---

## 🗂️ Project Structure (MVCS)
fasih-backend/
│
├── src/
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Route controllers
│ ├── services/ # Business logic
│ ├── routes/ # API routes
│ ├── validations/ # Zod validation schemas
│ ├── middlewares/ # Auth & error handling
│ ├── utils/ # Helper functions
│ └── config/ # Database & environment setup
│
├── .env.example # Sample environment variables
├── package.json
├── server.js
└── README.md


---

##  Authentication Flow

- **Access Token** (JWT) — expires after **7 days**
- **Refresh Token** — expires after **30 days**
- Tokens are handled securely for both **web** and **Flutter mobile clients**.
- Email-based OTP verification upon registration.

---

##  Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/rahmahafzz/fasih.git
cd fasih

2️⃣ Install Dependencies
npm install

3️⃣ Configure Environment Variables

Create a .env file and fill in your credentials:

PORT=5000
MONGO_URI=mongodb://localhost:27017/fasih-db
JWT_SECRET=superSecretKey
JWT_REFRESH_SECRET=yourrefreshsecret
ACCESS_TOKEN_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_password

4️⃣ Run the Server
npm run start


Server should now run on:
 http://localhost:5000

 API Documentation

Full Postman Collection available: fasih-api.postman_collection.json

Includes:

Auth routes

Level/Unit/Lesson management

AI integration endpoints

Quiz & Progress tracking

 Example Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	User login
POST	/api/ai/analyze	Grammar or morphology analysis
GET	/api/levels	Get all levels
POST	/api/quiz/submit	Submit quiz answers
 AI Integration Examples
➤ Grammar Analysis
POST /api/ai/analyze/grammar
{
  "text": "ذهب الطالب إلى المدرسة"
}

➤ Poetry Generation
POST /api/ai/analyze/poetry
{
  "topic": "الحب والفراق"
}

➤ Word Meaning
POST /api/ai/analyze/word-meaning
{
  "word": "كرم",
  "type": "antonyms"
}

 Progress & Streak System

Tracks daily learning streaks.

Displays lesson/test/review activity on a calendar.

Includes daily reminder system for active learners.

 Contributors
Name	Role
Rahma Hafez	Backend Developer & Project Lead
AI Team (Malak & Team)	AI Model Development
Flutter Team(Marwa)	Mobile Frontend Integration
 Future Enhancements

 Admin dashboard for course & user management

 AI pronunciation evaluation

 Leaderboards and XP system

 User social achievements and rewards

 Offline learning mode (mobile)

 License

This project is licensed under the MIT License.
You are free to use, modify, and distribute it for educational and non-commercial purposes.

 Connect

📧 Contact: hafezrhma@gmail.com

 Backend: Node.js / Express / MongoDB
 Frontend: Flutter (in development)

💡 Fasih — where the beauty of Arabic meets the power of AI.


