# Starter Club Reception App

## 📋 Overview

The **Starter Club Reception App** is a dual-interface web application designed to modernize the front-desk operations of "The Starter Club," a co-working and member community. It serves two distinct user groups:

1.  **Staff (Receptionists/Navigation Managers):** A powerful dashboard to onboard guests, manage member check-ins, book specialized rooms, and track operational metrics.
2.  **Members & Visitors (Self-Service Kiosk):** A touch-friendly tablet interface for frictionless self-check-in, room booking, and guest registration.

The app focuses on capturing actionable data for **CRA (Community Reinvestment Act) compliance** while enhancing the member experience through streamlined navigation and resource management.

---

## ✨ Key Features

### 🏢 Staff Interface
*   **Member Management:** Lookup members via ID, phone, or name manually if they forget their credentials.
*   **Concierge Onboarding:** specialized workflow for walk-ins that facilitates a warm handoff to a tour guide.
*   **Quick Logs:** Rapidly log delivery drivers, maintenance crews, and vendors without creating full profiles.
*   **Operational Dashboard:** Real-time visualization of daily visits, revenue, resource utilization, and compliance data.
*   **Visitor Registry:** A searchable, filterable log of all daily activity for security and auditing.

### 📱 Kiosk Interface (Self-Service)
*   **Quick Check-in:** A "One-Tap" path for members to log their arrival in under 10 seconds.
*   **Space Booking:** Members can browse, select, and book specialized workspaces (e.g., Deep Work Room, Podcast Studio) directly from the kiosk.
*   **Guest Triage:** Visitors can self-identify as tour requests, meeting guests, or quick drop-offs, routing them to the appropriate staff workflow.

### 🤖 AI Integrations (Gemini API)
*   **Smart Categorization:** Automatically classifies free-text work descriptions (e.g., "Working on Q3 projections") into standard business sectors (e.g., "Finance/Admin") for reporting.
*   **Compliance Analysis:** Simulates analyzing guest addresses to determine eligibility for CRA target zones.
*   **Dynamic Scripting:** Generates personalized welcome messages for staff based on member intent.

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **Build Tooling:** Vite (assumed based on standard React setups)
*   **Icons:** Lucide React
*   **Charts:** Recharts
*   **AI:** Google Gemini API (`@google/genai`)
*   **Data Persistence:** In-memory Mock Database (Simulating a Supabase/PostgreSQL backend)

---

## 🚀 Workflows

### 1. Member Check-in (Staff Assisted)
*Used when a receptionist helps a member at the desk.*

1.  **Identification:**
    *   **Scan:** Staff simulates scanning a digital pass.
    *   **Manual:** Staff searches by Member ID or Phone + Last Name.
2.  **Intent Capture:** "What's the mission today?"
    *   *Hang Out:* Logs visit immediately (No charge).
    *   *Work/Create:* Proceeds to booking.
3.  **Resource Selection:** Staff selects a specific room from categories:
    *   *Core Builders* (e.g., Strategy Room)
    *   *Creator* (e.g., Podcast Studio)
    *   *Super Stations* (e.g., Vision Engine Mac)
4.  **Booking:** Sets duration, calculates cost, and confirms check-in.

### 2. Kiosk Self-Check-in
*Used by members on a tablet.*

*   **Path A: Quick Check-in:**
    1.  Member taps "Quick Check-in".
    2.  Scans QR code.
    3.  System logs entry instantly.
*   **Path B: Book Space:**
    1.  Member taps "Book Space".
    2.  Scans QR code.
    3.  Selects intent (e.g., "Need to Focus").
    4.  Selects room & duration.
    5.  Confirms booking.
*   **Path C: Guest/New:**
    1.  Guest taps "I'm New Here".
    2.  Selects reason: "Tour", "Meeting", or "Quick Visit".
    3.  Enters name (and Host name if applicable).
    4.  System notifies staff or logs entry.

### 3. New Guest Intake (Concierge)
*Used for walk-ins interested in membership.*

1.  **Triage:** Staff selects "I'm New Here" -> "Interested in Membership".
2.  **Pitch:** Displays script reminding that membership is free.
3.  **Tour Setup:** Collects Guest Name and Tour Preference (Quick vs. VIP).
4.  **Handoff:** Logs guest and alerts the Concierge for a tour.

### 4. Quick Log
*Used for non-member operational traffic.*

1.  Staff selects category: *Delivery, Vendor, Employee, Contractor, etc.*
2.  **Details:**
    *   *Guest:* Logs Visitor Name + Host Name.
    *   *Vendor:* Logs Company + Rep Name.
3.  **Result:** Creates a lightweight security log entry.

---

## 📂 Project Structure

```
/
├── index.html              # Entry point
├── index.tsx               # React root
├── App.tsx                 # Main router/layout logic
├── types.ts                # TypeScript interfaces (Member, VisitRecord, etc.)
├── constants.ts            # Config data (Mock members, Room inventory, Prices)
├── components/
│   ├── Flows.tsx           # Core logic for Check-in, Kiosk, and Guest flows
│   ├── Dashboard.tsx       # Analytics visualization
│   └── VisitorLogs.tsx     # Data table of daily visits
└── services/
    ├── mockDatabase.ts     # In-memory data store service
    └── geminiService.ts    # AI integration logic
```

## 🔐 Setup & Installation

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Configure API Key:**
    *   Set `process.env.API_KEY` with a valid Google Gemini API key to enable AI features.
4.  **Run the development server:**
    ```bash
    npm start
    ```
