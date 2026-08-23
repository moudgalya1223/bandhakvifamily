# Bandhakavi Family Hierarchy & Educational Trust Application

A full-stack Next.js (App Router) application built for the **Bandhakavi Family Vamsha Tree & Educational Trust**, integrated with **Firebase (Auth & Firestore)** and **Tailwind CSS**.

## Features

- **Interactive Family Tree**: Real-time asynchronous genealogy hierarchy visualizer grouped by generations.
- **Strict Sign-Up & Admin Approval**:
  - Sign-Up with mandatory validations for Name, Age, Gender (Radio), Gotra, Mail ID, Phone, and Relation to Bandhakavi hierarchy.
  - Automatic email notifications dispatched to applicant and Master Admin (`dattu99amm@gmail.com`).
  - Account login blocked until Master Admin approves the registration.
- **Admin Dashboard**: Review pending applications, approve/reject access, and inspect real-time email logs.
- **About Moudgalya Gotra**: Historical origins, Rigveda Mandala X Hymn 102 details, Tri-Rishi Pravara (*Angirasa*, *Bharmyasva*, *Moudgalya*), and ancestral Rishi visual cards.
- **Bandhakavi Educational Trust**: Overview of scholarship funds, manuscript archiving, annual family reunions, and expandable management board.
- **Seva Donation Portal**: Voluntary contribution form with amount presets (₹1116, ₹2500, ₹5008, ₹11116), cause selection, payment methods, and live donor leaderboard.

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/moudgalya1223/bandhakvifamily.git
   cd bandhakvifamily
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Built With

- **Next.js 14+ / 16 (App Router)**
- **React 18 / 19**
- **TypeScript**
- **Tailwind CSS**
- **Firebase Auth & Firestore**
- **Lucide React Icons**
