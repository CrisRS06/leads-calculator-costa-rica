// Costa Rica Leads Calculator - Core Business Logic

// Costa Rica Digital Marketing Constants
export const CR_MARKET_DEFAULTS = {
  currency: '₡',
  avgCostPerClick: 750,        // ₡750 typical for CR market
  avgClickRate: 2.3,           // 2.3% average CTR for SMEs in CR
  avgConversionRate: 4.2,      // 4.2% average conversion rate
  avgLeadValue: 45000,         // ₡45,000 average lead value in CR
  
  // Industry benchmarks for Costa Rica
  benchmarks: {
    clickRate: {
      excellent: 4.0,
      good: 2.5,
      average: 1.8,
      poor: 1.0
    },
    conversionRate: {
      excellent: 8.0,
      good: 5.0,
      average: 3.0,
      poor: 1.5
    },
    costPerLead: {
      excellent: 8000,   // ₡8K per lead
      good: 12000,       // ₡12K per lead
      acceptable: 18000, // ₡18K per lead
      expensive: 25000   // ₡25K+ per lead
    }
  }
};

/**
 * Calculate complete marketing funnel metrics
 * @param {Object} inputs - User input parameters
 * @param {number} inputs.investment - Monthly ad investment in colones
 * @param {number} inputs.costPerClick - Cost per click in colones
 * @param {number} inputs.clickRate - Click-through rate as percentage
 * @param {number} inputs.conversionRate - Lead conversion rate as percentage
 * @returns {Object} Complete funnel metrics
 */
export const calculateLeadsFunnel = (inputs) => {
  const { investment, costPerClick, clickRate, conversionRate } = inputs;
  
  // Input validation
  if (!investment || !costPerClick || !clickRate || !conversionRate) {
    return null;
  }
  
  // Stage 1: Calculate potential impressions
  // Formula: Investment ÷ (CPC × CTR/100) = Impressions needed for clicks
  const impressions = Math.round(investment / (costPerClick * (clickRate / 100)));
  
  // Stage 2: Calculate clicks from impressions
  // Formula: Impressions × (CTR/100) = Total clicks
  const clicks = Math.round(impressions * (clickRate / 100));
  
  // Stage 3: Calculate leads from clicks
  // Formula: Clicks × (Conversion Rate/100) = Total leads
  const leads = Math.round(clicks * (conversionRate / 100));
  
  // Stage 4: Calculate efficiency metrics
  const costPerLead = leads > 0 ? Math.round(investment / leads) : 0;
  const leadValue = CR_MARKET_DEFAULTS.avgLeadValue;
  const totalLeadValue = leads * leadValue;
  const roi = leads > 0 ? Math.round(((totalLeadValue - investment) / investment) * 100) : 0;
  
  // Calculate funnel conversion rates
  const impressionToClick = clickRate;
  const clickToLead = conversionRate;
  const impressionToLead = (leads / impressions) * 100;
  
  return {
    // Funnel stages
    impressions,
    clicks,
    leads,
    
    // Cost metrics
    costPerLead,
    costPerClick,
    totalInvestment: investment,
    
    // Value metrics
    leadValue,
    totalLeadValue,
    roi,
    
    // Input rates (CRITICAL: needed by ResultsDisplay MetricCard)
    clickRate,
    conversionRate,
    
    // Conversion metrics
    impressionToClick,
    clickToLead,
    impressionToLead,
    
    // Performance indicators
    performance: evaluatePerformance({
      clickRate,
      conversionRate,
      costPerLead,
      roi
    })
  };
};

/**
 * Evaluate performance against Costa Rica market benchmarks
 * @param {Object} metrics - Performance metrics to evaluate
 * @returns {Object} Performance evaluation with ratings
 */
export const evaluatePerformance = (metrics) => {
  const { clickRate, conversionRate, costPerLead, roi } = metrics;
  const { benchmarks } = CR_MARKET_DEFAULTS;
  
  // Click Rate Performance
  let clickRatePerformance = 'poor';
  if (clickRate >= benchmarks.clickRate.excellent) clickRatePerformance = 'excellent';
  else if (clickRate >= benchmarks.clickRate.good) clickRatePerformance = 'good';
  else if (clickRate >= benchmarks.clickRate.average) clickRatePerformance = 'average';
  
  // Conversion Rate Performance
  let conversionPerformance = 'poor';
  if (conversionRate >= benchmarks.conversionRate.excellent) conversionPerformance = 'excellent';
  else if (conversionRate >= benchmarks.conversionRate.good) conversionPerformance = 'good';
  else if (conversionRate >= benchmarks.conversionRate.average) conversionPerformance = 'average';
  
  // Cost Efficiency Performance
  let costEfficiency = 'expensive';
  if (costPerLead <= benchmarks.costPerLead.excellent) costEfficiency = 'excellent';
  else if (costPerLead <= benchmarks.costPerLead.good) costEfficiency = 'good';
  else if (costPerLead <= benchmarks.costPerLead.acceptable) costEfficiency = 'acceptable';
  
  // Overall ROI Performance
  let roiPerformance = 'poor';
  if (roi >= 200) roiPerformance = 'excellent';
  else if (roi >= 100) roiPerformance = 'good';
  else if (roi >= 50) roiPerformance = 'average';
  
  return {
    clickRate: clickRatePerformance,
    conversion: conversionPerformance,
    cost: costEfficiency,
    roi: roiPerformance,
    overall: calculateOverallScore(clickRatePerformance, conversionPerformance, costEfficiency, roiPerformance)
  };
};

