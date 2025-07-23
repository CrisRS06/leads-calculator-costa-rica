import React from 'react';
import { useCountingAnimation } from '../hooks/useLeadsCalculator';
import { formatCurrency, formatPercentage } from '../utils/calculations';

/**
 * Animated metric card component
 */
const MetricCard = ({ 
  icon, 
  label, 
  value, 
  format = 'number',
  color = 'blue',
  size = 'normal',
  shouldAnimate = false
}) => {
  // Use counting animation for the metric value
  const animatedValue = useCountingAnimation(
    format === 'currency' || format === 'number' ? value : 0, 
    1500, 
    shouldAnimate
  );
  
  // Display value based on format and animation state
  const displayValue = () => {
    if (!shouldAnimate) {
      switch (format) {
        case 'currency':
          return formatCurrency(value);
        case 'percentage':
          return formatPercentage(value);
        default:
          return value?.toLocaleString() || '0';
      }
    }
    
    // Animated display
    switch (format) {
      case 'currency':
        return formatCurrency(animatedValue);
      case 'percentage':
        return shouldAnimate ? formatPercentage(value) : formatPercentage(0); // Percentage doesn't animate
      default:
        return animatedValue.toLocaleString();
    }
  };

  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    green: 'text-green-600 bg-green-50 border-green-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200'
  };

  const sizeClasses = {
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  return (
    <div className={`bg-white rounded-xl border-2 shadow-lg smooth-transition hover:shadow-xl ${colorClasses[color]} ${sizeClasses[size]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        {size === 'large' && (
          <div className="text-xs font-medium opacity-75 uppercase tracking-wide">
            Métrica Clave
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className={`font-bold counting-number ${size === 'large' ? 'text-4xl' : size === 'small' ? 'text-xl' : 'text-2xl'}`}>
          {displayValue()}
        </div>
        <div className={`font-medium opacity-90 ${size === 'large' ? 'text-lg' : 'text-sm'}`}>
          {label}
        </div>
      </div>
    </div>
  );
};

/**
 * Performance metric with status indicator
 */
const PerformanceMetric = ({ 
  icon, 
  label, 
  value, 
  target, 
  format = 'number',
  shouldAnimate = false 
}) => {
  const animatedValue = useCountingAnimation(
    format === 'currency' || format === 'number' ? value : 0, 
    1500, 
    shouldAnimate
  );
  
  const displayValue = shouldAnimate ? animatedValue : value;
  const percentage = target ? (value / target) * 100 : 0;
  
  const getStatusColor = (perc) => {
    if (perc >= 90) return 'green';
    if (perc >= 70) return 'blue';
    if (perc >= 50) return 'yellow';
    return 'red';
  };

  const statusColor = getStatusColor(percentage);
  const formattedValue = format === 'currency' ? formatCurrency(displayValue) : 
                        format === 'percentage' ? formatPercentage(value) :
                        displayValue.toLocaleString();

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <div className={`w-3 h-3 rounded-full bg-${statusColor}-500`}></div>
      </div>
      
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900 counting-number">
          {formattedValue}
        </div>
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {target && (
          <div className="text-xs text-gray-500">
            Meta: {format === 'currency' ? formatCurrency(target) : target.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ROI indicator with visual gauge
 */
const ROIGauge = ({ roi, shouldAnimate }) => {
  const animatedROI = useCountingAnimation(roi, 1500, shouldAnimate);
  const displayROI = shouldAnimate ? animatedROI : roi;
  
  const getROIStatus = (roiValue) => {
    if (roiValue >= 200) return { status: 'Excelente', color: 'green', icon: '🚀' };
    if (roiValue >= 100) return { status: 'Bueno', color: 'blue', icon: '📈' };
    if (roiValue >= 50) return { status: 'Promedio', color: 'yellow', icon: '📊' };
    return { status: 'Bajo', color: 'red', icon: '⚠️' };
  };

  const roiStatus = getROIStatus(roi);
  const gaugeProgress = Math.min((roi / 300) * 100, 100); // Max at 300% for visual purposes

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 shadow-lg">
      <div className="text-center space-y-4">
        <div className="text-3xl">{roiStatus.icon}</div>
        
        <div className="space-y-2">
          <div className="text-4xl font-bold text-gray-900 counting-number">
            {formatPercentage(displayROI)}
          </div>
          <div className="text-lg font-semibold text-gray-700">
            ROI (Retorno Inversión)
          </div>
        </div>

        {/* Visual gauge */}
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 bg-${roiStatus.color}-500`}
              style={{ width: `${Math.min(gaugeProgress, 100)}%` }}
            ></div>
          </div>
          
          <div className={`text-sm font-medium text-${roiStatus.color}-600`}>
            {roiStatus.status}
          </div>
        </div>

        {/* ROI Benchmarks */}
        <div className="text-xs text-gray-500 space-y-1">
          <div>🎯 Excelente: +200%</div>
          <div>📈 Bueno: +100%</div>
          <div>📊 Promedio: +50%</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main results display component - React 19 compatible
 */
const ResultsDisplay = ({ results, shouldAnimate, isCalculating }) => {
  // CRITICAL: All hooks MUST be called before any conditional returns (React 19 requirement)
  // These hooks will always run, regardless of conditions
  const animatedTotalLeadValue = useCountingAnimation(
    results?.totalLeadValue || 0, 
    1500, 
    shouldAnimate && results
  );

  // Early returns AFTER all hooks are initialized
  if (!results) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 cr-card-gradient">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold mb-2">Calculadora de Leads CR</h3>
          <p>Ajusta los parámetros para ver tus resultados</p>
        </div>
      </div>
    );
  }

  if (isCalculating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 cr-card-gradient">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Calculando resultados...</h3>
          <p className="text-sm text-gray-500">Optimizando para el mercado costarricense</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="👥"
          label="Leads Totales"
          value={results.leads}
          format="number"
          color="blue"
          shouldAnimate={shouldAnimate}
        />
        
        <MetricCard
          icon="💰"
          label="Costo por Lead"
          value={results.costPerLead}
          format="currency"
          color="green"
          shouldAnimate={shouldAnimate}
        />
        
        <MetricCard
          icon="📈"
          label="Valor por Lead"
          value={results.leadValue}
          format="currency"
          color="purple"
          shouldAnimate={shouldAnimate}
        />
        
        <MetricCard
          icon="🎯"
          label="Conversión"
          value={results.conversionRate}
          format="percentage"
          color="yellow"
          shouldAnimate={shouldAnimate}
        />
      </div>

      {/* ROI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ROI Gauge - Large */}
        <div className="lg:col-span-1">
          <ROIGauge roi={results.roi} shouldAnimate={shouldAnimate} />
        </div>
        
        {/* Performance Metrics */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <PerformanceMetric
            icon="📊"
            label="Clicks Totales"
            value={results.clicks}
            format="number"
            shouldAnimate={shouldAnimate}
          />
          
          <PerformanceMetric
            icon="💸"
            label="Costo Total"
            value={results.totalInvestment}
            format="currency"
            shouldAnimate={shouldAnimate}
          />
          
          <PerformanceMetric
            icon="⚡"
            label="CTR"
            value={results.clickRate}
            format="percentage"
            shouldAnimate={shouldAnimate}
          />
          
          <PerformanceMetric
            icon="🔥"
            label="CPC"
            value={results.costPerClick}
            format="currency"
            shouldAnimate={shouldAnimate}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-900">💎 Resumen Ejecutivo</h3>
          <div className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-semibold">
            Costa Rica 2024
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 counting-number">
              {shouldAnimate ? animatedTotalLeadValue.toLocaleString() : (results?.totalLeadValue?.toLocaleString() || '0')}
            </div>
            <div className="text-blue-700 font-medium">Valor Total Leads</div>
            <div className="text-blue-500 text-xs">₡{results?.leadValue?.toLocaleString() || '0'} por lead</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {formatPercentage(results.roi)}
            </div>
            <div className="text-green-700 font-medium">ROI Proyectado</div>
            <div className="text-green-500 text-xs">Retorno sobre inversión</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {results?.leads?.toLocaleString() || '0'}
            </div>
            <div className="text-purple-700 font-medium">Leads Mensuales</div>
            <div className="text-purple-500 text-xs">Potenciales clientes</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white/60 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">💡 Insight CR:</span> 
            {results.roi >= 100 ? 
              'Tu campaña está optimizada para generar ganancias sostenibles en el mercado costarricense.' :
              'Considera ajustar tus métricas para mejorar el retorno de inversión en Costa Rica.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;