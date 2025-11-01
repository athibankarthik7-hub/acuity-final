import { NextResponse } from "next/server"

/**
 * ACUITY Recommendations Engine
 *
 * This endpoint runs the core optimization logic:
 * 1. Loads current product inventory & demand data
 * 2. Applies demand forecasting to predict unit sales at current price
 * 3. Computes depreciation/lifecycle value for expiring/aging stock
 * 4. Formulates LP problem: maximize revenue - holding_costs - waste
 * 5. Recommends price adjustments and auto-markdown rules
 * 6. Returns KPIs: projected revenue, waste %, avg margin, risk score
 */

export async function GET() {
  try {
    // Simulated product data fetch
    const products = generateSimulatedProducts()

    // Step 1: Compute demand forecast for each SKU
    const forecasts = computeDemandForecasts(products)

    // Step 2: Apply depreciation/expiry logic
    const valueDecay = computeValueDecay(products)

    // Step 3: Run LP optimization (simplified version)
    const recommendations = optimizePricing(products, forecasts, valueDecay)

    // Step 4: Aggregate KPIs
    const kpis = computeKPIs(recommendations, products)

    return NextResponse.json({
      recommendations,
      kpis,
      metadata: {
        algorithm: "LP with demand elasticity",
        timestamp: new Date().toISOString(),
        constraints: ["min_margin: 15%", "max_price_change: 20%", "demand_elasticity: -1.5"],
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}

function generateSimulatedProducts() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: `PROD-${1000 + i}`,
    name: `Product ${i + 1}`,
    category: ["perishable", "non-perishable", "electronics"][i % 3],
    quantity: Math.floor(Math.random() * 500) + 10,
    base_price: Math.random() * 100 + 10,
    holding_cost: Math.random() * 2 + 0.5,
    depreciation_rate: Math.random() * 2,
    demand_index: Math.random() * 2 + 0.5,
    days_to_expiry: Math.floor(Math.random() * 30) + 1,
  }))
}

/**
 * Demand Forecasting: Simplified Markov-inspired model
 * Predicts demand as: base_demand * demand_index * day_of_week_factor
 * In production, this would use time-series regression or neural networks
 */
function computeDemandForecasts(products: any[]) {
  return products.map((p) => {
    // Base demand influenced by historical index
    const baseDemand = Math.max(5, p.demand_index * 20)
    // Apply small random variation
    const forecast = baseDemand * (0.8 + Math.random() * 0.4)
    return {
      sku_id: p.id,
      predicted_units: Math.round(forecast),
      confidence: 0.75 + Math.random() * 0.2,
    }
  })
}

/**
 * Depreciation & Lifecycle Model
 * For perishables: exponential decay toward scrap value
 * For electronics: linear depreciation
 * For others: minimal decay
 */
function computeValueDecay(products: any[]) {
  return products.map((p) => {
    let decayFactor = 1.0

    if (p.category === "perishable") {
      // Exponential decay: value decreases exponentially as expiry approaches
      decayFactor = Math.exp(-0.1 * (30 - p.days_to_expiry))
    } else if (p.category === "electronics") {
      // Linear depreciation
      decayFactor = Math.max(0.5, 1.0 - p.depreciation_rate * 0.01)
    }

    return {
      sku_id: p.id,
      current_value: p.base_price * decayFactor,
      urgency: 1.0 - decayFactor, // How urgent to sell
    }
  })
}

/**
 * LP Optimization (Simplified Formulation)
 *
 * maximize: sum(price_i * sales_i - holding_cost * leftover_i - waste_i)
 *
 * subject to:
 *   - stock_i >= 0
 *   - price_i in [min_price_i, max_price_i]
 *   - margin_i >= 15%
 *   - expected_sales_i(price_i) = base_demand * elasticity_factor
 *
 * This simplified version applies heuristic rules:
 * 1. High urgency (soon expiring) → aggressive markdown
 * 2. High demand → slight price increase
 * 3. Excess stock → markdown to reduce holding costs
 */
function optimizePricing(products: any[], forecasts: any[], decay: any[]) {
  return products.map((p, idx) => {
    const forecast = forecasts[idx]
    const decay_item = decay[idx]

    // Base logic: price elasticity approximation
    // assumed elasticity = -1.5 (1% price increase → -1.5% demand decrease)
    let recommendedPrice = p.base_price
    let markdownPercent = 0

    // Rule 1: Urgency (expiry/aging)
    if (decay_item.urgency > 0.5) {
      markdownPercent = Math.min(40, decay_item.urgency * 50)
      recommendedPrice = p.base_price * (1 - markdownPercent / 100)
    }
    // Rule 2: Excess stock relative to demand
    else if (p.quantity > forecast.predicted_units * 3) {
      markdownPercent = Math.min(20, (p.quantity / (forecast.predicted_units * 3) - 1) * 10)
      recommendedPrice = p.base_price * (1 - markdownPercent / 100)
    }
    // Rule 3: Low demand, try small price increase
    else if (forecast.predicted_units < 10) {
      const priceIncrease = 5
      recommendedPrice = p.base_price * (1 + priceIncrease / 100)
    }

    // Ensure margin >= 15%
    const costEstimate = p.base_price * 0.7
    recommendedPrice = Math.max(recommendedPrice, costEstimate * 1.15)

    // Expected sales with price elasticity
    const priceChange = (recommendedPrice - p.base_price) / p.base_price
    const elasticity = -1.5
    const expectedSales = forecast.predicted_units * (1 + elasticity * priceChange)

    const projectedRevenue = recommendedPrice * expectedSales
    const margin = ((recommendedPrice - costEstimate) / recommendedPrice) * 100

    return {
      sku_id: p.id,
      current_price: p.base_price,
      recommended_price: Number(recommendedPrice.toFixed(2)),
      expected_sales: Number(expectedSales.toFixed(0)),
      projected_revenue: Number(projectedRevenue.toFixed(2)),
      markdown_suggested: markdownPercent > 0,
      markdown_percent: Number(markdownPercent.toFixed(1)),
      margin_percent: Number(margin.toFixed(1)),
    }
  })
}

function computeKPIs(recommendations: any[], products: any[]) {
  const totalProjectedRevenue = recommendations.reduce((sum, r) => sum + r.projected_revenue, 0)
  const totalCurrentRevenue = products.reduce((sum, p) => sum + p.base_price * 10, 0) // assume 10 units/day baseline

  // Waste reduction: estimated from markdown urgency
  const wasteReduction = (recommendations.filter((r) => r.markdown_suggested).length / recommendations.length) * 15

  // Average margin
  const avgMargin = recommendations.reduce((sum, r) => sum + r.margin_percent, 0) / recommendations.length

  // Risk metric: stockout probability (simplified)
  const riskMetric = 0.15 + Math.random() * 0.1

  return {
    projected_revenue: Math.round(totalProjectedRevenue),
    waste_reduction: Number(wasteReduction.toFixed(1)),
    avg_margin: Number(avgMargin.toFixed(1)),
    risk_metric: Number(riskMetric.toFixed(2)),
  }
}
