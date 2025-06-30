import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AlertChart = ({ data }) => {
  // Process the data for Chart.js
  const processChartData = () => {
    if (!data || data.length === 0) {
      // Return empty data structure
      return {
        labels: [],
        datasets: [{
          label: 'Alerts',
          data: [],
          borderColor: '#00d4aa',
          backgroundColor: 'rgba(0, 212, 170, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#00d4aa',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
        }]
      };
    }

    // Create labels for the last 24 hours
    const now = new Date();
    const labels = [];
    const alertCounts = [];

    // Generate 24 hourly labels (last 24 hours)
    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - (i * 60 * 60 * 1000));
      const hourString = hour.toISOString().slice(0, 13) + ':00:00';
      const label = hour.getHours().toString().padStart(2, '0') + ':00';
      
      labels.push(label);
      
      // Find matching data point
      const dataPoint = data.find(d => d.hour === hourString);
      alertCounts.push(dataPoint ? dataPoint.count : 0);
    }

    return {
      labels,
      datasets: [{
        label: 'Security Alerts',
        data: alertCounts,
        borderColor: '#00d4aa',
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#00d4aa',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }]
    };
  };

  // Chart configuration options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: {
            family: 'Fira Code, Monaco, Consolas, monospace',
            size: 12
          }
        }
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#00d4aa',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        titleFont: {
          family: 'Fira Code, Monaco, Consolas, monospace',
          size: 12
        },
        bodyFont: {
          family: 'Fira Code, Monaco, Consolas, monospace',
          size: 11
        },
        callbacks: {
          title: function(context) {
            return `Hour: ${context[0].label}`;
          },
          label: function(context) {
            const count = context.parsed.y;
            return `${count} alert${count !== 1 ? 's' : ''} detected`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Fira Code, Monaco, Consolas, monospace',
            size: 10
          },
          maxTicksLimit: 8
        },
        title: {
          display: true,
          text: 'Time (Last 24 Hours)',
          color: '#94a3b8',
          font: {
            family: 'Fira Code, Monaco, Consolas, monospace',
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
          drawBorder: false,
        },
        ticks: {
          color: '#94a3b8',
          font: {
            family: 'Fira Code, Monaco, Consolas, monospace',
            size: 10
          },
          stepSize: 1,
          callback: function(value) {
            return Math.floor(value) === value ? value : '';
          }
        },
        title: {
          display: true,
          text: 'Alert Count',
          color: '#94a3b8',
          font: {
            family: 'Fira Code, Monaco, Consolas, monospace',
            size: 11
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        hoverBorderWidth: 3
      }
    }
  };

  const chartData = processChartData();
  const totalAlerts = chartData.datasets[0].data.reduce((sum, count) => sum + count, 0);
  const maxAlerts = Math.max(...chartData.datasets[0].data);
  const avgAlerts = totalAlerts > 0 ? (totalAlerts / 24).toFixed(1) : 0;

  return (
    <div className="h-full">
      {/* Chart Statistics */}
      <div className="mb-4 grid grid-cols-3 gap-4 text-center">
        <div className="bg-cyber-gray p-3 rounded-lg border border-gray-600">
          <div className="text-lg font-bold text-cyber-blue">{totalAlerts}</div>
          <div className="text-xs text-gray-400">Total (24h)</div>
        </div>
        <div className="bg-cyber-gray p-3 rounded-lg border border-gray-600">
          <div className="text-lg font-bold text-purple-400">{maxAlerts}</div>
          <div className="text-xs text-gray-400">Peak Hour</div>
        </div>
        <div className="bg-cyber-gray p-3 rounded-lg border border-gray-600">
          <div className="text-lg font-bold text-yellow-400">{avgAlerts}</div>
          <div className="text-xs text-gray-400">Avg/Hour</div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="chart-container rounded-lg p-4" style={{ height: '300px' }}>
        {totalAlerts === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-400 text-sm">No alert data available</p>
              <p className="text-gray-500 text-xs mt-1">Upload log files to see trends</p>
            </div>
          </div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>

      {/* Chart Legend */}
      <div className="mt-4 text-xs text-gray-400 text-center">
        <p>Real-time security alert monitoring over the last 24 hours</p>
      </div>
    </div>
  );
};

export default AlertChart;
