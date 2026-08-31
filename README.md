# ⚡ SyncSheet — Real-Time Collaborative Spreadsheet

> **A real-time collaborative spreadsheet where multiple users can view, edit, and collaborate on the same data simultaneously.**

<p align="center">
  <strong>Built for collaboration. Designed for real-time interaction.</strong>
</p>

---

## 🚀 Overview

**SyncSheet** is a modern real-time collaborative spreadsheet application inspired by the collaborative experience of tools like Google Sheets.

The application allows multiple users to interact with the same spreadsheet simultaneously. Users can make changes in real time while also seeing which other users are currently active in the shared workspace.

The main challenge behind this project was not simply creating a spreadsheet interface — it was creating a collaborative experience where multiple users can interact with shared data at the same time.

### ✨ Core Idea

```text
User A edits Cell A1
        │
        ▼
   Real-Time Sync
        │
        ├──────────────► User B sees the update instantly
        │
        └──────────────► User C sees the update instantly

🎯 Why This Project?

Traditional spreadsheet applications focus on individual data entry.

SyncSheet focuses on collaboration.

The goal was to explore how modern applications handle:

👥 Multiple users interacting with the same application
⚡ Real-time synchronization
🔄 Shared application state
🟢 Live user presence
✏️ Simultaneous spreadsheet editing
🧩 Scalable and reusable frontend architecture

This project demonstrates how real-time collaboration can be integrated into a familiar spreadsheet interface.

✨ Key Features
👥 Real-Time Multi-User Collaboration

Multiple users can access and interact with the spreadsheet at the same time.

Changes made by one user can be synchronized with other active users, creating a shared collaborative workspace.

🟢 Live User Presence

The application provides visibility into active users.

Users can identify who else is currently present and interacting with the spreadsheet.

🟢 Prem Kumar
🟢 User 2
🟢 User 3

3 users currently collaborating

This creates a more interactive and collaborative experience compared to a traditional single-user spreadsheet.

✏️ Simultaneous Editing

Multiple users can edit spreadsheet data at the same time.

The application is designed around the concept of shared interaction rather than isolated user sessions.

┌──────────────┬──────────────┐
│ User A       │ Editing A1   │
├──────────────┼──────────────┤
│ User B       │ Editing B4   │
├──────────────┼──────────────┤
│ User C       │ Editing C2   │
└──────────────┴──────────────┘
⚡ Live Data Synchronization

Changes are reflected across the collaborative environment in real time.

This provides users with an experience closer to working together in the same document rather than working independently.

📊 Interactive Spreadsheet Interface

The project provides a spreadsheet-style environment designed for structured data interaction.

Users can work with shared data through an intuitive grid-based interface.

🏗️ Project Architecture

The project follows a modular structure to keep the application maintainable and scalable.

spreadsheet-app/
│
├── app/                # Application routes and pages
│
├── components/         # Reusable UI components
│
├── lib/                # Shared utilities and application logic
│
├── styles/             # Global and custom styles
│
├── types/              # TypeScript type definitions
│
├── public/             # Static assets
│
├── next.config.js      # Next.js configuration
├── tailwind.config.ts  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
Architecture Philosophy
                    ┌──────────────────┐
                    │      Users       │
                    └────────┬─────────┘
                             │
                             ▼
              ┌──────────────────────────┐
              │     Next.js Frontend     │
              │                          │
              │  Components + UI Logic   │
              └────────────┬─────────────┘
                           │
                    Real-Time Updates
                           │
                           ▼
              ┌──────────────────────────┐
              │   Shared Application     │
              │         State            │
              └────────────┬─────────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │     Active Users         │
              │     Live Spreadsheet     │
              └──────────────────────────┘
🛠️ Tech Stack
Technology	Purpose
⚛️ Next.js	Application framework
🔷 TypeScript	Type-safe development
🎨 Tailwind CSS	Modern UI styling
🧩 React Components	Reusable UI architecture
⚡ Real-Time Communication	Live collaboration and synchronization
🧠 Technical Challenges Explored

Building a collaborative application introduces challenges that are not present in traditional frontend applications.

This project explores concepts such as:

1. Shared State

Instead of each user maintaining completely independent data, the spreadsheet represents a shared collaborative state.

2. Real-Time Synchronization

When one user performs an action, other connected users need to receive the updated state without manually refreshing the application.

User Action
    │
    ▼
State Update
    │
    ▼
Real-Time Synchronization
    │
    ├──► Connected User A
    ├──► Connected User B
    └──► Connected User C
3. Multi-User Interaction

The application must account for multiple users interacting with the same environment.

This introduces challenges around:

Simultaneous edits
Shared data consistency
User presence
Real-time updates
Collaborative user experience
💻 Getting Started
Prerequisites

Make sure you have the following installed:

Node.js
npm
Installation
1. Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
2. Navigate to the project directory
cd YOUR_REPOSITORY
3. Install dependencies
npm install
4. Start the development server
npm run dev

Open your browser and visit:

http://localhost:3000
📂 Project Structure
app/

Contains the application's main routes and page-level logic.

app/
└── Application pages and routing
components/

Contains reusable UI components.

The component-based architecture helps keep the application modular and easier to maintain.

components/
├── Spreadsheet components
├── User interface components
└── Shared UI elements
lib/

Contains reusable utilities and application-level logic.

This helps separate business logic from presentation components.

types/

Contains TypeScript definitions used across the application.

Using centralized types improves:

Code readability
Maintainability
Type safety
Developer experience
🔄 How Collaboration Works

A simplified collaboration flow looks like this:

                ┌─────────────┐
                │   User A    │
                └──────┬──────┘
                       │
                       │ Edit Spreadsheet
                       ▼
              ┌───────────────────┐
              │   Sync Mechanism  │
              └─────────┬─────────┘
                        │
              ┌─────────┴──────────┐
              ▼                    ▼
        ┌──────────┐         ┌──────────┐
        │  User B  │         │  User C  │
        └──────────┘         └──────────┘

          Updates appear in real time

The objective is to create a shared experience where users are not working in isolation.

🚧 Future Improvements

This project provides a strong foundation for expanding the collaborative spreadsheet experience.

Potential improvements include:

🔐 User authentication
📁 Multiple spreadsheet documents
💾 Persistent spreadsheet storage
🕒 Version history
↩️ Undo / Redo functionality
💬 Real-time comments
👤 User avatars
🎨 Cell formatting
🔍 Search and filtering
📈 Charts and data visualization
📱 Improved mobile responsiveness
🧑‍🤝‍🧑 Advanced collaboration features
⚔️ Conflict resolution for simultaneous edits
🎓 What I Learned

Building this project helped me explore concepts beyond standard CRUD applications.

Some key areas include:

Designing reusable React components
Structuring a scalable Next.js application
Using TypeScript for better type safety
Building collaborative user experiences
Managing shared application state
Understanding real-time application workflows
Designing interfaces for simultaneous user interaction
💡 The Bigger Picture

Modern software is increasingly collaborative.

From:

Google Docs
Notion
Figma
Miro
Online IDEs

users now expect applications to support shared, live interaction.

SyncSheet is an exploration of that same concept applied to spreadsheets.

The project focuses on an important engineering question:

How can multiple users interact with the same data and feel as if they are working together in one shared environment?

👨‍💻 Author

Prem Kumar

Computer Science Student | Aspiring Software Development Engineer

Focused on building practical full-stack applications and exploring modern collaborative software systems.
