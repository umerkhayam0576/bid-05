import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AED' | 'SAR' | 'AUD' | 'JPY' | 'CHF';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rate: number; // 1 USD = rate in target currency
  flag: string;
  locale: string;
  decimals: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0, flag: '🇺🇸', locale: 'en-US', decimals: 0 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, flag: '🇪🇺', locale: 'de-DE', decimals: 0 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, flag: '🇬🇧', locale: 'en-GB', decimals: 0 },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', rate: 1.36, flag: '🇨🇦', locale: 'en-CA', decimals: 0 },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED ', rate: 3.67, flag: '🇦🇪', locale: 'en-AE', decimals: 0 },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR ', rate: 3.75, flag: '🇸🇦', locale: 'en-SA', decimals: 0 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52, flag: '🇦🇺', locale: 'en-AU', decimals: 0 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 154.5, flag: '🇯🇵', locale: 'ja-JP', decimals: 0 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF ', rate: 0.89, flag: '🇨🇭', locale: 'de-CH', decimals: 0 },
};

export interface FormatCurrencyOptions {
  decimals?: number;
  compact?: boolean;
  showDecimals?: boolean;
  showCode?: boolean;
  skipConversion?: boolean;
}

export interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyConfig: CurrencyConfig;
  allCurrencies: CurrencyConfig[];
  convert: (amountInUSD: number) => number;
  convertBack: (amountInTarget: number) => number;
  formatCurrency: (amountInUSD: number, options?: FormatCurrencyOptions) => string;
  rate: number;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'bid_exact_selected_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved && saved in CURRENCY_CONFIGS) {
        return saved as CurrencyCode;
      }
    } catch {
      // ignore
    }
    return 'USD';
  });

  const currencyConfig = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.USD;

  const setCurrency = (code: CurrencyCode) => {
    if (code in CURRENCY_CONFIGS) {
      setCurrencyState(code);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const convert = (amountInUSD: number): number => {
    if (typeof amountInUSD !== 'number' || isNaN(amountInUSD)) return 0;
    return amountInUSD * currencyConfig.rate;
  };

  const convertBack = (amountInTarget: number): number => {
    if (typeof amountInTarget !== 'number' || isNaN(amountInTarget)) return 0;
    return currencyConfig.rate !== 0 ? amountInTarget / currencyConfig.rate : amountInTarget;
  };

  const formatCurrency = (amountInUSD: number, options?: FormatCurrencyOptions): string => {
    if (amountInUSD === null || amountInUSD === undefined || isNaN(amountInUSD)) {
      return `${currencyConfig.symbol}0`;
    }

    const converted = options?.skipConversion ? amountInUSD : amountInUSD * currencyConfig.rate;

    // Compact formatting ($1.25M, €1.15M, etc.)
    if (options?.compact) {
      const abs = Math.abs(converted);
      const sign = converted < 0 ? '-' : '';
      const prefix = currencyConfig.symbol;
      if (abs >= 1_000_000_000) {
        return `${sign}${prefix}${(abs / 1_000_000_000).toFixed(options.decimals ?? 2)}B`;
      }
      if (abs >= 1_000_000) {
        return `${sign}${prefix}${(abs / 1_000_000).toFixed(options.decimals ?? 2)}M`;
      }
      if (abs >= 1_000) {
        return `${sign}${prefix}${(abs / 1_000).toFixed(options.decimals ?? 1)}k`;
      }
    }

    const dec = options?.decimals !== undefined
      ? options.decimals
      : options?.showDecimals
        ? (currencyConfig.decimals > 0 ? currencyConfig.decimals : 2)
        : currencyConfig.decimals;

    const formattedNum = Math.abs(converted).toLocaleString(undefined, {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    });

    const sign = converted < 0 ? '-' : '';
    const result = `${sign}${currencyConfig.symbol}${formattedNum}`;
    return options?.showCode ? `${result} ${currencyConfig.code}` : result;
  };

  const allCurrencies = Object.values(CURRENCY_CONFIGS);

  const value: CurrencyContextType = {
    currency,
    setCurrency,
    currencyConfig,
    allCurrencies,
    convert,
    convertBack,
    formatCurrency,
    rate: currencyConfig.rate,
    symbol: currencyConfig.symbol,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
