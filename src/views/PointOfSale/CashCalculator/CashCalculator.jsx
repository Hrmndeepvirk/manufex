

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import CustomInput from '@shared/inputs/CustomInput';
import { useCurrencyFormatter } from "../../../hooks/useCurrencyFormatter";

const CURRENCY_DENOMINATIONS = {
  USD: {
    bills: [100, 50, 20, 10, 5, 1],
    coins: [0.25, 0.10, 0.05, 0.01],
  },
  INR: {
    bills: [2000, 500, 200, 100, 50, 20, 10],
    coins: [10, 5, 2, 1],
  },
  EUR: {
    bills: [500, 200, 100, 50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
  },
  GBP: {
    bills: [50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05, 0.02, 0.01],
  },
  CAD: {
    bills: [100, 50, 20, 10, 5],
    coins: [2, 1, 0.25, 0.10, 0.05],
  },
  AUD: {
    bills: [100, 50, 20, 10, 5],
    coins: [2, 1, 0.50, 0.20, 0.10, 0.05],
  },
  JPY: {
    bills: [10000, 5000, 2000, 1000],
    coins: [500, 100, 50, 10, 5, 1],
  },
};

export default function CashCalculator({ onChange, error }) {
  const { formatCurrency } = useCurrencyFormatter();
  const currency = useSelector((state) => state.company.details.currency);
  
  const currencyCode = currency?.code || 'USD';
  
  const currentDenominations = useMemo(() => {
    return CURRENCY_DENOMINATIONS[currencyCode] || CURRENCY_DENOMINATIONS.USD;
  }, [currencyCode]);

  const allDenominations = useMemo(() => {
    return [...currentDenominations.bills, ...currentDenominations.coins];
  }, [currentDenominations]);

  const [counts, setCounts] = useState(() => {
    const initialState = {};
    allDenominations.forEach((value) => {
      initialState[value] = 0;
    });
    return initialState;
  });

  const totalCash = useMemo(() => {
    return Object.entries(counts).reduce((sum, [denomination, count]) => {
      return sum + parseFloat(denomination) * count;
    }, 0);
  }, [counts]);

  useEffect(() => {
    onChange({ name: 'totalCash', value: Number(totalCash.toFixed(2)) });
  }, [totalCash, onChange]);

  useEffect(() => {
    const initialState = {};
    allDenominations.forEach((value) => {
      initialState[value] = 0;
    });
    setCounts(initialState);
  }, [currencyCode, allDenominations]);

  const handleCountChange = (denomination, value) => {
    setCounts((prev) => ({
      ...prev,
      [denomination]: Number(value) || 0,
    }));
  };

  const formatDenominationLabel = (value) => {
    return formatCurrency(value);
  };

  const isBill = (value) => {
    return currentDenominations.bills.includes(value);
  };

  return (

    <div className="border-round-md border-1 border-300 p-3 mb-3">
      <div className="flex justify-content-between align-items-center mb-3">
        <span className="text-sm font-semibold">Cash Calculator</span>
        {error && <small className="p-error">{error}</small>}
      </div>
      
      {currentDenominations.bills.length > 0 && (
        <>
          <div className="text-xs font-semibold text-600 mb-2">Bills</div>
          <div className="grid mb-3">
            {currentDenominations.bills.map((denomination) => (
              <div className="col-6 md:col-4 lg:col-3" key={`bill-${denomination}`}>
                <CustomInput
                  label={formatDenominationLabel(denomination)}
                  name={`bill-${denomination}`}
                  value={counts[denomination]}
                  onChange={(e) => handleCountChange(denomination, e.target.value)}
                  type="number"
                  min="0"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {currentDenominations.coins.length > 0 && (
        <>
          <div className="text-xs font-semibold text-600 mb-2">Coins</div>
          <div className="grid">
            {currentDenominations.coins.map((denomination) => (
              <div className="col-6 md:col-4 lg:col-3" key={`coin-${denomination}`}>
                <CustomInput
                  label={formatDenominationLabel(denomination)}
                  name={`coin-${denomination}`}
                  value={counts[denomination]}
                  onChange={(e) => handleCountChange(denomination, e.target.value)}
                  type="number"
                  min="0"
                />
              </div>
            ))}
          </div>
        </>
      )}

      <div className="flex justify-content-between align-items-center mt-3 pt-3 border-top-1 border-300">
        <span className="font-semibold">Total Cash:</span>
        <span className="text-xl font-bold text-green-600">
          {formatCurrency(totalCash)}
        </span>
      </div>
    </div>

  );
}