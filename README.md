# Phae - Expense Tracker

A modern, local-first expense tracker built with React, Tailwind CSS, and Recharts. Designed to help you track spending habits, visualize categories, and maintain financial streaks without selling your data.

## Features

-   **Dashboard**: Overview of monthly spending, weekly breakdown, and current streak.
-   **Add Expense**: Quick entry modal with amount, category selection, date picker, and notes.
-   **Visualizations**:
    -   Category Breakdown (Pie Chart)
    -   Top Spending Categories (Bar Chart)
    -   Monthly Trend (Area Chart)
-   **Expense Management**: View all expenses with filtering, sorting, and search. Edit or delete entries.
-   **Streaks & Engagement**: Track consecutive days of logging expenses.
-   **Local First**: All data is stored in your browser's LocalStorage. No account required, no server tracking.
-   **Responsive Design**: Works on desktop, tablet, and mobile.
-   **Dark Mode**: Sleek dark interface.

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

## Project Structure

-   `src/components`: UI components organized by Atomic Design (atoms, molecules, organisms).
-   `src/hooks`: Custom hooks for data logic (`useExpenses`, `useStreak`).
-   `src/pages`: Top-level page components.
-   `src/utils`: Helper functions for storage and calculations.

## Deployment

This app is a static site and can be deployed easily to Vercel, Netlify, or GitHub Pages.

1.  Run `npm run build`
2.  Deploy the `dist` folder.
