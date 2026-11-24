## Environment Setup

Before running the project, configure the API connection:

1. Find the `.env.example` file in the project root.
2. Create a copy of that file.
3. Rename the copy to `.env.local`.
4. Open `.env.local` and configure the API URL:(paste the URL)

VITE_API_URL=https://ecommerce.coders.pragmatic.al

5. Install dependencies and start the project:

npm install
npm run dev

# CYBERMERCE

### A Cyberpunk E-Commerce Platform

CYBERMERCE is a React-based e-commerce application. It combines online shopping functionality with a futuristic cyberpunk-inspired design, using a dark interface with neon cyan and pink accents.

The application allows users to register, log in, browse products, manage their own inventory, add products to a shopping cart, complete purchases and track their orders.

## Features

### Authentication

- User registration and login.
- JWT-based authentication.
- Protected routes for authenticated users.
- Logout functionality.

### Product Marketplace

- Browse available products.
- View detailed product information.
- Search products by name or description.
- Filter products by minimum and maximum price.
- View product prices, descriptions, stock and seller information.
- Identify out-of-stock products.

### Product Management

- View your own products.
- Create new products.
- Edit existing products.
- Delete products with confirmation.
- Validate product information before submission.

### Shopping Cart and Checkout

- Add products from other sellers to the cart.
- Select product quantities.
- View individual item prices and total costs.
- Remove products from the cart.
- Check wallet balance before checkout.
- Complete purchases and update product stock and wallet balance.

### Orders and Profile

- View previous orders.
- Display order details, dates and totals.
- View account information and wallet balance.
- View products sold and purchased.
- Add funds to your wallet.

### User Interface

- Cyberpunk-inspired dark theme.
- Neon cyan and pink accents.
- Responsive layout for different screen sizes.
- Loading, success and error messages.
- Empty-state messages.
- Back to Top button.

## Technologies Used

- **React** – User interface development.
- **JavaScript** – Application functionality.
- **Vite** – Development environment and build tool.
- **React Router** – Navigation and routing.
- **Axios** – Communication with the backend API.
- **CSS** – Styling and responsive design.
- **REST API** – Backend communication.

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the project folder

```bash
cd ecommerce
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure the environment variable

Create a file named `.env.local` in the project's root folder and add:

```env
VITE_API_URL=https://ecommerce.coders.pragmatic.al
```

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access CYBERMERCE.

## Project Structure

```text
src/
├── api/           # API requests
├── components/    # Reusable components
├── context/       # Authentication context
├── pages/         # Application pages
├── App.jsx        # Main application routes
├── main.jsx       # Application entry point
└── index.css      # Global styling
```

## Design Concept

CYBERMERCE uses a futuristic cyberpunk visual identity inspired by neon-lit cities and digital marketplaces.

The interface primarily uses black and dark backgrounds, electric cyan as the main accent color and neon pink as a secondary accent. The goal is to create a modern shopping experience while keeping the interface readable and easy to navigate.

---

**CYBERMERCE — Enter the Cyber World.**