/**
 * Calculate overall performance score
 * @param {...string} performances - Individual performance ratings
 * @returns {string} Overall performance rating
 */
const calculateOverallScore = (...performances) => {
  const scores = performances.map(p => {
    switch (p) {
      case 'excellent': return 4;
      case 'good': return 3;
      case 'average': return 2;
      default: return 1;
    }
  });
  
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  if (avgScore >= 3.5) return 'excellent';
  if (avgScore >= 2.5) return 'good';
  if (avgScore >= 1.5) return 'average';
  return 'poor';
};

/**
 * Generate rule-based tips for Costa Rica market
 * @param {Object} results - Calculation results
 * @param {Object} inputs - Original inputs
 * @returns {Array} Array of tips and recommendations
 */
export const generateMarketingTips = (results, inputs) => {
  const tips = [];
  
  if (!results || !inputs) return tips;
  
  const { leads, costPerLead, roi, performance } = results;
  const { investment, clickRate, conversionRate } = inputs;
  
  // Low Conversion Rate Tips
  if (conversionRate < 3) {
    tips.push({
      type: 'warning',
      category: 'conversion',
      title: 'Conversión Baja',
      message: 'Tu tasa de conversión está por debajo del promedio costarricense (4.2%)',
      action: 'Optimiza tu landing page con testimonios locales y formularios cortos',
      priority: 'high',
      impact: 'Alto - Puede duplicar tus leads'
    });
  }
  
  // High Cost Per Lead Tips
  if (costPerLead > 15000) {
    tips.push({
      type: 'info',
      category: 'cost',
      title: 'Costo por Lead Alto',
      message: `₡${costPerLead.toLocaleString()} por lead está sobre el promedio CR (₡12,000)`,
      action: 'Segmenta por provincia o ajusta palabras clave negativas',
      priority: 'medium',
      impact: 'Medio - Reduce costos 20-30%'
    });
  }
  
  // Low Budget Tips
  if (investment < 100000) {
    tips.push({
      type: 'suggestion',
      category: 'budget',
      title: 'Presupuesto Limitado',
      message: 'Con presupuestos menores a ₡100,000 es difícil competir en mercados amplios',
      action: 'Enfócate en nichos específicos o audiencias locales muy segmentadas',
      priority: 'medium',
      impact: 'Medio - Mejor eficiencia del presupuesto'
    });
  }
  
  // Low Click Rate Tips
  if (clickRate < 2) {
    tips.push({
      type: 'warning',
      category: 'traffic',
      title: 'CTR Bajo',
      message: 'Tus anuncios no están generando suficiente interés',
      action: 'Prueba anuncios con referencias culturales ticas o promociones limitadas',
      priority: 'high',
      impact: 'Alto - Más tráfico con mismo presupuesto'
    });
  }
  
  // ROI Tips
  if (roi < 100) {
    tips.push({
      type: 'warning',
      category: 'roi',
      title: 'ROI Bajo',
      message: 'Tu retorno de inversión está por debajo del 100%',
      action: 'Revisa tu propuesta de valor y precios para el mercado costarricense',
      priority: 'high',
      impact: 'Crítico - Rentabilidad del negocio'
    });
  }
  
  // Positive Performance Tips
  if (performance.overall === 'excellent') {
    tips.push({
      type: 'success',
      category: 'optimization',
      title: '¡Excelente Rendimiento!',
      message: 'Tus métricas están por encima del promedio costarricense',
      action: 'Considera aumentar presupuesto para escalar estos resultados',
      priority: 'low',
      impact: 'Alto - Oportunidad de crecimiento'
    });
  }
  
  // Market-Specific Tips for Costa Rica
  if (leads > 0) {
    tips.push({
      type: 'info',
      category: 'market',
      title: 'Tip Mercado CR',
      message: 'En Costa Rica, WhatsApp Business tiene 40% más conversión que email',
      action: 'Integra WhatsApp en tu estrategia de seguimiento de leads',
      priority: 'low',
      impact: 'Medio - Mejor conversión de leads'
    });
  }
  
  return tips.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

/**
 * Format currency for Costa Rica
 * @param {number} amount - Amount in colones
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount >= 1000000) {
    return `₡${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₡${(amount / 1000).toFixed(0)}K`;
  }
  return `₡${amount.toLocaleString()}`;
};

/**
 * Format percentage
 * @param {number} percentage - Percentage value
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage) => {
  // Safety check to prevent TypeError when percentage is undefined
  if (percentage === null || percentage === undefined || isNaN(percentage)) {
    return '0.0%';
  }
  return `${percentage.toFixed(1)}%`;
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};