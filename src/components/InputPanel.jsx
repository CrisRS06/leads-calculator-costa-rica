import React from 'react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

/**
 * Simple modern input panel compatible with React 19
 */
const InputPanel = ({ 
  inputs, 
  updateInput, 
  resetToDefaults, 
  validation,
  isCalculating
}) => {
  const { warnings } = validation || { warnings: {} };

  const renderSlider = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step, 
    formatValue,
    description,
    warning,
    icon = "💎"
  }) => {
    const formattedValue = formatValue ? formatValue(value) : `${value}`;
    const normalizedValue = ((value - min) / (max - min)) * 100;
    
    return (
      <div className="mb-6 p-6 bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl hover:border-blue-200 hover:-translate-y-1">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600">
              <span className="text-lg">{icon}</span>
            </div>
            <label className="text-base font-semibold text-gray-800">
              {label}
            </label>
          </div>
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {formattedValue}
          </div>
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">{description}</p>
        )}
        
        <div className="relative mt-6 mb-6">
          <div className="relative h-8">
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
            />
            
            <div className="absolute top-3 left-0 w-full h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 transition-all duration-500 rounded-full shadow-lg"
                style={{ 
                  width: `${normalizedValue}%`,
                  boxShadow: `0 0 10px rgba(59, 130, 246, 0.5)`
                }}
              />
            </div>
            
            <div 
              className="absolute top-1 h-6 w-6 bg-white border-3 border-blue-600 rounded-full shadow-xl transition-all duration-300 z-20"
              style={{ 
                left: `calc(${normalizedValue}% - 12px)`,
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              <div className="absolute inset-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-80"></div>
            </div>
            
            <div className="absolute top-3 left-[25%] w-1 h-2 bg-gray-400 rounded-full opacity-40" />
            <div className="absolute top-3 left-[50%] w-1 h-2 bg-gray-400 rounded-full opacity-40" />
            <div className="absolute top-3 left-[75%] w-1 h-2 bg-gray-400 rounded-full opacity-40" />
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-3 px-2">
            <span className={normalizedValue <= 25 ? 'text-blue-600 font-semibold' : ''}>Bajo</span>
            <span className={normalizedValue > 25 && normalizedValue <= 75 ? 'text-blue-600 font-semibold' : ''}>Promedio</span>
            <span className={normalizedValue > 75 ? 'text-blue-600 font-semibold' : ''}>Alto</span>
          </div>
        </div>
        
        {warning && (
          <div className="mt-4 flex items-center gap-3 text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 rounded-xl border border-amber-200">
            <span className="text-lg">⚠️</span>
            <span>{warning}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
            <span className="text-2xl">📈</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Parámetros de Campaña
          </h2>
        </div>
        
        {isCalculating && (
          <div className="flex items-center gap-3 text-blue-600">
            <div className="h-6 w-6 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
            <span className="text-sm font-semibold">Calculando...</span>
          </div>
        )}
      </div>

      {/* Market Info */}
      <div className="bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-100 border border-blue-200/60 rounded-3xl p-6 mb-8 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700">
            <span className="text-xl">📊</span>
          </div>
          <h3 className="text-lg font-bold text-blue-900">
            Contexto Mercado Costa Rica
          </h3>
          <div className="ml-auto text-xs bg-blue-200 text-blue-800 px-3 py-1.5 rounded-full font-semibold">
            Datos 2024
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">💰</span>
            <span>CPC: <span className="font-semibold">₡600-900</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">👆</span>
            <span>CTR: <span className="font-semibold">2-3%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">🎯</span>
            <span>Conversión: <span className="font-semibold">3.5-5%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-600">✨</span>
            <span>Lead B2B: <span className="font-semibold">₡30-60K</span></span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Investment Slider */}
        {renderSlider({
          label: "Inversión Mensual",
          value: inputs.investment,
          onChange: (value) => updateInput('investment', value),
          min: 50000,
          max: 500000,
          step: 25000,
          formatValue: formatCurrency,
          description: "Presupuesto total mensual para publicidad digital en Costa Rica",
          warning: warnings.investment,
          icon: "💰"
        })}

        {/* Cost Per Click Slider */}
        {renderSlider({
          label: "Costo por Clic (CPC)",
          value: inputs.costPerClick,
          onChange: (value) => updateInput('costPerClick', value),
          min: 200,
          max: 2000,
          step: 50,
          formatValue: formatCurrency,
          description: "Precio promedio que pagas por cada clic en tus anuncios",
          warning: warnings.costPerClick,
          icon: "💸"
        })}

        {/* Click Rate Slider */}
        {renderSlider({
          label: "Tasa de Clics (CTR)",
          value: inputs.clickRate,
          onChange: (value) => updateInput('clickRate', value),
          min: 0.5,
          max: 8.0,
          step: 0.1,
          formatValue: formatPercentage,
          description: "Porcentaje de personas que hacen clic en tus anuncios",
          warning: warnings.clickRate,
          icon: "👆"
        })}

        {/* Conversion Rate Slider */}
        {renderSlider({
          label: "Tasa de Conversión",
          value: inputs.conversionRate,
          onChange: (value) => updateInput('conversionRate', value),
          min: 1.0,
          max: 15.0,
          step: 0.1,
          formatValue: formatPercentage,
          description: "Porcentaje de visitantes que se convierten en leads",
          warning: warnings.conversionRate,
          icon: "🎯"
        })}
      </div>

      {/* Reset Button */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={resetToDefaults}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 disabled:from-gray-50 disabled:to-gray-100 disabled:text-gray-400 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 border border-gray-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
        >
          <span className="text-xl transition-transform duration-500 group-hover:rotate-180">
            🔄
          </span>
          <span>Restaurar Valores Promedio CR</span>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-8 p-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">💡</span>
          <h3 className="text-base font-semibold text-amber-800">Tips Rápidos</h3>
        </div>
        
        <div className="space-y-3 text-sm text-amber-700">
          <div className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">✨</span>
            <div>
              <span className="font-semibold">Tip: </span>
              <span>Ajusta los sliders para ver el impacto en tiempo real</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">🎯</span>
            <div>
              <span className="font-semibold">Meta: </span>
              <span>Busca un ROI mayor al 100% para rentabilidad</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 mt-0.5">📱</span>
            <div>
              <span className="font-semibold">CR: </span>
              <span>WhatsApp Business mejora conversión 30-40%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;