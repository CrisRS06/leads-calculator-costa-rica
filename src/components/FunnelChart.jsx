import React, { useEffect, useRef, useState } from 'react';
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
import { formatCurrency } from '../utils/calculations';

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

/**
 * Funnel visualization component with sequential animations
 */
const FunnelChart = ({ results, shouldAnimate, isCalculating }) => {
  // CRITICAL: All hooks MUST be called before any conditional returns (React 19 requirement)
  const chartRef = useRef(null);
  const [animationKey, setAnimationKey] = useState(0);

  // Reset animation when new data comes in
  useEffect(() => {
    if (shouldAnimate && results) {
      setAnimationKey(prev => prev + 1);
    }
  }, [shouldAnimate, results]);

  // Early returns AFTER all hooks are initialized
  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 cr-card-gradient">
        <div className="chart-container flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold mb-2">Funnel de Conversión</h3>
            <p className="text-sm">Los datos aparecerán aquí cuando ajustes los parámetros</p>
          </div>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 cr-card-gradient">
        <div className="chart-container flex items-center justify-center">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-700">Generando visualización...</h3>
            <p className="text-sm text-gray-500">Dibujando funnel de conversión</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate funnel data with proper scaling
  const funnelData = [
    results.impressions,
    results.clicks,
    results.leads,
    Math.max(results.leads * 0.8, 1) // End point for visual effect
  ];

  const chartData = {
    labels: ['Impresiones', 'Clics', 'Leads', 'Conversión'],
    datasets: [
      {
        label: 'Funnel de Conversión',
        data: funnelData,
        borderColor: '#002E6D', // Costa Rica blue
        backgroundColor: 'rgba(0, 46, 109, 0.1)',
        borderWidth: 4,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'],
        pointBorderColor: '#ffffff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 4
      },
      // Secondary line for visual depth
      {
        label: 'Tendencia',
        data: funnelData.map(val => val * 0.85),
        borderColor: 'rgba(0, 46, 109, 0.3)',
        backgroundColor: 'rgba(0, 46, 109, 0.05)',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 0,
        pointHoverRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: shouldAnimate ? {
      duration: 2000,
      delay: (context) => {
        // Sequential delay for each point (500ms apart)
        return context.dataIndex * 500;
      },
      easing: 'easeOutQuart',
      onComplete: () => {
        // Chart animation completed - ready for next interaction
      }
    } : false,
    plugins: {
      title: {
        display: true,
        text: '📊 Funnel de Conversión - Mercado Costa Rica',
        font: {
          size: 16,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: {
          bottom: 20
        }
      },
      legend: {
        display: false // Hide legend for cleaner look
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#002E6D',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => {
            return context[0].label;
          },
          label: (context) => {
            const value = context.parsed.y;
            const label = context.label;
            
            // Calculate conversion rates
            const impressions = funnelData[0];
            const clicks = funnelData[1];
            const leads = funnelData[2];
            
            let conversionInfo = '';
            if (label === 'Clics') {
              const ctr = ((clicks / impressions) * 100).toFixed(1);
              conversionInfo = ` (CTR: ${ctr}%)`;
            } else if (label === 'Leads') {
              const convRate = ((leads / clicks) * 100).toFixed(1);
              conversionInfo = ` (Conversión: ${convRate}%)`;
            }
            
            return `${value.toLocaleString()} ${conversionInfo}`;
          },
          afterLabel: (context) => {
            if (context.label === 'Leads') {
              return [
                '',
                `Costo por Lead: ${formatCurrency(results.costPerLead)}`,
                `Valor Total: ${formatCurrency(results.totalLeadValue)}`
              ];
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#4b5563',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [2, 2]
        },
        ticks: {
          color: '#6b7280',
          callback: (value) => {
            if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
            return value.toLocaleString();
          }
        }
      }
    },
    elements: {
      line: {
        borderJoinStyle: 'round',
        borderCapStyle: 'round'
      },
      point: {
        hoverBorderWidth: 4,
        hoverBackgroundColor: '#ffffff'
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 cr-card-gradient">
      <div className="chart-container" key={animationKey}>
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>
      
      {/* Funnel Stage Indicators */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">
            {results.impressions.toLocaleString()}
          </div>
          <div className="text-blue-700 font-medium text-sm">Impresiones</div>
          <div className="text-blue-500 text-xs">Base del funnel</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-lg font-bold text-purple-600">
            {results.clicks.toLocaleString()}
          </div>
          <div className="text-purple-700 font-medium text-sm">Clics</div>
          <div className="text-purple-500 text-xs">
            {results.impressionToClick.toFixed(1)}% CTR
          </div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">
            {results.leads.toLocaleString()}
          </div>
          <div className="text-green-700 font-medium text-sm">Leads</div>
          <div className="text-green-500 text-xs">
            {results.clickToLead.toFixed(1)}% conversión
          </div>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-lg font-bold text-yellow-600">
            {formatCurrency(results.costPerLead)}
          </div>
          <div className="text-yellow-700 font-medium text-sm">Costo/Lead</div>
          <div className="text-yellow-500 text-xs">Eficiencia</div>
        </div>
      </div>
      
      {/* Conversion Flow Visualization */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 text-center">
          🔄 Flujo de Conversión
        </h4>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
            {results.impressions.toLocaleString()} impresiones
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
            {results.clicks.toLocaleString()} clics
          </span>
          <span className="text-gray-400">→</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
            {results.leads.toLocaleString()} leads
          </span>
        </div>
        <div className="text-center mt-2 text-xs text-gray-600">
          Eficiencia total: {results.impressionToLead.toFixed(2)}% (impresión → lead)
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;