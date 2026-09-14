# HelpDesk

An IT Support Ticket Management System built with ASP.NET Core Web API.

## Overview

HelpDesk is a backend API for managing IT support tickets within an organization.

Employees can create and track their support tickets, while Support Agents can manage and resolve tickets. Administrators can manage users and roles.

## Features

- User registration and login
- JWT-based authentication
- Role-based authorization
- Employee, SupportAgent, and Admin roles
- Ticket creation and management
- Ticket status and priority
- Ticket assignment
- Ticket comments
- Employee ticket ownership protection
- Admin user management
- Admin role management
- Pagination and filtering
- Input validation
- SQL Server database with Entity Framework Core

## Tech Stack

- C#
- ASP.NET Core Web API
- .NET 10
- Entity Framework Core
- SQL Server
- ASP.NET Core Identity
- JWT Authentication
- Git & GitHub

## Architecture

```text
Client
   |
   | HTTPS / REST API
   v
ASP.NET Core Web API
   |
   | Entity Framework Core
   v
SQL Server

User Roles

Role	Permissions

Employee	Create and view own tickets, add comments
SupportAgent	View, update, assign and manage tickets
Admin	Full ticket access and user/role management


API Areas

Authentication

POST /api/Auth/register
POST /api/Auth/login
GET  /api/Auth/employee-only

Tickets

GET    /api/Tickets
GET    /api/Tickets/{id}
POST   /api/Tickets
PUT    /api/Tickets/{id}
PUT    /api/Tickets/{id}/assign
DELETE /api/Tickets/{id}
POST   /api/Tickets/{id}/comments
GET    /api/Tickets/{id}/comments

Users

GET /api/Users
PUT /api/Users/{userId}/role

Running Locally

1. Clone the repository.
2. Open the solution in Visual Studio.
3. Configure the local SQL Server connection.
4. Configure JWT secrets using ASP.NET Core User Secrets.
5. Apply Entity Framework Core migrations.
6. Run the ASP.NET Core API.
7. Use the .http file or an API client such as Postman to test the endpoints.

Security

Sensitive configuration such as the JWT signing key is stored using ASP.NET Core User Secrets during local development and is not committed to the repository.

Future Improvements

- React frontend
- AWS deployment
- File attachments using Amazon S3
- AWS RDS database
- CloudWatch monitoring
- Dashboard and reporting
- AI-assisted ticket classification and support

Status

 Backend API development in progress.