import React, { useState } from 'react';

/**
 * Individual tip card component
 */
const TipCard = ({ tip, index, isExpanded, onToggle }) => {
  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return {
          container: 'tip-success border-l-4 border-green-500',
          icon: '🎉',
          titleColor: 'text-green-800',
          textColor: 'text-green-700'
        };
      case 'warning':
        return {
          container: 'tip-warning border-l-4 border-yellow-500',
          icon: '⚠️',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700'
        };
      case 'info':
        return {
          container: 'tip-info border-l-4 border-blue-500',
          icon: '💡',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700'
        };
      case 'suggestion':
        return {
          container: 'bg-purple-50 border-l-4 border-purple-500',
          icon: '🚀',
          titleColor: 'text-purple-800',
          textColor: 'text-purple-700'
        };
      default:
        return {
          container: 'bg-gray-50 border-l-4 border-gray-500',
          icon: 'ℹ️',
          titleColor: 'text-gray-800',
          textColor: 'text-gray-700'
        };
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            🔥 Alta
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            ⚡ Media
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            📈 Baja
          </span>
        );
      default:
        return null;
    }
  };

  const styles = getTypeStyles(tip.type);

  return (
    <div 
      className={`p-4 rounded-lg ${styles.container} smooth-transition cursor-pointer hover:shadow-md`}
      onClick={() => onToggle(index)}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-xl flex-shrink-0">{styles.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`font-semibold ${styles.titleColor}`}>
                {tip.title}
              </h4>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(tip.priority)}
                <span className="text-gray-400 text-sm">
                  {isExpanded ? '−' : '+'}
                </span>
              </div>
            </div>
            
            <p className={`text-sm ${styles.textColor} mb-2`}>
              {tip.message}
            </p>

            {isExpanded && (
              <div className="mt-3 space-y-2 animate-fadeIn">
                <div className={`text-sm font-medium ${styles.titleColor}`}>
                  🎯 <strong>Acción Recomendada:</strong>
                </div>
                <p className={`text-sm ${styles.textColor} ml-6`}>
                  {tip.action}
                </p>
                
                {tip.impact && (
                  <>
                    <div className={`text-sm font-medium ${styles.titleColor}`}>
                      📊 <strong>Impacto Esperado:</strong>
                    </div>
                    <p className={`text-sm ${styles.textColor} ml-6`}>
                      {tip.impact}
                    </p>
                  </>
                )}

                {tip.category === 'market' && (
                  <div className="mt-3 p-3 bg-white bg-opacity-60 rounded border border-blue-200">
                    <div className="text-xs font-semibold text-blue-800 mb-1">
                      🇨🇷 Contexto Costa Rica
                    </div>
                    <p className="text-xs text-blue-700">
                      Recomendación específica para el mercado costarricense basada en datos locales.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tips category filter component
 */
const CategoryFilter = ({ categories, selectedCategory, onCategoryChange }) => {
  const categoryIcons = {
    all: '🎯',
    conversion: '📈',
    cost: '💰',
    traffic: '👆',
    roi: '💹',
    budget: '💳',
    optimization: '⚡',
    market: '🇨🇷'
  };

  const categoryNames = {
    all: 'Todos',
    conversion: 'Conversión',
    cost: 'Costos',
    traffic: 'Tráfico',
    roi: 'ROI',
    budget: 'Presupuesto',
    optimization: 'Optimización',
    market: 'Mercado CR'
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {categories.map(category => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedCategory === category
              ? 'bg-blue-100 text-blue-800 border border-blue-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {categoryIcons[category]} {categoryNames[category]}
        </button>
      ))}
    </div>
  );
};

/**
 * Performance summary component
 */
const PerformanceSummary = ({ results, tips }) => {
  if (!results) return null;

  const getOverallStatus = () => {
    const highPriorityTips = tips.filter(tip => tip.priority === 'high').length;
    const overallPerformance = results.performance.overall;
    
    if (overallPerformance === 'excellent' && highPriorityTips === 0) {
      return {
        icon: '🏆',
        title: '¡Excelente Rendimiento!',
        message: 'Tu campaña está optimizada para el mercado costarricense',
        color: 'green'
      };
    } else if (overallPerformance === 'good' && highPriorityTips <= 1) {
      return {
        icon: '✅',
        title: 'Buen Rendimiento',
        message: 'Algunas optimizaciones pueden mejorar tus resultados',
        color: 'blue'
      };
    } else if (highPriorityTips <= 2) {
      return {
        icon: '📊',
        title: 'Rendimiento Promedio',
        message: 'Oportunidades claras de mejora identificadas',
        color: 'yellow'
      };
    } else {
      return {
        icon: '⚠️',
        title: 'Necesita Optimización',
        message: 'Varias áreas críticas requieren atención inmediata',
        color: 'red'
      };
    }
  };

  const status = getOverallStatus();
  const priorityCount = {
    high: tips.filter(tip => tip.priority === 'high').length,
    medium: tips.filter(tip => tip.priority === 'medium').length,
    low: tips.filter(tip => tip.priority === 'low').length
  };

  return (
    <div className={`p-4 rounded-lg border-l-4 mb-6 ${
      status.color === 'green' ? 'bg-green-50 border-green-500' :
      status.color === 'blue' ? 'bg-blue-50 border-blue-500' :
      status.color === 'yellow' ? 'bg-yellow-50 border-yellow-500' :
      'bg-red-50 border-red-500'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{status.icon}</span>
          <div>
            <h3 className={`font-semibold ${
              status.color === 'green' ? 'text-green-800' :
              status.color === 'blue' ? 'text-blue-800' :
              status.color === 'yellow' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              {status.title}
            </h3>
            <p className={`text-sm ${
              status.color === 'green' ? 'text-green-700' :
              status.color === 'blue' ? 'text-blue-700' :
              status.color === 'yellow' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {status.message}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2 text-xs">
          {priorityCount.high > 0 && (
            <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full">
              {priorityCount.high} alta
            </span>
          )}
          {priorityCount.medium > 0 && (
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
              {priorityCount.medium} media
            </span>
          )}
          {priorityCount.low > 0 && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
              {priorityCount.low} baja
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Main tips display component
 */
const TipsDisplay = ({ tips, results }) => {
  const [expandedTips, setExpandedTips] = useState(new Set());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Early return AFTER hooks initialization for React 19 compatibility
  if (!tips || tips.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 cr-card-gradient">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-lg font-semibold mb-2">Recomendaciones Inteligentes</h3>
          <p className="text-sm">
            Las recomendaciones aparecerán aquí basadas en tus métricas y el mercado costarricense
          </p>
        </div>
      </div>
    );
  }

  // Get unique categories from tips
  const categories = ['all', ...new Set(tips.map(tip => tip.category))];

  // Filter tips by category
  const filteredTips = selectedCategory === 'all' 
    ? tips 
    : tips.filter(tip => tip.category === selectedCategory);

  const toggleTip = (index) => {
    const newExpanded = new Set(expandedTips);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedTips(newExpanded);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 cr-card-gradient">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          🧠 Recomendaciones Inteligentes
        </h2>
        <span className="text-sm text-gray-500">
          {filteredTips.length} de {tips.length} recomendaciones
        </span>
      </div>

      <PerformanceSummary results={results} tips={tips} />

      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="space-y-4">
        {filteredTips.map((tip, index) => (
          <TipCard
            key={`${tip.category}-${index}`}
            tip={tip}
            index={index}
            isExpanded={expandedTips.has(index)}
            onToggle={toggleTip}
          />
        ))}
      </div>

      {filteredTips.length === 0 && selectedCategory !== 'all' && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-2xl mb-2">🔍</div>
          <p>No hay recomendaciones para esta categoría</p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
          >
            Ver todas las recomendaciones
          </button>
        </div>
      )}

      {/* Footer with Costa Rica context */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <span>🇨🇷</span>
          <span>Optimizado para el mercado costarricense</span>
          <span>•</span>
          <span>Datos actualizados 2024</span>
        </div>
      </div>
    </div>
  );
};

export default TipsDisplay;