"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Holding = {
  symbol: string;
  shares: number;
  averageCost: number;
};

export type PriceAlert = {
  id: string;
  symbol: string;
  target: number;
  direction: "above" | "below";
};

type MarketState = {
  isAuthenticated: boolean;
  selectedSymbol: string;
  recentSearches: string[];
  watchlist: string[];
  holdings: Holding[];
  alerts: PriceAlert[];
  loginGuest: () => void;
  logout: () => void;
  setSelectedSymbol: (symbol: string) => void;
  toggleWatchlist: (symbol: string) => void;
  addHolding: (holding: Holding) => void;
  removeHolding: (symbol: string) => void;
  addAlert: (alert: Omit<PriceAlert, "id">) => void;
  removeAlert: (id: string) => void;
};

export const useMarketStore = create<MarketState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      selectedSymbol: "AAPL",
      recentSearches: ["AAPL", "MSFT", "TSLA"],
      watchlist: ["AAPL", "MSFT", "NVDA"],
      holdings: [
        { symbol: "AAPL", shares: 8, averageCost: 172 },
        { symbol: "MSFT", shares: 4, averageCost: 395 }
      ],
      alerts: [],
      loginGuest: () => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
      setSelectedSymbol: (symbol) =>
        set((state) => {
          const normalized = symbol.toUpperCase();
          return {
            selectedSymbol: normalized,
            recentSearches: [normalized, ...state.recentSearches.filter((item) => item !== normalized)].slice(0, 8)
          };
        }),
      toggleWatchlist: (symbol) =>
        set((state) => {
          const normalized = symbol.toUpperCase();
          return {
            watchlist: state.watchlist.includes(normalized)
              ? state.watchlist.filter((item) => item !== normalized)
              : [normalized, ...state.watchlist]
          };
        }),
      addHolding: (holding) =>
        set((state) => ({
          holdings: [holding, ...state.holdings.filter((item) => item.symbol !== holding.symbol)]
        })),
      removeHolding: (symbol) =>
        set((state) => ({
          holdings: state.holdings.filter((item) => item.symbol !== symbol)
        })),
      addAlert: (alert) =>
        set((state) => ({
          alerts: [{ ...alert, id: crypto.randomUUID() }, ...state.alerts]
        })),
      removeAlert: (id) =>
        set((state) => ({
          alerts: state.alerts.filter((item) => item.id !== id)
        }))
    }),
    { name: "stock-sense-state" }
  )
);
