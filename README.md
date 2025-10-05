# 🎓 Mini E-Learning Platform

A functional prototype of a mini e-learning platform built with **React** and **Tailwind CSS**, designed to demonstrate core learning management features such as viewing courses, checking details, and marking progress.

---

## 🌐 Live Demo

🔗 **Live Deployment:** [View Project Here](https://your-deployment-link.netlify.app) 

---

## 🚀 Features

- 📚 **View Courses** — Displays a list of at least three courses with title, description, and thumbnail.  
- 🔍 **Course Details** — Click a course to view its details, including description, instructor, and lessons overview.  
- ✅ **Mark as Completed** — Learners can mark a course as “completed”, with progress saved in `localStorage`.  
- 👤 **Optional Authentication** — Simple login/signup functionality using `localStorage` for demonstration.  
- 🧭 **Navigation** — Built-in navigation using React Router between course list, course details, and (optional) auth pages.  
- 💾 **Persistent State** — User progress remains stored even after refreshing the browser.  
- 💅 **Responsive Design** — Fully responsive layout styled with Tailwind CSS.  

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Routing:** React Router  
- **Storage:** localStorage (for auth and progress)  
- **State Management:** React Hooks (`useState`, `useEffect`)  

---

## 📁 Project Structure

src/
├── components/
│ ├── Navbar.jsx
│ ├── CourseList.jsx
│ ├── CourseDetail.jsx
│ └── Auth.jsx
├── data/
│ └── courses.json
├── App.jsx
├── main.jsx
└── index.css

yaml
Copy code

---

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mini-elearning-platform.git
   cd mini-elearning-platform
Install dependencies

bash
Copy code
npm install
Run the app

bash
Copy code
npm run dev
Open in your browser

arduino
Copy code
http://localhost:5173
🚢 Deployment
To deploy your app live:

Push your project to a GitHub repository.

Go to Netlify or Vercel.

Connect your GitHub repository.

Select the main branch and deploy — your app will be live within seconds!

Copy your live URL and replace it in the Live Demo section above.

🧩 Future Enhancements
🔐 Integrate Firebase or Supabase authentication.

🧠 Add AI-powered course recommendations.

🗂️ Backend support for dynamic course management.

🏆 User dashboard with progress tracking and certificates.

🌐 Improved deployment setup with environment variables and build automation.

👨‍💻 Author
Abraham Sitori
Economics & Statistics major | Aspiring AI & Software Engineer
🚀 Guided and mentored project by ChatGPT (GPT-5)

📝 License
This project is open source and available under the MIT License.
