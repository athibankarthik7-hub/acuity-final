"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from "recharts"
import Header from "@/components/header"
import CompetitorSimulator from "@/components/competitor-simulator"
import { formatCurrency } from "@/lib/format"

interface SimulationResult {
  market_shares: Array<{ competitor: string; share: number }>
  best_response_price: number
  profit_distribution: Array<{ scenario: string; profit: number; probability: number }>
  recommendations: string[]
}

export default function SimulatorPage() {
  const [monteCarloData, setMonteCarloData] = useState<number[]>([])
  const [competitorData, setCompetitorData] = useState<SimulationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [ourPrice, setOurPrice] = useState(10.5)

  const runMonteCarloSimulation = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/run_simulation", { method: "POST", body: JSON.stringify({ samples: 1000 }) })
      const data = await res.json()

      const histogram = generateHistogram(data.profit_samples, 20)
      setMonteCarloData(histogram)
    } catch (error) {
      console.error("Simulation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCompetitorAnalysis = async (competitors: any[]) => {
    setLoading(true)
    try {
      const res = await fetch("/api/competitor_simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitors }),
      })
      const data = await res.json()
      setCompetitorData(data)
    } catch (error) {
      console.error("Competitor simulation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const marketAnalysis = competitorData
    ? {
        ourMarketShare: competitorData.market_shares.find((m) => m.competitor === "Our Company")?.share || 0,
        topCompetitor: competitorData.market_shares
          .filter((m) => m.competitor !== "Our Company")
          .reduce((top, curr) => (curr.share > top.share ? curr : top), { competitor: "N/A", share: 0 }),
        avgCompetitorPrice:
          competitorData.market_shares.filter((m) => m.competitor !== "Our Company").length > 0 ? 10 : 0,
      }
    : null

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Simulation & Market Analysis</h1>
          <p className="text-muted-foreground mt-2">Monte Carlo uncertainty & competitive market modeling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Our Pricing</CardTitle>
              <CardDescription>Set your company's market price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="font-medium text-foreground text-sm">Our Price (₹)</label>
                <input
                  type="number"
                  value={ourPrice}
                  onChange={(e) => setOurPrice(Number.parseFloat(e.target.value) || 10.5)}
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 rounded border border-input bg-background text-foreground mt-2"
                />
              </div>
              <div className="p-3 rounded border border-burgundy/40" style={{ backgroundColor: "var(--burgundy)" }}>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(ourPrice)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Monte Carlo Simulation</CardTitle>
              <CardDescription>Profit distribution under demand volatility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={runMonteCarloSimulation}
                disabled={loading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? "Running Simulation..." : "Run 1000 Samples"}
              </Button>

              {monteCarloData.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monteCarloData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis stroke="var(--muted)" />
                    <YAxis stroke="var(--muted)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Bar dataKey="count" fill="var(--chart-1)" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Competitor Analysis</CardTitle>
            <CardDescription>Build your competitive landscape & analyze market dynamics</CardDescription>
          </CardHeader>
          <CardContent>
            <CompetitorSimulator onAnalyze={handleCompetitorAnalysis} loading={loading} />
          </CardContent>
        </Card>

        {competitorData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg">Market Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Your Market Share</p>
                  <p className="text-3xl font-bold text-primary">
                    {marketAnalysis ? `${(marketAnalysis.ourMarketShare * 100).toFixed(1)}%` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Competitor</p>
                  <p className="text-lg font-semibold text-foreground">
                    {marketAnalysis?.topCompetitor.competitor || "N/A"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {marketAnalysis ? `${(marketAnalysis.topCompetitor.share * 100).toFixed(1)}% share` : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Competitors</p>
                  <p className="text-2xl font-bold text-foreground">
                    {competitorData.market_shares.filter((m) => m.competitor !== "Our Company").length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border lg:col-span-2">
              <CardHeader>
                <CardTitle>Market Share Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={competitorData.market_shares}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="competitor"
                      stroke="var(--muted)"
                      angle={-45}
                      height={100}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis stroke="var(--muted)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Bar dataKey="share" fill="var(--chart-2)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {competitorData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Profit Distribution Scenarios</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={competitorData.profit_distribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" dataKey="profit" stroke="var(--muted)" />
                    <YAxis type="number" dataKey="probability" stroke="var(--muted)" />
                    <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                    <Scatter dataKey="profit" fill="var(--chart-1)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Strategic Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {competitorData.recommendations && competitorData.recommendations.length > 0 ? (
                  <ul className="space-y-3">
                    {competitorData.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-3">
                        <span className="text-primary font-bold min-w-6">{idx + 1}</span>
                        <span className="text-sm text-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Run analysis to see recommendations</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}

function generateHistogram(samples: number[], bins: number) {
  if (!samples || samples.length === 0) return []

  const min = Math.min(...samples)
  const max = Math.max(...samples)
  const binWidth = (max - min) / bins

  const histogram = Array(bins)
    .fill(0)
    .map((_, i) => ({
      bin: i,
      count: 0,
      range: `${(min + i * binWidth).toFixed(0)}-${(min + (i + 1) * binWidth).toFixed(0)}`,
    }))

  samples.forEach((sample) => {
    const binIndex = Math.min(Math.floor((sample - min) / binWidth), bins - 1)
    histogram[binIndex].count++
  })

  return histogram
}
