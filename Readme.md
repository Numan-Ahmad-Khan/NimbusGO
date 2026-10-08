# NimbusGO

NimbusGO is a full-stack logistics and parcel delivery project built to explore how a delivery management system can be designed and implemented using modern web technologies.

The project includes a customer interface, rider interface, admin interface, backend REST APIs, database management, payment integration, shipment tracking, and a public API for third-party tracking.

This is a development project and is not intended to represent a production-ready logistics service.

## About the Project

The main idea behind NimbusGO is to build a system where a user can create a shipment order, make a payment, and track the shipment while administrators and riders manage the delivery process.

The project also includes a public tracking API that demonstrates how external applications could access shipment tracking information using an API key.

---

## Main Parts

NimbusGO is divided into three main areas:

### Customer

Customers can:

- Create an account
- Verify their account using OTP
- Log in
- Manage their account
- Add delivery addresses
- Preview an order
- Create shipment orders
- Apply coupons
- Make payments
- View their orders
- Track their shipments

### Rider

Riders can:

- Register and verify their account
- Log in
- View assigned orders
- Manage assigned deliveries
- Update delivery progress

### Admin

Administrators can:

- Log in
- View users
- View orders
- View order details
- Change order status
- Manage shipment checkpoints
- Manage delivery rates
- Manage coupons
- Manage riders and other administrative data

---

## Public Tracking API

NimbusGO also contains a public tracking API for external applications.

The API allows a third-party application to request the tracking information of an order using an API key.

Example endpoint:

```
GET /api/v1/tracking/:orderId
```

The endpoint uses API-key authentication and API-specific rate limiting.

## Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- JavaScript

### Database

- PostgreSQL
- Sequelize

### Other Technologies

- Redis
- Razorpay
- Nodemailer
- JWT
- bcrypt
- Zod

## Backend

The backend is built with Node.js and Express.

It provides the APIs used by the frontend and also contains the logic for authentication, orders, payments, users, riders, administrators, tracking, and other functionality.

## Frontend

The frontend is built using React and Vite.

It provides separate interfaces for:

- Customers
- Riders
- Administrators

The frontend communicates with the backend through REST APIs.

---

## Project Purpose

NimbusGO was built as a learning and development project to gain practical experience with:

- Full-stack web development
- REST API development
- React
- Node.js and Express
- PostgreSQL
- Sequelize
- Authentication and authorization
- Payment integration
- Redis
- API security
- Shipment tracking
- Third-party API design

The project is primarily intended to demonstrate the implementation of these concepts in a single full-stack application.

---

## Status

NimbusGO is an ongoing personal development project.

Features may change, and parts of the application may be modified or expanded as development continues.

## License

NimbusGO is licensed under the [MIT License](https://app.notion.com/LICENSE).

See the [`LICENSE`](https://app.notion.com/LICENSE) file in the root of the repository for the complete license terms.