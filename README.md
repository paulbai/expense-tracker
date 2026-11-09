# Phae — Expense Tracker

A modern, local-first expense tracker built with React, Tailwind CSS, and Recharts. Designed to help you track spending habits, visualize categories, and maintain financial streaks without selling your data.

## Features

-   **Dashboard**: Overview of monthly spending, weekly breakdown, current streak, and recent expenses.
-   **Add Expense**: Accessible quick-entry modal with amount, category, date shortcuts, and notes.
-   **Visualizations**:
    -   Category Breakdown (Pie Chart)
    -   Top Spending Categories (Bar Chart)
    -   Monthly Trend (Area Chart)
-   **Expense Management**: Search, multi-category filter, date ranges, sorting, edit, and delete entries.
-   **Preferences**: Select a default currency, date format, start of week, and one of nine themes.
-   **Data Control**: Export a CSV or reset Phae directly from Settings.
-   **Streaks & Engagement**: Accurate consecutive-day streaks derived from expense history.
-   **Local First**: All data is stored in browser storage. No account, remote storage, or analytics.
-   **Reminders**: Optional browser reminders while Phae is open; use the Settings test button to confirm browser permission.
-   **Responsive Design**: Works on desktop, tablet, and mobile with keyboard-accessible controls.

## Tech Stack

-   **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Charts**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Date Handling**: [date-fns](https://date-fns.org/)

## Getting Started

1.  **Clone the repository** (if applicable)
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start development server**:
    ```bash
    npm run dev
    ```
4.  **Build for production**:
    ```bash
    npm run build
    ```
5.  **Run checks**:
    ```bash
    npm run lint
    npm test
    ```

## Project Structure

-   `src/components`: UI components organized by Atomic Design (atoms, molecules, organisms).
-   `src/hooks`: Custom hooks for data logic (`useExpenses`, `useStreak`).
-   `src/pages`: Top-level page components.
-   `src/utils`: Helper functions for storage and calculations.

## Deployment

This app is a static site and can be deployed to Vercel or another static host.

1.  Run `npm run build`
2.  Deploy the `dist` folder.

Social preview tags in `index.html` point to the production URL, https://expense-tracker-phae.vercel.app. Update them if the domain changes.
