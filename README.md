<h1 align="center">
  📦 BiteBox 
  <br>
  <span style="font-size: 0.6em; font-weight: normal;">Modern Full-Stack Food Ordering Platform</span>
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django" />
  <img src="https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap" />
</p>

<p align="center">
  A responsive, feature-rich online food ordering system designed for seamless user experience and robust administrative control. Built with a decoupled architecture using React.js and Django REST Framework.
</p>

---

## 📑 Table of Contents
- [🚀 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📷 Screenshots](#-screenshots)
- [⚙️ Installation & Setup](#️-installation--setup)
- [📁 Project Structure](#-project-structure)
- [👨‍💻 Author](#-author)

---

## 🚀 Features

### 🍔 Customer Experience
- **Secure Authentication:** User registration, login, and secure session management using JWT.
- **Dynamic UI:** Auto-sliding promotional carousels, responsive navigation, and modern custom icons.
- **Smart Browsing:** Search functionality and category-based menu filtering.
- **Seamless Shopping:** Interactive shopping cart, wishlist management, and secure checkout.
- **Profile Management:** Update personal details, change passwords, and track past orders.

### 🛡️ Admin Dashboard
- **Centralized Management:** Full CRUD control over Categories, Menu Items, and Customers.
- **Order Tracking:** Real-time visibility and management of incoming orders.
- **Analytics & Reporting:** Generate and analyze detailed Sales and Order reports.
- **Data Export:** Instantly export reports to **PDF** or **Excel** formats.

---

## 🛠 Tech Stack

**Frontend:**
- React.js (Hooks, Context)
- React Router DOM (Protected Routes)
- Bootstrap 5 & Custom CSS
- Axios (API Integration)
- React Icons & React Toastify

**Backend:**
- Python 3.x
- Django & Django REST Framework (DRF)
- SimpleJWT (Token Authentication)
- MySQL Database
- ReportLab & OpenPyXL (PDF/Excel Generation)

---

## 📷 Screenshots

<details>
  <summary><b>Click to expand and view screenshots</b></summary>
  <br>
  
  ### 🏠 Home Page
  ![Home 1](screenshots/home1.png)
  ![Home 2](screenshots/home2.png)
  ![Home 3](screenshots/home3.png)
  
  ### 🔐 Authentication
  ![Login](screenshots/login.png)
  
 ### 🍽️ Menu
![Menu Management](screenshots/menu1.png)
### 🛒 Shopping Cart
![Cart](screenshots/cart.png)

### 💳 Checkout
![Checkout 1](screenshots/checkout.png)
![Checkout 2](screenshots/checkout2.png)

### 💰 SSLCOMMERZ Payment
![Payment](screenshots/payment.png)

### ✅ Order Success
![Order Success](screenshots/ordersuccess.png)

### 👤 User Orders
![My Orders](screenshots/myorder.png)

### 📊 Admin Dashboard
![Dashboard](screenshots/admindashboard.png)

### 📊 Sales Report
![Sales Report](screenshots/salesreport.png)

### 📦 Order Report
![Order Report](screenshots/orderreport.png)

</details>

---

## ⚙️ Installation & Setup

Follow these instructions to get a local copy of BiteBox up and running on your machine.

### 1. Clone the repository
```bash
git clone [https://github.com/abidhasan2422/Food-Ordering-System.git](https://github.com/abidhasan2422/Food-Ordering-System.git)
cd Food-Ordering-System

Backend Setup:
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate      # On Windows
# source venv/bin/activate # On Mac/Linux

# Install required Python packages
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Django development server
python manage.py runserver

Frontend Setup:
cd frontend

# Install Node modules
npm install

# Start the React development server
npm run dev

📁 Project Structure
BiteBox/
│
├── backend/                  # Django REST API
│   ├── manage.py
│   ├── requirements.txt      # Python dependencies
│   └── .gitignore            # Ignores venv/, sqlite3, pycache
│
├── frontend/                 # React.js UI
│   ├── src/
│   ├── package.json
│   └── .gitignore            # Ignores node_modules/, dist/
│
├── screenshots/              # Demo images
├── .gitignore                # Root ignore (IDE settings, etc.)
└── README.md                 # Project documentation


👨‍💻 Author
Abid Hasan Likhon

LinkedIn:https://www.linkedin.com/in/md-abid-hasan-likhon-0b6402321/

GitHub: https://github.com/abidhasan2422

