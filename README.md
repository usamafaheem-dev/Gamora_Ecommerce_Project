# Gamora Ecommerce Project

Gamora is a full-stack MERN ecommerce application with customer and admin flows, order management, reviews, wallet handling, notifications, and Stripe-based payments.

## Tech Stack
- **Frontend:** React (Vite), React Router, Tailwind CSS, Ant Design
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Other:** JWT auth, Cloudinary uploads, Stripe payments

## Project Structure
```text
Gamora_Ecommerce_Project/
├── client/   # React frontend
├── server/   # Express backend API
└── build/    # Generated frontend build output
```

## Key Features
- User signup/login with JWT authentication
- Product listing, details, category filtering, and search flows
- Cart, checkout, and order placement
- Order tracking and order history
- Product reviews and ratings
- Admin dashboard routes for management workflows
- Wallet and notification APIs
- Stripe payment intent + confirmation handling

## Backend API Modules
The server mounts these route groups:
- `/api/auth`
- `/api/profile`
- `/api/products`
- `/api/orders`
- `/api/payments`
- `/api/notifications`
- `/api/admin`
- `/api/reviews`
- `/api/wallet`

## Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB connection string

## Local Setup

### 1) Clone repository
```bash
git clone https://github.com/usamafaheem-dev/Gamora_Ecommerce_Project.git
cd Gamora_Ecommerce_Project
```

### 2) Setup backend
```bash
cd server
npm install
```

Create `/server/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start backend:
```bash
npm run dev
```

### 3) Setup frontend
```bash
cd ../client
npm install
npm run dev
```

Frontend default URL (Vite): `http://localhost:5173`

## Available Scripts

### Client (`/client`)
- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Server (`/server`)
- `npm run dev` - Start server with nodemon
- `npm start` - Start server with node
- `npm run seed` - Seed admin data

## Notes
- Client API base URL is currently configured in `client/src/utils/api.js`.
- Ensure backend URL configuration matches your local/deployment environment.

## Author
- **Usama Faheem**
- GitHub: [@usamafaheem-dev](https://github.com/usamafaheem-dev)
