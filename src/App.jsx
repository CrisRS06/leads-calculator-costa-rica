import React, { useState } from 'react';
import { useLeadsCalculator, useInputValidation } from './hooks/useLeadsCalculator';
import InputPanel from './components/InputPanel';
import ResultsDisplay from './components/ResultsDisplay';
import FunnelChart from './components/FunnelChart';
import TipsDisplay from './components/TipsDisplay';
import './index.css';

/**
 * Modern glassmorphism header with Costa Rica branding
 */
const AppHeader = () => (
  <div className="relative overflow-hidden">
    {/* Background with gradient */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 opacity-90"></div>
    
    {/* Decorative elements */}
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxwYXRoIGQ9Ik0gLTEwIDMwIEwgNTAgLTMwIE0gLTMwIDEwIEwgMzAgLTUwIE0gMTAgLTMwIEwgNzAgMzAiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')] opacity-30"></div>
    
    {/* Content */}
    <header className="relative py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight">
            📊 Calculadora de Leads CR
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-4 text-white font-medium">
            Calcula leads reales • Mejora conversión 30% • Sin burocracia digital
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              🇨🇷 Optimizado para Costa Rica
            </span>
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              ⚡ Resultados en tiempo real
            </span>
            <span className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
              🎯 Basado en datos locales
            </span>
          </div>
        </div>
      </div>
    </header>
  </div>
);

/**
 * Loading overlay component with glassmorphism
 */
const LoadingOverlay = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Calculando...</h3>
          <p className="text-sm text-gray-600">Optimizando para el mercado CR</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Modern footer component
 */
const AppFooter = () => (
  <footer className="bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-12 border-t border-gray-200">
    <div className="max-w-7xl mx-auto">
      <div className="text-center space-y-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium">
            📈 Demo para Marketing/Servicios
          </span>
          <span className="flex items-center gap-1.5 bg-red-50 text-red-700 px-3 py-1.5 rounded-full font-medium">
            🇨🇷 Mercado Costa Rica 2024
          </span>
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full font-medium">
            ⚡ Calculadora Interactiva
          </span>
        </div>
        
        <div className="text-sm text-gray-600 max-w-2xl mx-auto">
          <p>Datos basados en investigación del mercado digital costarricense</p>
          <p className="mt-2">
            Benchmarks actualizados • Métricas locales • Recomendaciones personalizadas
          </p>
        </div>
        
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="inline-block p-1 bg-amber-100 text-amber-700 rounded-full">💡</span>
            <span>
              <strong>Tip:</strong> Los resultados son estimaciones basadas en promedios del mercado CR. 
              Resultados reales pueden variar según industria, segmentación y calidad de campañas.
            </span>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

/**
 * Feature highlight component with modern cards
 */
const FeatureHighlight = () => (
  <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          🚀 Características Destacadas
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "📊",
            title: "Visualización Animada",
            description: "Funnel interactivo que se dibuja secuencialmente con números que cuentan hacia arriba",
            color: "blue"
          },
          {
            icon: "🇨🇷",
            title: "Datos Costa Rica",
            description: "Benchmarks y recomendaciones específicas para el mercado costarricense",
            color: "red"
          },
          {
            icon: "🧠",
            title: "IA Recomendaciones",
            description: "Tips inteligentes basados en reglas y mejores prácticas locales",
            color: "emerald"
          }
        ].map((feature, index) => (
          <div
            key={index}
            className="relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-${feature.color}-500/20 to-${feature.color}-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-lg shadow-gray-100/50 h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className={`text-3xl mb-4 p-3 inline-block rounded-xl bg-${feature.color}-50 text-${feature.color}-500`}>{feature.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/**
 * Custom glassmorphism card component
 */
const GlassCard = ({ children, className = "" }) => (
  <div
    className={`border rounded-2xl overflow-hidden bg-white/90 backdrop-blur-sm border-white/20 shadow-lg ${className}`}
  >
    <div className="size-full bg-repeat bg-[length:30px_30px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMTVoMzAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9Ii4wMiIgc3Ryb2tlLXdpZHRoPSIuNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')]">
      <div className="size-full bg-gradient-to-tr from-white/90 via-white/40 to-white/10">
        {children}
      </div>
    </div>
  </div>
);

/**
 * Main App component
 */
function App() {
  const [showFeatures, setShowFeatures] = useState(true);
  
  // Main calculator hook
  const {
    inputs,
    updateInput,
    resetToDefaults,
    results,
    tips,
    isCalculating,
    shouldShowAnimation,
    isFirstCalculation,
    marketDefaults
  } = useLeadsCalculator();
  
  // Input validation hook
  const validation = useInputValidation(inputs);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Loading overlay */}
      <LoadingOverlay isVisible={isCalculating} />
      
      {/* Header */}
      <AppHeader />
      
      {/* Feature highlight (only show initially) */}
      {showFeatures && isFirstCalculation && (
        <FeatureHighlight />
      )}
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Input Panel */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6">
              <InputPanel
                inputs={inputs}
                updateInput={updateInput}
                resetToDefaults={resetToDefaults}
                validation={validation}
                isCalculating={isCalculating}
                marketDefaults={marketDefaults}
              />
            </GlassCard>
            
            {/* Tips below input on mobile, hidden on desktop */}
            <div className="mt-8 lg:hidden">
              <GlassCard className="p-6">
                <TipsDisplay tips={tips} results={results} />
              </GlassCard>
            </div>
          </div>
          
          {/* Right columns - Results and Visualization */}
          <div className="lg:col-span-2 space-y-8">
            {/* Results Display */}
            <GlassCard className="p-6">
              <ResultsDisplay
                results={results}
                shouldAnimate={shouldShowAnimation}
                isCalculating={isCalculating}
              />
            </GlassCard>
            
            {/* Funnel Chart */}
            <GlassCard className="p-6">
              <FunnelChart
                results={results}
                shouldAnimate={shouldShowAnimation}
                isCalculating={isCalculating}
              />
            </GlassCard>
            
            {/* Tips - visible only on desktop */}
            <div className="hidden lg:block">
              <GlassCard className="p-6">
                <TipsDisplay tips={tips} results={results} />
              </GlassCard>
            </div>
          </div>
        </div>
        
        {/* Quick actions */}
        {results && !isFirstCalculation && (
          <div className="mt-12">
            <GlassCard className="p-8 bg-gradient-to-r from-blue-50 to-emerald-50">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  🎯 ¿Quieres mejorar estos resultados?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <button
                    onClick={resetToDefaults}
                    className="group px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all duration-300 border border-gray-200 shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    🔄 Reiniciar
                  </button>
                  
                  <button
                    onClick={() => setShowFeatures(!showFeatures)}
                    className="group px-4 py-3 bg-white hover:bg-blue-50 text-blue-600 rounded-xl font-medium transition-all duration-300 border border-blue-100 shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    ℹ️ Ver Características
                  </button>
                  
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="group px-4 py-3 bg-white hover:bg-emerald-50 text-emerald-600 rounded-xl font-medium transition-all duration-300 border border-emerald-100 shadow-sm hover:shadow flex items-center justify-center gap-2"
                  >
                    ⬆️ Ir Arriba
                  </button>
                </div>
                
                <p className="text-sm text-gray-600 mt-6 bg-white/50 backdrop-blur-sm p-3 rounded-lg inline-block">
                  <span className="inline-block p-1 bg-amber-100 text-amber-700 rounded-full mr-2">💡</span>
                  <strong>Próximo paso:</strong> Implementa las recomendaciones de alta prioridad para maximizar tu ROI
                </p>
              </div>
            </GlassCard>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <AppFooter />
    </div>
  );
}

export default App;
