"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import { ChevronDown, ChevronUp } from "lucide-react"

interface SectionProps {
  title: string
  children: React.ReactNode
}

function CollapsibleSection({ title, children }: SectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 bg-card hover:bg-accent/5 flex items-center justify-between transition-colors"
      >
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-primary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div className="px-6 py-4 bg-background border-t border-border">{children}</div>}
    </div>
  )
}

export default function InsideAcuityPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Inside ACUITY</h1>
          <p className="text-muted-foreground text-lg">
            Explore the algorithms, formulas, and logic powering ACUITY pricing recommendations
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Demand Forecasting */}
          <CollapsibleSection title="1. Demand Forecasting Model">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY predicts product demand using a simplified time-series approach with seasonal factors.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Base Formula:</p>
                <div className="text-foreground font-mono text-sm">
                  <p>Predicted Demand = Base Demand × Demand Index × Day-of-Week Factor</p>
                  <p className="mt-2">Where:</p>
                  <p>• Base Demand = Historical average sales</p>
                  <p>• Demand Index = Category-specific multiplier (0.5 - 2.0)</p>
                  <p>• Day-of-Week Factor = Seasonal adjustment (0.8 - 1.2)</p>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Confidence Level:</strong> 75-95% based on historical data consistency
              </p>

              <p className="text-foreground text-sm">
                <strong>Production Implementation:</strong> In real-world deployments, this would use ARIMA, exponential
                smoothing, or neural networks trained on 2+ years of historical data.
              </p>
            </div>
          </CollapsibleSection>

          {/* Price Elasticity */}
          <CollapsibleSection title="2. Price Elasticity & Demand Response">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY models how demand responds to price changes using the elasticity coefficient.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Elasticity Formula:</p>
                <div className="text-foreground font-mono text-sm">
                  <p>Demand Change = Base Demand × Elasticity × Price Change %</p>
                  <p className="mt-2">Expected Sales = Base Demand × (1 + Elasticity × ΔPrice)</p>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Default Elasticity (ε):</strong> -1.5
              </p>
              <p className="text-foreground text-sm ml-4">
                • This means a 1% price increase leads to -1.5% demand decrease
              </p>
              <p className="text-foreground text-sm ml-4">• Configurable in Settings (range: -0.5 to -3.0)</p>

              <p className="text-foreground text-sm">
                <strong>Example:</strong> If base demand is 100 units and you increase price by 10%:
              </p>
              <p className="text-foreground text-sm ml-4 font-mono">
                Expected Sales = 100 × (1 + (-1.5) × 0.10) = 100 × 0.85 = 85 units
              </p>
            </div>
          </CollapsibleSection>

          {/* Depreciation Model */}
          <CollapsibleSection title="3. Depreciation & Value Decay Model">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY applies category-specific depreciation to products based on their lifecycle.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Depreciation Formulas:</p>
                <div className="text-foreground font-mono text-sm space-y-2">
                  <div>
                    <p className="font-semibold">Perishable Products (Exponential):</p>
                    <p>Decay Factor = e^(-0.1 × (30 - Days to Expiry))</p>
                    <p className="text-xs mt-1">Example: 5 days to expiry → decay = e^(-2.5) ≈ 0.08 (92% value loss)</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">Electronics (Linear):</p>
                    <p>Decay Factor = max(0.5, 1.0 - Depreciation Rate × 0.01)</p>
                    <p className="text-xs mt-1">Example: 2% depreciation rate → decay = 1.0 - 0.02 = 0.98</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold">Non-Perishable (Minimal):</p>
                    <p>Decay Factor = 1.0 (no depreciation)</p>
                  </div>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Current Value</strong> = Base Price × Decay Factor
              </p>
            </div>
          </CollapsibleSection>

          {/* LP Optimization */}
          <CollapsibleSection title="4. Linear Programming (LP) Optimization Engine">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY formulates a linear program to maximize profitability while respecting business constraints.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Optimization Problem:</p>
                <div className="text-foreground font-mono text-sm space-y-3">
                  <div>
                    <p className="font-semibold">Objective (Maximize):</p>
                    <p>Profit = Σ (Price_i × Expected Sales_i - Holding Cost × Leftover_i - Waste_i)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Subject to Constraints:</p>
                    <p>• Price_i ∈ [Min Price, Max Price]</p>
                    <p>• Margin_i ≥ Minimum Margin (default: 15%)</p>
                    <p>• Price Change ≤ Max Price Change (default: 20%)</p>
                    <p>• Stock_i ≥ 0</p>
                  </div>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Optimization Rules (Heuristic):</strong>
              </p>
              <ul className="text-foreground text-sm space-y-1 ml-4">
                <li>• High Urgency (expiring soon) → Aggressive markdown (up to 40%)</li>
                <li>• Excess Stock (3× demand) → Moderate markdown (up to 20%)</li>
                <li>• Low Demand (&lt;10 units) → Small price increase (+5%)</li>
                <li>• All prices enforced to maintain minimum 15% margin</li>
              </ul>
            </div>
          </CollapsibleSection>

          {/* Monte Carlo Simulation */}
          <CollapsibleSection title="5. Monte Carlo Simulation (Risk Analysis)">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY runs 1000+ Monte Carlo simulations to model demand uncertainty and profit distribution.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Simulation Process:</p>
                <div className="text-foreground font-mono text-sm space-y-2">
                  <p>1. For each iteration (1000 samples):</p>
                  <p className="ml-4">• Sample demand from normal distribution: Demand ~ N(μ, σ)</p>
                  <p className="ml-4">• Apply stochastic competitor behavior</p>
                  <p className="ml-4">• Compute resulting profit/revenue</p>
                  <p>2. Aggregate results:</p>
                  <p className="ml-4">• Mean profit, std deviation, percentiles (5th, 25th, 50th, 75th, 95th)</p>
                  <p className="ml-4">• Probability of losses, optimal price distribution</p>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Outputs:</strong> Profit distribution, Value at Risk (VaR), Conditional Value at Risk (CVaR)
              </p>
            </div>
          </CollapsibleSection>

          {/* Market Share Model */}
          <CollapsibleSection title="6. Game Theory & Market Share Model">
            <div className="space-y-4">
              <p className="text-foreground">
                ACUITY uses a logit-based model to estimate market share under different pricing scenarios.
              </p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <p className="text-sm font-semibold text-foreground mb-2">Market Share Formula (Logit):</p>
                <div className="text-foreground font-mono text-sm">
                  <p>Market Share_i = exp(λ × Price_i) / Σ_j exp(λ × Price_j)</p>
                  <p className="mt-2">Where:</p>
                  <p>• λ = Price sensitivity parameter (default: 0.1)</p>
                  <p>• Higher λ = Market is more price-sensitive</p>
                </div>
              </div>

              <p className="text-foreground text-sm">
                <strong>Best Response Pricing:</strong>
              </p>
              <p className="text-foreground text-sm ml-4">
                Optimal Price = Weighted Avg Competitor Price × 0.95 (slight undercut to capture share)
              </p>

              <p className="text-foreground text-sm">
                <strong>Nash Equilibrium:</strong> Mixed-strategy equilibrium where competitors price around the
                weighted average, balancing volume and margin.
              </p>
            </div>
          </CollapsibleSection>

          {/* KPI Calculations */}
          <CollapsibleSection title="7. Key Performance Indicators (KPIs)">
            <div className="space-y-4">
              <p className="text-foreground">ACUITY calculates key metrics to assess pricing strategy effectiveness.</p>

              <div className="space-y-3">
                <div className="bg-accent/10 border border-primary/30 rounded p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Projected Revenue</p>
                  <p className="text-foreground font-mono text-sm">Σ (Recommended Price_i × Expected Sales_i)</p>
                </div>

                <div className="bg-accent/10 border border-primary/30 rounded p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Average Margin %</p>
                  <p className="text-foreground font-mono text-sm">
                    Margin = ((Selling Price - Cost) / Selling Price) × 100
                  </p>
                  <p className="text-foreground text-xs mt-2">Target: ≥ 15% (configurable)</p>
                </div>

                <div className="bg-accent/10 border border-primary/30 rounded p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Waste Reduction %</p>
                  <p className="text-foreground font-mono text-sm">
                    Reduction = Count(Markdown Suggested) / Total SKUs × Urgency Factor
                  </p>
                  <p className="text-foreground text-xs mt-2">Estimated waste prevented by aggressive markdown</p>
                </div>

                <div className="bg-accent/10 border border-primary/30 rounded p-4">
                  <p className="text-sm font-semibold text-foreground mb-2">Risk Metric (0-1)</p>
                  <p className="text-foreground font-mono text-sm">
                    Risk = Stockout Probability + Price War Probability + Demand Variance
                  </p>
                  <p className="text-foreground text-xs mt-2">Higher = More volatile market conditions</p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Settings Impact */}
          <CollapsibleSection title="8. How Settings Affect Calculations">
            <div className="space-y-4">
              <p className="text-foreground">All settings in the Settings page directly influence these algorithms:</p>

              <div className="space-y-3">
                <div className="border-l-4 border-primary bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground">Demand Sensitivity</p>
                  <p className="text-foreground text-sm mt-1">
                    Controls elasticity coefficient (ε). Higher values = more responsive pricing.
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground">Target Profit Margin</p>
                  <p className="text-foreground text-sm mt-1">
                    Sets minimum margin constraint in LP solver. Affects floor price.
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground">Safety Stock Level</p>
                  <p className="text-foreground text-sm mt-1">
                    Stock threshold below which prices increase. Prevents stockouts.
                  </p>
                </div>

                <div className="border-l-4 border-primary bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-foreground">Expiry Discount Rate</p>
                  <p className="text-foreground text-sm mt-1">
                    Max markdown applied to perishables. Higher = more aggressive clearance.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Data Flow */}
          <CollapsibleSection title="9. Data Flow & Architecture">
            <div className="space-y-4">
              <p className="text-foreground">How data flows through ACUITY:</p>

              <div className="bg-accent/10 border border-primary/30 rounded p-4">
                <div className="text-foreground text-sm space-y-2 font-mono">
                  <p>1. Product Inventory (Database)</p>
                  <p className="ml-4">↓</p>
                  <p>2. Demand Forecasting Engine</p>
                  <p className="ml-4">↓</p>
                  <p>3. LP Optimization Solver</p>
                  <p className="ml-4">↓</p>
                  <p>4. Price Recommendations & KPIs (Dashboard)</p>
                  <p className="ml-4">↓</p>
                  <p>5. Monte Carlo Simulator (Risk Analysis)</p>
                  <p className="ml-4">↓</p>
                  <p>6. Game Theory Module (Competitor Analysis)</p>
                  <p className="ml-4">↓</p>
                  <p>7. Analytics & Reporting (User Insights)</p>
                </div>
              </div>

              <p className="text-foreground text-sm">
                All algorithms run independently but output to a unified API for real-time dashboard updates.
              </p>
            </div>
          </CollapsibleSection>

          {/* Accuracy & Limitations */}
          <CollapsibleSection title="10. Accuracy, Assumptions & Limitations">
            <div className="space-y-4">
              <p className="text-foreground text-sm">
                <strong>Key Assumptions:</strong>
              </p>
              <ul className="text-foreground text-sm space-y-1 ml-4">
                <li>• Demand is normally distributed around forecasts</li>
                <li>• Price elasticity is constant (linear demand response)</li>
                <li>• Competitors follow similar optimization logic</li>
                <li>• Historical patterns continue (seasonality repeats)</li>
                <li>• No major external shocks or market disruptions</li>
              </ul>

              <p className="text-foreground text-sm mt-4">
                <strong>Limitations & Caveats:</strong>
              </p>
              <ul className="text-foreground text-sm space-y-1 ml-4">
                <li>• Forecast accuracy degrades beyond 4 weeks</li>
                <li>• Sudden competitor moves may invalidate Nash equilibrium</li>
                <li>• Brand perception changes are not captured</li>
                <li>• Requires at least 2-3 months historical data for accuracy</li>
                <li>• Does not account for supply chain disruptions</li>
              </ul>

              <p className="text-foreground text-sm mt-4">
                <strong>Recommendation:</strong> Use ACUITY as a decision support tool, not an automated trader. Always
                validate recommendations with domain expertise.
              </p>
            </div>
          </CollapsibleSection>
        </div>
      </main>
    </div>
  )
}
