# Database - Project Milestone 1

# Project Title: Grocery Management

# System (GMS)

# Submitted by:

## Muhammad Saad Ali (Roll No: BSE-F23-E25),

## Qalab-e-Abbas (Roll No: BSE-F23-E24)

## UNIVERSITY OF MIANWALI


## 1. Introduction

The Grocery Management System (GMS) is a database-driven software project designed to
help small grocery stores handle core operations, including inventory, sales, and supplier
tracking, in a single digital platform. The project is relevant because it aims to replace slow,
messy, manual, paper-based systems with a reliable digital solution, significantly improving
efficiency, reducing errors, and providing managers with clear data for better decision-making.

## 2. Problem Statement

Small grocery businesses currently suffer from critical inefficiencies due to the lack of a reliable,
centralized platform. The primary problems the GMS will address are:

1. Inaccurate Inventory: Manual tracking leads to stock count errors, causing lost sales
    (running out of popular items) or financial waste (holding excess stock).
2. Slow and Error-Prone Checkout: Old systems increase checkout times and calculation
    mistakes, frustrating customers.
3. Supplier Chaos: Tracking orders, comparing prices, and identifying reorder needs is
    inefficient without a centralized system.
4. Lack of Quick Reports: Managers struggle to generate clear reports on sales
    performance, busy periods, or profits, hindering strategic planning.
    The project's goal is to implement one single, reliable Database System to solve these
    issues by centralizing and automating all core operational data.

## 3. Objectives

The primary goals of the project are:

```
● To design a solid database schema that reliably stores all essential store data: products,
sales history, stock levels, suppliers, and staff.
● To build real-time inventory tracking that updates immediately upon sale and
automatically flashes a warning when stock runs low.
● To create a fast and accurate Point-of-Sale (POS) screen to streamline the cashier
process.
● To develop a complete supplier tool that automatically generates the perfect reorder list
based on sales and stock levels.
● To enable simple reports that provide management with essential data on overall sales
and stock movement.
```
## 4. Scope

The key features and functionalities of the GMS will focus on core in-store operations.

Key Features:

```
● Stock Management: Adding, changing, or removing products; updating counts; and linking
items to suppliers.
```

```
● Sales/Billing (POS): Recording and finalizing all customer purchases.
● Supplier List: Detailed records of suppliers and order history.
● Staff Access: Secure login with Manager and Cashier permissions.
● Simple Reports: Generating quick summaries like daily/monthly sales.
```
Limitations:

```
● The project will not include an online store.
● The project will not include complex smart analytics (like sales forecasting).
● The project will not include direct connection to external services (like bank credit card
processors).
● The project will not include a mobile application.
```
## 5. Data Collection

To ensure the database is realistic and testable, data will be collected through two primary
methods:

1. Observation and Review: Using existing knowledge of grocery store operations and
    reviewing course materials and industry standards to define initial product rules,
    categories, and business logic.
2. Synthesized Test Data: The team will create realistic fake records for suppliers,
    customers, various products, and generate a large volume of simulated sales transactions
    to populate and stress-test the database and its reporting features.

## 6. Technology Stack

The following tools and technologies are selected for this project:

```
Component Technology Rationale
Database System MySQL Reliable, open-source, and
standard for handling
transactions.
Design Tool MySQL Workbench /
Draw.io
```
```
For visual mapping and
creating the Entity-
Relationship Diagram (ERD).
Implementation Language SQL The required language for
database definition and
manipulation.
App Interface (Later
Phases)
```
### FRONTED: HTML, CSS, JS

```
BACKEND: PHP / Python
Flask / Node.js (TBD)
```
```
Frontend will be user-friendly
and for backend one will be
chosen for the backend
application logic to connect
the user interface to the
database.
```

## 7. System Functionality

The database system will offer the following key features to its users, allowing for the insertion,
updating, and querying of data in real-time:

```
● Store Manager Functions: Manage stock (add new products, change prices), and access
reports (view monthly sales totals, check low-stock items).
● Cashier/POS Operator Functions: Handle sales (quickly record sold items, process
payments), which immediately updates the inventory.
● Purchasing Agent Functions: Order stock (find supplier details, view a calculated list of
stock needing reorder).
```
## 8. Task Division

The project is being completed by a group of two, with clear roles and responsibilities:

```
Team Member Role Primary Responsibilities
Muhammad Saad Ali Database Architect Responsible for designing the
database, keeping it
organized, writing main SQL
queries, and setting up stored
procedures and triggers.
Qalab-e-Abbas Requirements Analyst Responsible for meeting
system requirements,
managing the database
connection with the app,
creating test data, and
performing final system
testing and verification
```
## 9. Conclusion

The Grocery Management System will successfully address the existing operational problems
by centralizing data, improving accuracy, and enhancing efficiency in stock and sales
management. We are confident this system will be a significant boost to store operations and
serve as a comprehensive, practical demonstration of the concepts learned in the database
systems course.

## 10. References

```
● Online tutorials and documentation for MySQL, PHP, and Flask.
● University course materials for Database Systems.
● Draw.io online ER diagram examples.
```

## 11. AI Prompts (Appendix 1)

AI Tool Used: Gemini

```
Date Prompt Used Purpose
Oct 19, 2025 "template of a report" Used to generate the initial
structure and a well formatted
template for a report.
Oct 19, 2025 "best easiest reliable tech
stack"
```
```
Used to find suggestions for
the Database and Backend
technologies for the project.
Oct 19, 2025 "how project should be
made"
```
```
Used for guidance on the
overall project flow, structure,
and division of tasks.
Oct 19, 2025 “scope of grocery
management database
system”
```
```
Used to find out the scope of
the project.
```

