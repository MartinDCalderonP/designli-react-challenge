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

## Implementaciones que exceden el Challenge

Este proyecto incluye algunas características y desarrollos que exceden los requerimientos originales del challenge:

- **Indicador de conexión**: Se muestra en la interfaz si la aplicación está conectada o no al WebSocket/API en tiempo real.
- **Selector y persistencia de tema (claro/oscuro)**: El usuario puede alternar entre tema claro y oscuro, y la preferencia se guarda para futuras sesiones.
- **Funciones avanzadas con objetos**: Se implementaron funciones adicionales que manipulan y gestionan objetos de manera más compleja de lo solicitado.
- **Más hooks personalizados**: Se crearon hooks personalizados extra para mejorar la modularidad y reutilización del código, más allá de lo estrictamente necesario para cumplir el challenge.
- **Hook de filtrado de stocks por rango de tiempo**: Se creó el hook `useFilteredStocks`, que encapsula la lógica para filtrar el historial de precios de las acciones según el período seleccionado en el gráfico. Además, centraliza y exporta los valores de rango de tiempo disponibles para su reutilización.

Estas adiciones buscan demostrar buenas prácticas, escalabilidad y robustez en la arquitectura del proyecto.

## Selección de período en el gráfico

El gráfico de precios ahora permite seleccionar el período de tiempo a visualizar: 1 hora, 1 día, 1 semana, 1 mes o todo el historial. Los botones de selección filtran los datos mostrados en el gráfico en tiempo real, mejorando la experiencia de análisis para el usuario.
