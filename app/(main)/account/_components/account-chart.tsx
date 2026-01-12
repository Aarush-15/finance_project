"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
};

interface AccountChartProps {
  transactions: Transaction[];
}

type ChartData = {
  date: string;
  income: number;
  expense: number;
  originalDate: Date; // Added to help with sorting if needed
};

type DateRangeKey = keyof typeof DATE_RANGES;

export function AccountChart({ transactions }: AccountChartProps) {
  const [dateRange, setDateRange] = useState<DateRangeKey>("1M");

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));

    // Filter transactions by date range
    const filtered = transactions.filter(
      (t) =>
        new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    // Group by Date
    const grouped = filtered.reduce((acc, transaction) => {
      const dateObj = new Date(transaction.date);
      // Changed format to "MMM dd" (e.g. "Nov 25") to match image
      const dateStr = format(dateObj, "MMM dd"); 

      if (!acc[dateStr]) {
        acc[dateStr] = { 
            date: dateStr, 
            income: 0, 
            expense: 0,
            originalDate: dateObj 
        };
      }
      
      if (transaction.type === "INCOME") {
        acc[dateStr].income += transaction.amount;
      } else {
        acc[dateStr].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, ChartData>);

    // Sort by time
    return Object.values(grouped).sort(
      (a, b) => a.originalDate.getTime() - b.originalDate.getTime()
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // Custom Tooltip to match the screenshot style
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md text-sm min-w-37.5">
          <div className="font-semibold mb-2 border-b pb-1">{label}</div>
          <div className="flex justify-between items-center text-green-500 mb-1">
            <span>Income:</span>
            <span className="font-medium">${payload[0].value.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-red-500">
            <span>Expense:</span>
            <span className="font-medium">${payload[1].value.toFixed(2)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          Transaction Overview
        </CardTitle>
        <Select
          defaultValue={dateRange}
          // FIX: Explicit cast to DateRangeKey to fix type error
          onValueChange={(value) => setDateRange(value as DateRangeKey)}
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              ${totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              ${totals.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p
              className={`text-lg font-bold ${
                totals.income - totals.expense >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-75">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredData}
              barGap={0}
              barCategoryGap="20%" // Adjusts spacing between dates
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f3f4f6" }} />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}