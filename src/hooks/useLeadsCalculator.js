import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  calculateLeadsFunnel, 
  generateMarketingTips, 
  CR_MARKET_DEFAULTS 
} from '../utils/calculations';

/**
 * Custom hook for debouncing values
 * @param {*} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {*} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for counting number animations
 * @param {number} targetValue - Target number to count to
 * @param {number} duration - Animation duration in milliseconds
 * @param {boolean} isActive - Whether animation should be active
 * @returns {number} Current animated value
 */
export const useCountingAnimation = (targetValue, duration = 1500, isActive = true) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!isActive || targetValue === 0) {
      setCurrentValue(0);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo easing function
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentAnimatedValue = Math.floor(startValue + (targetValue - startValue) * easeOutExpo);
      setCurrentValue(currentAnimatedValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    // Small delay to create staggered animation effect
    const timeoutId = setTimeout(() => {
      requestAnimationFrame(animate);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [targetValue, duration, isActive]);

  return currentValue;
};

/**
 * Animation states for the calculator
 */
export const ANIMATION_STATES = {
  IDLE: 'idle',
  CALCULATING: 'calculating',
  ANIMATING: 'animating',
  COMPLETE: 'complete'
};

/**
 * Main leads calculator hook with state management and animations
 * @returns {Object} Calculator state and methods
 */
export const useLeadsCalculator = () => {
  // Input state with Costa Rica market defaults
  const [inputs, setInputs] = useState({
    investment: 150000,  // ₡150K default investment
    costPerClick: CR_MARKET_DEFAULTS.avgCostPerClick,
    clickRate: CR_MARKET_DEFAULTS.avgClickRate,
    conversionRate: CR_MARKET_DEFAULTS.avgConversionRate
  });

  // Animation and UI state
  const [animationState, setAnimationState] = useState(ANIMATION_STATES.IDLE);
  const [isFirstCalculation, setIsFirstCalculation] = useState(true);

  // Debounce inputs to avoid excessive calculations
  const debouncedInputs = useDebounce(inputs, 500);

  // Calculate results when debounced inputs change
  const results = useMemo(() => {
    if (!debouncedInputs.investment || !debouncedInputs.costPerClick || 
        !debouncedInputs.clickRate || !debouncedInputs.conversionRate) {
      return null;
    }

    return calculateLeadsFunnel(debouncedInputs);
  }, [debouncedInputs]);

  // Generate tips based on results
  const tips = useMemo(() => {
    if (!results || !debouncedInputs) return [];
    return generateMarketingTips(results, debouncedInputs);
  }, [results, debouncedInputs]);

  // Animation orchestration
  useEffect(() => {
    if (!results) return;

    setAnimationState(ANIMATION_STATES.CALCULATING);

    // Short delay to show calculating state
    const calculatingTimeout = setTimeout(() => {
      setAnimationState(ANIMATION_STATES.ANIMATING);
      setIsFirstCalculation(false);
    }, 200);

    // Complete animation after funnel drawing and counting
    const completeTimeout = setTimeout(() => {
      setAnimationState(ANIMATION_STATES.COMPLETE);
    }, 2500);

    return () => {
      clearTimeout(calculatingTimeout);
      clearTimeout(completeTimeout);
    };
  }, [results]);

  // Reset animation state when inputs change (not debounced)
  useEffect(() => {
    if (animationState !== ANIMATION_STATES.IDLE) {
      setAnimationState(ANIMATION_STATES.IDLE);
    }
  }, [inputs, animationState]); // Note: using inputs, not debouncedInputs for immediate feedback

  // Update input methods
  const updateInput = useCallback((field, value) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const updateAllInputs = useCallback((newInputs) => {
    setInputs(newInputs);
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setInputs({
      investment: 150000,
      costPerClick: CR_MARKET_DEFAULTS.avgCostPerClick,
      clickRate: CR_MARKET_DEFAULTS.avgClickRate,
      conversionRate: CR_MARKET_DEFAULTS.avgConversionRate
    });
    setAnimationState(ANIMATION_STATES.IDLE);
    setIsFirstCalculation(true);
  }, []);

  // Derived state
  const isCalculating = animationState === ANIMATION_STATES.CALCULATING;
  const isAnimating = animationState === ANIMATION_STATES.ANIMATING;
  const isComplete = animationState === ANIMATION_STATES.COMPLETE;
  const shouldShowAnimation = !isFirstCalculation && (isAnimating || isComplete);

  return {
    // Input state
    inputs,
    debouncedInputs,
    updateInput,
    updateAllInputs,
    resetToDefaults,

    // Results
    results,
    tips,

    // Animation state
    animationState,
    isCalculating,
    isAnimating,
    isComplete,
    shouldShowAnimation,
    isFirstCalculation,

    // Validation
    isValid: results !== null,
    
    // Market defaults for reference
    marketDefaults: CR_MARKET_DEFAULTS
  };
};

/**
 * Hook for managing Chart.js animation state
 * @param {Object} results - Calculation results
 * @param {boolean} shouldAnimate - Whether to trigger animation
 * @returns {Object} Chart data and animation config
 */
export const useChartAnimation = (results, shouldAnimate) => {
  const [chartData, setChartData] = useState(null);
  const [animationConfig, setAnimationConfig] = useState(null);

  useEffect(() => {
    if (!results || !shouldAnimate) {
      setChartData(null);
      return;
    }

    // Prepare chart data with animation delays
    const data = {
      labels: ['Impresiones', 'Clics', 'Leads', 'Conversión'],
      datasets: [{
        label: 'Funnel de Conversión',
        data: [
          results.impressions,
          results.clicks,
          results.leads,
          results.leads // End point for visual effect
        ],
        borderColor: '#002E6D', // Costa Rica blue
        backgroundColor: 'rgba(0, 46, 109, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#002E6D',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };

    const config = {
      animation: {
        duration: 2000,
        delay: (context) => {
          // Sequential delay for each point
          return context.dataIndex * 500;
        },
        easing: 'easeOutQuart'
      },
      elements: {
        line: {
          borderJoinStyle: 'round'
        },
        point: {
          hoverBorderWidth: 3
        }
      }
    };

    setChartData(data);
    setAnimationConfig(config);
  }, [results, shouldAnimate]);

  return { chartData, animationConfig };
};

/**
 * Hook for input validation with Costa Rica market context
 * @param {Object} inputs - Current inputs
 * @returns {Object} Validation state and messages
 */
export const useInputValidation = (inputs) => {
  const validation = useMemo(() => {
    const errors = {};
    const warnings = {};

    // Investment validation
    if (inputs.investment < 50000) {
      warnings.investment = 'Presupuesto muy bajo para el mercado CR';
    } else if (inputs.investment > 1000000) {
      warnings.investment = 'Presupuesto alto - considera segmentar campañas';
    }

    // Cost per click validation
    if (inputs.costPerClick < 200) {
      warnings.costPerClick = 'CPC muy bajo - posible baja calidad de tráfico';
    } else if (inputs.costPerClick > 2000) {
      warnings.costPerClick = 'CPC alto para mercado CR';
    }

    // Click rate validation
    if (inputs.clickRate < 1) {
      warnings.clickRate = 'CTR bajo - revisa creativos y segmentación';
    } else if (inputs.clickRate > 10) {
      warnings.clickRate = 'CTR muy alto - posible tráfico no cualificado';
    }

    // Conversion rate validation
    if (inputs.conversionRate < 1) {
      warnings.conversionRate = 'Conversión muy baja - optimiza landing page';
    } else if (inputs.conversionRate > 15) {
      warnings.conversionRate = 'Conversión alta - verifica datos';
    }

    const hasErrors = Object.keys(errors).length > 0;
    const hasWarnings = Object.keys(warnings).length > 0;

    return {
      errors,
      warnings,
      hasErrors,
      hasWarnings,
      isValid: !hasErrors
    };
  }, [inputs]);

  return validation;
};