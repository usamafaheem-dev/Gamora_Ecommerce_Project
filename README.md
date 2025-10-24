# Gamora Ecommerce Project

**Full-Stack MERN Ecommerce Application**  
Built with **React · Node.js · Express · MongoDB** to deliver a modern, feature-rich shopping experience.

---

## 🚀 Features

- User authentication & authorization (register / login)  
- Product listing, search, filtering & categories  
- Product details page with reviews & ratings  
- Shopping cart & checkout integration  
- Order history & user dashboard  
- Admin panel for product / order management (if applicable)  
- Responsive UI (desktop + mobile)  
- RESTful API with error handling & security (CORS, Helmet, etc.)  

---

## 🧰 Tech Stack

| Frontend           | Backend                    | Database    |
|--------------------|----------------------------|-------------|
| React              | Node.js + Express.js       | MongoDB      |
| React Router       | REST API Endpoints         | Mongoose     |
| Redux (optional)   | Helmet, CORS, Middleware   |             |

---

## 📁 Folder Structure

/
├── client/ # React application
│ ├── src/
│ └── public/
├── server/ # Express backend
│ ├── routes/
│ ├── controllers/
│ ├── models/
│ ├── middleware/
│ └── config/
└── README.md


---

## 🛠️ Installation & Setup

### Prerequisites  
- Node.js & npm installed  
- MongoDB database (local or hosted)  
- (Optional) Stripe or payment gateway if used  

### Clone the repo  
```bash
git clone https://github.com/usamafaheem-dev/Gamora_Ecommerce_Project.git


2️⃣ Setup Backend
cd server
npm install


Create a .env file inside the server folder and add your credentials:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name (if used)
CLOUDINARY_API_KEY=your_api_key (if used)
CLOUDINARY_API_SECRET=your_api_secret (if used)


Start the backend:

npm run dev


Server will run at ➜ http://localhost:5000

3️⃣ Setup Frontend
cd ../client
npm install
npm start


React app will run at ➜ http://localhost:3000

📡 API Endpoints (Sample)
Method	Endpoint	Description
POST	/api/users/register	Register new user
POST	/api/users/login	Login user
GET	/api/products	Fetch all products
GET	/api/products/:id	Fetch single product
POST	/api/orders	Create new order
GET	/api/orders/:id	Get order details
PUT	/api/orders/:id/pay	Update order payment status
🧮 Environment Variables

Create .env inside the server folder with:

PORT=5000
MONGO_URI=<your_mongo_db_connection_string>
JWT_SECRET=<your_secret_key>
NODE_ENV=development


(If using third-party services like Cloudinary or Stripe, include their keys too.)

🎨 UI Screenshots

(Add your project screenshots here)

Example:

![Home Page](./screenshots/home.png)
![Product Page](./screenshots/product.png)
![Cart Page](./screenshots/cart.png)

🌐 Live Demo

🔗 Visit Live Site
 (Replace with your Netlify or Vercel link)

💡 Key Learning Highlights

Full MERN stack integration (React + Node + MongoDB)

RESTful API design and modular backend architecture

Secure JWT authentication system

State management using React Hooks or Redux

Deployment-ready full stack project

🧑‍💻 Author

👤 Usama Faheem
💼 GitHub: usamafaheem-dev



