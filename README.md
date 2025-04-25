# Designli React Challenge

This project is a React application (TypeScript + Vite) for real-time stock data visualization using the Finnhub API. It features modular architecture, PWA support, push notifications, and modern best practices.

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Architecture & Technical Decisions](#architecture--technical-decisions)
- [Project Structure](#project-structure)
- [Features](#features)
- [PWA & Notifications](#pwa--notifications)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)

## Introduction

Challenge: Build a React (TypeScript) app to display real-time stock data using Finnhub, with price alerts, chart visualization, and PWA support with push notifications.

## Getting Started

### Prerequisites

- Node.js v16+
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd designli-react-challenge
   pnpm install
   ```
2. Start the app:
   ```bash
   pnpm dev
   ```
   Visit `http://localhost:5173`.

## Architecture & Technical Decisions

- **Componentization**: Each main feature is separated into reusable components (StockCards, StockChart, StockForm, etc).
- **Context API**: Contexts manage global state for stocks, theme, and API Key (in `src/contexts`).
- **Custom Hooks**: Reusable, decoupled logic (e.g., WebSocket connection, localStorage, notification permissions, symbol fetching).
- **Services**: `src/services/socketService.ts` abstracts WebSocket connection and real-time data handling.
- **PWA**: Full support with manifest, service worker, and offline storage for stock data.
- **Push Notifications**: The service worker sends notifications when a stock drops below the alert price.
- **SOLID & Best Practices**: Modular code, pure functions, separation of concerns, and strict TypeScript usage.

## Project Structure

```
eslint.config.js
index.html
package.json
vite.config.ts
public/
  manifest.json, sw.js, icon-*.png
src/
  App.tsx, App.module.css, main.tsx, index.css
  types.ts, vite-env.d.ts
  components/
    BaseButton/
    Header/
    NotificationButton/
    StockCards/
    StockChart/
    StockForm/
      AddStocksForm.tsx
      ApiKeyForm.tsx
      index.tsx
      styles.module.css
    ToggleThemeButton/
  contexts/
    ApiKeyProvider.tsx, StockProvider.tsx, ThemeProvider.tsx
  hooks/
    useApiKey.ts, useFetchSymbols.ts, useLocalStorage.ts, useNotificationPermission.ts, useSocketConnection.ts, useStockChart.ts, useStocks.ts, useTheme.ts, useFilteredStocks.ts
  services/
    serviceWorker.ts, socketService.ts
```

## Features

- **Stock selection & alerts**: AddStocksForm lets you choose a stock and set a price alert. ApiKeyForm manages the Finnhub API key input.
- **Stock cards**: Show name, value, and percentage change. Green/red color based on alert.
- **Real-time chart**: Visualizes historical values for all added stocks.
- **Live updates**: WebSocket with Finnhub for instant data.
- **Offline persistence**: Data is saved in localStorage for fast load and offline use.
- **Push notifications**: Alert when a stock drops below the defined price. The alert is sent again only if the price crosses the threshold once more (i.e., after recovering above and then dropping below the alert value again).
- **Light/dark theme**: Global theme toggle.

## PWA & Notifications

- **PWA**: Installable on devices, offline loading, and cached resources.
- **WebSocket in background**: The service worker keeps the connection and stores data in localStorage.
- **Notifications**: When a stock price drops below the alert, a push notification is sent (requires user permission).

## Available Scripts

- `pnpm dev`: Start the development server.
- `pnpm build`: Build the app for production.
- `pnpm preview`: Preview the production build.
- `pnpm lint`: Run the code linter.

## Dependencies

- React, TypeScript, Vite
- Others: vite-plugin-pwa, Finnhub API, ESLint, Lucide Icons, etc.

## Implementations that Exceed the Challenge

This project includes some features and developments that go beyond the original requirements of the challenge:

- **Connection indicator**: The interface shows whether the application is connected to the WebSocket/API in real time.
- **Theme selector and persistence (light/dark)**: The user can toggle between light and dark themes, and the preference is saved for future sessions.
- **Advanced object functions**: Additional functions were implemented to manipulate and manage objects in a more complex way than requested.
- **More custom hooks**: Extra custom hooks were created to improve code modularity and reusability, beyond what was strictly necessary to meet the challenge.
- **Stock filtering hook by time range**: The `useFilteredStocks` hook was created, encapsulating the logic to filter the price history of stocks according to the selected period in the chart. It also centralizes and exports the available time range values for reuse.

These additions aim to demonstrate best practices, scalability, and robustness in the project architecture.

## Chart Period Selection

The price chart now allows you to select the time period to display: 1 hour, 1 day, 1 week, 1 month, or the entire history. The selection buttons filter the data shown in the chart in real time, improving the user's analysis experience.
