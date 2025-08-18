import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
// Add transaction data for multiple years
const transactionDataByYear = {
  2023: [
    { month: "Jan", transactions: 120 },
    { month: "Feb", transactions: 150 },
    { month: "Mar", transactions: 180 },
    { month: "Apr", transactions: 200 },
    { month: "May", transactions: 170 },
    { month: "Jun", transactions: 220 },
    { month: "Jul", transactions: 250 },
    { month: "Aug", transactions: 210 },
    { month: "Sep", transactions: 190 },
    { month: "Oct", transactions: 230 },
    { month: "Nov", transactions: 240 },
    { month: "Dec", transactions: 260 },
  ],
  2024: [
    { month: "Jan", transactions: 150 },
    { month: "Feb", transactions: 170 },
    { month: "Mar", transactions: 200 },
    { month: "Apr", transactions: 220 },
    { month: "May", transactions: 180 },
    { month: "Jun", transactions: 240 },
    { month: "Jul", transactions: 270 },
    { month: "Aug", transactions: 230 },
    { month: "Sep", transactions: 210 },
    { month: "Oct", transactions: 250 },
    { month: "Nov", transactions: 280 },
    { month: "Dec", transactions: 300 },
  ],
};

const TransactionsChart: React.FC = () => {
  const [year, setYear] = useState<number>(2023);
  const data = transactionDataByYear[year];

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Monthly Transactions - {year}</h5>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="form-select w-auto"
          >
            {Object.keys(transactionDataByYear).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <LineChart width={1000} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="transactions"
            stroke="#ffc107"
            strokeWidth={3}
          />
        </LineChart>
      </div>
    </div>
  );
};
