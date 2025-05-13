# Bowling Scorecard App 🎳

A bowling score calculator built with Angular (v19.2.0) and NgRx.
This app tracks and calculates scores frame by frame, handling strikes, spares, oepn frames, and the special logic of the 10th frame.
It includes unit test coverage for scoring engine, NgRx store, and component behaviours.

---

## Tech Stack

- **Angular CLI** v19.2.0
- **NgRx** for state management
- **Karma & Jasmine** for unit testing
- **Tailwind CSS** for UI styling (if applicable)

---

## Getting Started

### Prerequisites

- Node.js
- Angular CLI (`npm install -g @angular/cli`)

### Install dependencies

```bash
npm install
```

### Start development server

```bash
ng serve
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

### Building

Create a production-ready build:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Features
- Score calcualtion per frame
- Strike and spare handling
- Cumulative score tracking
- NgRx store: actions, reducers, selectors
- Unit-tested
- Responsive UI

## Project Structure
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       └── scoring.service.ts        # Score calculation logic
│   ├── store/
│   │   ├── actions/
│   │   ├── reducers/
│   │   ├── selectors/
│   │   └── state/
│   ├── components/
│   │   └── game-board/                   # UI for scoring interface
│   └── app.module.ts
