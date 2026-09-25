# FitLog

A sleek, dark-themed gym companion and workout tracker built to help athletes pick movements, log daily training sessions, and track their fitness progress efficiently.

---

## Technologies Used

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **Tailwind CSS**
- **Context API** (State Management & LocalStorage Persistence)
- **React Toastify** (Interactive Feedback & Alerts)
- **Next/Image** (Optimized Asset Delivery)

---

## Key Features

1. **Responsive 3x4 Workout Grid:** Fetches lifts from a remote API and presents them in an adaptable, modern card layout (up to a 3x4 grid on large screens).
2. **Dynamic Workout Details:** Displays individual exercise instructions, target muscle groups, equipment requirements, difficulty, and calories burned.
3. **Daily Workout Plan with 5-Lift Cap:** Allows users to schedule up to 5 daily workouts with real-time validation and alert toast notifications to prevent overtraining.
4. **Interactive Metrics & Calorie Tracking:** Automatically computes total training duration and aggregate calories burned across scheduled exercises.
5. **Progress Management & Task Completion:** Supports toggling workouts as complete ("Mark as Done"), sorting by calories/duration/rating, and saving routines for later sessions.