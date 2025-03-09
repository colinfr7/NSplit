
# NSplit UI-First Roadmap

This roadmap outlines a step-by-step plan to **first build out the UI** and **styling** for NSplit, then progressively add database connections, logic, and payment functionality.

## 1. Project Setup

1. **Initialize React + TypeScript Project**  
   - Use Create React App or Vite with TypeScript.  
   - Confirm folder structure (e.g., `src/`, `public/`, etc.).
2. **Install Tailwind CSS**  
   - Follow Tailwind's setup guide:
     1. `npm install -D tailwindcss postcss autoprefixer`
     2. Create `tailwind.config.js`
     3. Include Tailwind in your `index.css` or similar.

## 2. Basic UI & Navigation

1. **Set up a Router** (e.g., React Router)  
   - Pages:  
     - `Dashboard.tsx`  
     - `EventDetail.tsx`  
     - `CreateEvent.tsx`  
     - `CreatePayment.tsx`
2. **Create Nav Bar / Layout**  
   - A simple navigation menu or header to switch between pages.  
   - Apply basic Tailwind styles for a consistent look.

3. **Design Each Page**  
   - **Dashboard**: Placeholder for user's balance, list of events, buttons for "Create Event" and "Create Payment."  
   - **EventDetail**: Placeholder for a list of participants, expenses, and a "Settle Up" button.  
   - **CreateEvent**: A simple form to input event title, optional participants.  
   - **CreatePayment**: A form to record an expense/payment info.

4. **Use Tailwind**  
   - Add responsive classes (`flex`, `grid`, `p-4`, `m-4`, etc.).  
   - Keep it minimal but clean.

## 3. Database Setup & Integration (Incremental)

1. **Choose a DB**  
   - E.g., Firestore (NoSQL), Supabase, or simple REST backend.  
2. **Create Basic Schemas** (or Firestore Collections):  
   - `users`, `events`, `expenses`, etc.  
3. **Hook Up the Dashboard**  
   - Retrieve user info and a list of events from the DB.
   - Display them in the Dashboard.

4. **CreateEvent** / **CreatePayment** Connection  
   - Insert new records into `events` or `expenses` when forms are submitted.  
   - Return to the relevant page (Dashboard or EventDetail).

5. **EventDetail** Data Fetch  
   - Show actual participants, expenses, etc. from the DB.  
   - Update UI to reflect real data.

## 4. Payment Flows & Logic

1. **Implement Payment Links** (Basic Version)  
   - Generate a unique link for each payment request (e.g., `/pay/:paymentId`).  
   - Display key info (amount, payer, payee) on that page.

2. **Integrate Payment Methods (Optional Start)**  
   - Mock or placeholder: "Mark as Paid" button that updates DB.  
   - Later: Connect to actual payment gateway, crypto wallets, etc.

3. **Settling Up / Minimizing Transactions**  
   - Implement or integrate a **min-cash-flow** algorithm in the backend or in a `utils` file.  
   - Add a "Settle Up" button on EventDetail to show who pays whom.

## 5. Additional Features & Refinements

1. **Auth**  
   - Add a "Sign in with Google" or "Login with Discord" button.  
   - Keep the flow simple: once logged in, fetch the user's events and display them.

2. **QR Code Integration**  
   - On the "CreatePayment" flow, generate a QR code linking to the relevant payment or "join event" page.  
   - Let others scan to automatically join or confirm expense participation.

3. **Discord Notifications**  
   - Create a small Discord bot or use a webhook to post payment reminders.

4. **Testing & Edge Cases**  
   - Ensure "paid" statuses can't be double-updated.  
   - Handle bar payments, partial payments, etc. if desired.

## 6. Deployment

1. **Deploy Frontend**  
   - E.g., Vercel, Netlify, or a static hosting platform of choice.  
2. **Deploy Backend (if separate)**  
   - E.g., Firebase Functions, Supabase, or Node.js on a hosting service.  
3. **Update Config**  
   - Make sure production URLs are added to OAuth settings (Google, Discord).  
   - Update any environment variables (API keys).

## 7. Next Steps & Polish

- **UI/UX Cleanup**: Fine-tune Tailwind design, handle mobile views.  
- **Notification System**: Email or push notifications for due payments.  
- **Crypto Implementation**: Connect to a real wallet or payment processor.  
- **Analytics & Logging**: Track user activity, errors, usage.  
- **Security**: Ensure only event participants can view or edit that event's data.

## Current Progress

- ✅ Project Setup
- ✅ Basic UI & Navigation
- ✅ Core Pages (Dashboard, EventDetail)
- ⏳ Forms (CreateEvent, AddPayment)
- ⏳ Database Integration
- ⏳ Payment Logic
- ⏳ Additional Features
