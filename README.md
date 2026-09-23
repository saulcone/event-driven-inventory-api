# Product Management System

Full-stack web application for managing food inventory, products, sales metrics, and user access through role-based permissions.

## Overview

The application provides:

* Dashboard with inventory and sales metrics
* Product catalog with search, sorting, and pagination
* Product editing and deletion
* JWT-based authentication
* Role-based access control (RBAC)
* User management for administrators
* English and Swiss German (`de_CH`) language support
* Dockerized development environment

## Features

### Dashboard

* Total products
* Total products sold
* Inventory overview
* Best-selling products
* Low-stock information

### Product Management

* Product listing
* Searching
* Server-side pagination
* Sorting by name and price
* Product editing
* Product deletion
* Form validation
* Role-based write permissions

### Authentication & Authorization

Authentication is handled using JWT tokens.

The application supports three roles:

| Role     | Permissions                                                |
| -------- | ---------------------------------------------------------- |
| `admin`  | Full system access, including user management              |
| `staff`  | View the application and create/update/delete product data |
| `viewer` | Read-only access to Dashboard and Products                 |

### User Management

Administrators can access the user management functionality and view registered users.

## Tech Stack

### Backend

* Python 3.11
* Django 5
* Django Ninja
* PyJWT

### Frontend

* React 19
* TypeScript
* Vite
* Material UI (MUI)
* Axios
* React Router

### Database

* PostgreSQL 16

### Infrastructure

* Docker
* Docker Compose

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Docker
* Docker Compose

### Run the application

Inside the repository folder, run the docker compose command:

```bash
docker compose up --build
```

Once the containers are running, the application is available at:

* **Frontend:** http://localhost:5173
* **API:** http://localhost:8000
* **API Documentation:** http://localhost:8000/api/docs
* **Django Admin:** http://localhost:8000/admin

## Seed Data

The project includes management commands for creating sample users and products.

### Seed users

```bash
docker compose exec backend python manage.py seed_users
```

This data is predefined, unlike products. These are randomly generated with realistic parameters.

### Seed products

```bash
docker compose exec backend python manage.py seed_products --count 50
```

You can use the argument --count to choose how many random products to create.

## Demo Accounts

The seeded accounts use the password:

```text
password123
```

| Role   | Email              | Access                                 |
| ------ | ------------------ | -------------------------------------- |
| Admin  | `admin1@example.com`  | Full system access + user management   |
| Staff  | `staff1@example.com`  | Product management + dashboard         |
| Viewer | `viewer1@example.com` | Read-only dashboard and product access |

## API Endpoints

### Authentication & Users

| Method | Endpoint             | Description                          |
| ------ | -------------------- | ------------------------------------ |
| `POST` | `/api/auth/login`    | Authenticate a user and obtain a JWT |
| `POST` | `/api/auth/register` | Register a new user                  |
| `GET`  | `/api/auth/me`       | Get the current authenticated user   |
| `GET`  | `/api/auth/users`    | List users (Admin only)              |

### Products

| Method   | Endpoint                  | Description                                        |
| -------- | ------------------------- | -------------------------------------------------- |
| `GET`    | `/api/products/`          | List products with search, pagination, and sorting |
| `GET`    | `/api/products/summary`   | Get aggregated dashboard metrics                   |
| `GET`    | `/api/products/most-sold` | Get the top five best-selling products             |
| `GET`    | `/api/products/{id}`      | Get a product by ID                                |
| `PUT`    | `/api/products/{id}`      | Update a product (Staff/Admin)                     |
| `DELETE` | `/api/products/{id}`      | Delete a product (Staff/Admin)                     |

## Project Structure

```text
application/
├── backend/
│   ├── core/                 # Django configuration, URLs, and API setup
│   ├── products/             # Product models, schemas, endpoints, and seeders
│   ├── users/                # User model, authentication, and authorization
│   ├── requirements.txt      # Python dependencies
│   └── Dockerfile            # Backend container definition
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Shared UI components and layout
│   │   ├── context/          # Authentication and language contexts
│   │   ├── pages/            # Application pages
│   │   └── services/         # API clients and service functions
│   ├── package.json          # Frontend dependencies
│   └── Dockerfile            # Frontend container definition
│
└── docker-compose.yml        # Database, backend, and frontend orchestration
```

## Disclaimer

This project is a generic product and inventory management application.
