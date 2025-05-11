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
 * WeeklyWeightChart - Component that displays the user's weight history by week using Recharts
 * Shows a chart focused on recent weeks
 */
const WeeklyWeightChart = () => {
  const { weightHistory, initialWeight } = useWeightTracker();
  
  // Process data for the chart - group by week and show last 12 weeks
  const chartData = useMemo(() => {
    if (!weightHistory || weightHistory.length === 0) return [];
    
    // Get the current date
    const now = new Date();
    
    // Calculate date 12 weeks ago
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(now.getDate() - 12 * 7);
    
    // Filter entries to only include those from the last 12 weeks
    const recentEntries = weightHistory.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= twelveWeeksAgo;
    });
    
    // Group entries by week
    const weeklyData = {};
    
    recentEntries.forEach(entry => {
      const entryDate = new Date(entry.date);
      
      // Get the week start date (Sunday)
      const weekStart = new Date(entryDate);
      weekStart.setDate(entryDate.getDate() - entryDate.getDay());
      
      const weekKey = weekStart.toISOString().split('T')[0];
      
    // check if the week key is already in the weeklyData object
      if (!weeklyData[weekKey] || new Date(entry.date) > new Date(weeklyData[weekKey].fullDate)) {
        weeklyData[weekKey] = {
          date: weekStart.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric' 
          }),
          weight: entry.weight,
          fullDate: entry.date
        };
      }
    });
    
    // Convert the grouped data to an array and sort by date
    return Object.values(weeklyData).sort((a, b) => {
      return new Date(a.fullDate) - new Date(b.fullDate);
    });
  }, [weightHistory]);
  
  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <p>Not enough weight entries to show weekly progress</p>
      </div>
    );
  }
  
  // Calculate min and max for Y axis domain to show the initial weight
  const weights = chartData.map(entry => entry.weight);
  const minWeight = Math.min(...weights) - 3;
  const maxWeight = Math.max(...weights) + 3;
  
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
    <div className="bg-white shadow-md h-full">
      <h3 className="text-lg font-semibold text-[var(--primary-color-blue)] mb-4">
        Weekly Weight Tracking
      </h3>
      
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
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
              stroke="#2E7D32"
              fill="rgba(46, 125, 50, 0.2)"
              strokeWidth={2}
              activeDot={{ 
                stroke: '#2E7D32',
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

export default WeeklyWeightChart; 