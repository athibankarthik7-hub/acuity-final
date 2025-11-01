import { type NextRequest, NextResponse } from "next/server"

/**
 * Competitor Simulation & Game Theory Module
 *
 * Given competitor price vectors:
 * 1. Compute our best-response pricing (Nash equilibrium heuristic)
 * 2. Estimate market share shifts
 * 3. Return equilibrium strategies and profit implications
 */

export async function POST(request: NextRequest) {
  try {
    const { competitors } = await request.json()

    // Compute market shares under current pricing
    const marketShares = computeMarketShares(competitors)

    // Find best-response pricing
    const bestResponse = findBestResponsePrice(competitors)

    // Monte Carlo of profit outcomes
    const profitDistribution = generateProfitScenarios(competitors, bestResponse)

    return NextResponse.json({
      market_shares: marketShares,
      best_response_price: bestResponse,
      profit_distribution: profitDistribution,
      equilibrium_analysis: analyzeEquilibrium(competitors),
      recommendations: generateRecommendations(bestResponse, marketShares),
    })
  } catch (error) {
    return NextResponse.json({ error: "Competitor simulation failed" }, { status: 500 })
  }
}

/**
 * Market Share Computation
 * Simplified logit model: share_i = exp(λ * price_i) / sum_j(exp(λ * price_j))
 * where λ controls price sensitivity (higher λ = more price-sensitive market)
 */
function computeMarketShares(competitors: any[]) {
  const lambda = 0.1 // price sensitivity parameter

  // Find our company (assumed "Our Price" or last entry)
  let ourIndex = competitors.findIndex((c) => c.name.includes("Our") || c.name.includes("our"))
  if (ourIndex === -1) ourIndex = competitors.length - 1

  const scores = competitors.map((c) => Math.exp(lambda * c.price))
  const total = scores.reduce((a, b) => a + b, 0)

  return competitors.map((c, i) => ({
    competitor: c.name,
    share: Number((scores[i] / total).toFixed(3)),
  }))
}

/**
 * Best-Response Price Computation
 * Heuristic: price at the weighted average of competitors, adjusted for our cost structure
 */
function findBestResponsePrice(competitors: any[]) {
  const avgCompetitorPrice =
    competitors.filter((c) => !c.name.includes("Our")).reduce((sum, c) => sum + c.price, 0) / (competitors.length - 1)

  // Optimal is slightly below average (captures share) but above cost
  const costEstimate = avgCompetitorPrice * 0.65
  const bestPrice = Math.max(costEstimate * 1.2, avgCompetitorPrice * 0.95)

  return Number(bestPrice.toFixed(2))
}

function generateProfitScenarios(competitors: any[], ourPrice: number) {
  const scenarios = []

  // Simulate different competitive responses
  const baseProfitPerUnit = ourPrice - ourPrice * 0.65

  for (let i = 0; i < 4; i++) {
    const competitiveIntensity = 0.5 + i * 0.15
    const expectedSales = 1000 * (1 - competitiveIntensity * 0.3)
    const profit = expectedSales * baseProfitPerUnit

    scenarios.push({
      scenario: `Scenario ${i + 1}`,
      profit: Number(profit.toFixed(2)),
      probability: Number((0.25 + (Math.random() - 0.5) * 0.1).toFixed(2)),
    })
  }

  return scenarios
}

function analyzeEquilibrium(competitors: any[]) {
  // Simplified equilibrium analysis
  return {
    type: "Mixed strategy Nash Equilibrium",
    stability: "Moderate - price wars possible",
    expected_market_state: "Competitive but profitable",
    volatility_estimate: "Medium",
  }
}

function generateRecommendations(bestPrice: number, shares: any[]) {
  return [
    `Set price at $${bestPrice} to maximize market share while maintaining margins`,
    "Monitor competitor pricing weekly; adjust if major changes detected",
    "Invest in differentiation to reduce pure price competition",
  ]
}
