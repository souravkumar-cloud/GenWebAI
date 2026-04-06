# 🚀 GenWeb.ai – AI Website Builder for Small Businesses

GenWeb.ai is an AI-powered platform that allows small businesses to generate modern, responsive websites instantly using simple prompts. It also includes a secure credit-based payment system powered by Stripe.

---

## 🌟 Features

- 🤖 AI-powered website generation from text prompts  
- 🎨 Clean, responsive UI (mobile-first design)  
- ⚡ Real-time preview with live iframe rendering  
- 🧠 Smart prompt processing using AI APIs  
- 💳 Stripe payment integration (credit-based system)  
- 👤 Authentication (JWT + Google OAuth)  
- 📦 User dashboard with generated websites  
- 🛒 Pricing plans (Free, Pro, Premium)  
- ☁️ Cloud-ready deployment  

---

## 🧱 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Framer Motion

### Backend
- Node.js + Express
- MongoDB (Mongoose)

### Integrations
- OpenRouter API (AI generation)
- Stripe (payments & webhooks)
- Cloudinary / Firebase (optional)

---

## 💰 Pricing Plans

| Plan     | Price  | Credits |
|----------|--------|---------|
| Free     | ₹0     | 100     |
| Pro      | ₹499   | 500     |
| Premium  | ₹999   | 1500    |

---

## 🔐 Authentication

- JWT-based authentication  
- Google OAuth login  
- Secure cookie handling  

---

## 💳 Stripe Payment Flow

1. User selects a plan  
2. Stripe Checkout session is created  
3. Payment is processed securely  
4. Webhook updates user credits in database  

---

## 📁 Project Structure

AiWebsiteBuilder/
│
├── client/        # Frontend (React)
│   ├── src/
│   └── ...
│
├── server/        # Backend (Node.js)
│   ├── controllers/
│   ├── routes/
│   ├── config/
│   └── ...
│
└── README.md

---

## ⚙️ Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-username/ai-website-builder.git  
cd ai-website-builder  

---

### 2. Setup Backend

cd server  
npm install  

Create `.env` file:

PORT=3000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
OPENROUTER_API_KEY=your_api_key  
STRIPE_SECRET_KEY=your_stripe_key  
STRIPE_WEBHOOK_SECRET=your_webhook_secret  

Run backend:

npm run dev  

---

### 3. Setup Frontend

cd client  
npm install  
npm run dev  

---

## 🌐 Deployment

### Backend (Render)
- Build: npm install  
- Start: npm start  

### Frontend (Vercel / Netlify)
- Build: npm run build  
- Output: dist  

---

## 🔒 Security Notes

- Never commit `.env` files  
- Keep API keys secure  
- Use HTTPS in production  

---

## 🚀 Future Improvements

- AI design customization  
- Template marketplace  
- Multi-language support  
- Analytics dashboard  

---

## 🤝 Contributing

Feel free to fork and contribute.

---

## 📜 License

NIL

---

## 👨‍💻 Author

Built with ❤️ for small businesses to go online effortlessly.
