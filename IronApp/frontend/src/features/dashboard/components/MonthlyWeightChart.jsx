import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import useWeightTracker from '../../weight/hooks/useWeightTracker';

/**
 * MonthlyWeightChart - Component that displays the user's weight history by month using Recharts
 * Shows a longer-term trend of weight changes over months
 */
const MonthlyWeightChart = () => {
  const { weightHistory, initialWeight } = useWeightTracker();
  
  // Process data for the chart - group by month
  const chartData = useMemo(() => {
    if (!weightHistory || weightHistory.length === 0) return [];
    
    // Group entries by month
    const monthlyData = {};
    
    weightHistory.forEach(entry => {
      const entryDate = new Date(entry.date);
      // Create a month key in format 'YYYY-MM'
      const monthKey = `${entryDate.getFullYear()}-${String(entryDate.getMonth() + 1).padStart(2, '0')}`;
      
      // check if the month key is already in the monthlyData object
      if (!monthlyData[monthKey] || new Date(entry.date) > new Date(monthlyData[monthKey].fullDate)) {
        monthlyData[monthKey] = {
          month: entryDate.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }),
          weight: entry.weight,
          fullDate: entry.date
        };
      }
    });
    
    // Convert the grouped data to an array and sort by date
    return Object.values(monthlyData).sort((a, b) => {
      return new Date(a.fullDate) - new Date(b.fullDate);
    });
  }, [weightHistory]);
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>Add weight entries to see your monthly progress chart</p>
      </div>
    );
  }
  
  // Calculate min and max for Y axis domain to show the initial weight
  const weights = chartData.map(entry => entry.weight);
  const minWeight = Math.min(...weights, initialWeight) - 5; 
  const maxWeight = Math.max(...weights) + 5;
  
  // Custom tooltip to show the exact date and weight
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const entry = payload[0].payload;
      const date = new Date(entry.fullDate).toLocaleDateString();
      const weightValue = entry.weight;
      
      return (
        <div className="bg-white p-3 shadow-md rounded-md border border-gray-200">
          <p className="text-sm font-medium">{date}</p>
          <p className="text-[var(--primary-color-teal)] font-bold">
            {weightValue} lbs
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-[var(--primary-color-blue)] mb-4">
        Monthly Weight Trends
      </h3>
      
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              tickMargin={8}
            />
            <YAxis 
              domain={[minWeight, maxWeight]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {initialWeight > 0 && (
              <ReferenceLine 
                y={initialWeight} 
                stroke="#8884d8" 
                strokeDasharray="3 3"
                label={{ 
                  value: 'Initial',
                  position: 'insideBottomRight',
                  style: { fontSize: 10 }
                }}
              />
            )}
            <Area
              type="monotone"
              dataKey="weight"
              stroke="var(--primary-color-teal)"
              fill="rgba(0, 128, 128, 0.2)"
              strokeWidth={2}
              activeDot={{ 
                stroke: 'var(--primary-color-blue)',
                strokeWidth: 2,
                r: 5,
                fill: 'var(--primary-color-teal)'
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyWeightChart;
