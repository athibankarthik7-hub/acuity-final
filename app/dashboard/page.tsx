"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import Header from "@/components/header"
import ProductHeatmap from "@/components/product-heatmap"
import KPIMetrics from "@/components/kpi-metrics"
import { formatCurrency } from "@/lib/format"

interface Product {
  id: string
  name: string
  category: string
  quantity: number
  base_price: number
  expiry_date: string | null
  last_sold_date: string
  demand_index: number
}

interface Recommendation {
  sku_id: string
  recommended_price: number
  current_price?: number
  reason?: string
}

interface KPIMetrics {
  projected_revenue: number
  waste_reduction: number
  avg_margin: number
  risk_metric: number
}
}

interface Recommendation {
  sku_id: string
  recommended_price: number
  expected_sales: number
  projected_revenue: number
  markdown_suggested: boolean
  markdown_percent: number
}

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [kpis, setKpis] = useState<KPIMetrics>({
    projected_revenue: 0,
    waste_reduction: 0,
    avg_margin: 0,
    risk_metric: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    }
  }

  const handleAutoOptimize = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/recommendations")
      const data = await res.json()
      setRecommendations(data.recommendations)
      setKpis(data.kpis)
    } catch (error) {
      console.error("Failed to get recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Real-time pricing and inventory optimization</p>
          </div>
          <Button
            onClick={handleAutoOptimize}
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {loading ? "Optimizing..." : "Auto-Optimize Prices"}
          </Button>
        </div>

        <KPIMetrics kpis={kpis} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Stock Levels & Expiry Risk</CardTitle>
              <CardDescription>Real-time inventory heatmap across all products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto scrollbar-hide">
                <ProductHeatmap products={products} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Price Recommendations</CardTitle>
              <CardDescription>Top products by revenue impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                {recommendations.slice(0, 5).map((rec) => (
                  <div key={rec.sku_id} className="p-3 rounded-lg bg-[#1a1f3a]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-foreground">{rec.sku_id}</span>
                      <span className="text-accent font-bold">{formatCurrency(rec.recommended_price)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Expected sales: {rec.expected_sales.toFixed(0)} units
                    </p>
                    {rec.markdown_suggested && (
                      <p className="text-sm text-accent-foreground bg-accent/20 rounded px-2 py-1 mt-1 w-fit">
                        Markdown: {rec.markdown_percent}% recommended
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Revenue Forecast (Next 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={generateForecastData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted)" />
                <YAxis stroke="var(--muted)" />
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--chart-1)" strokeWidth={2} name="Current" />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  name="Optimized"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function generateForecastData() {
  return Array.from({ length: 14 }, (_, i) => ({
    day: i + 1,
    revenue: Math.floor(Math.random() * 10000) + 5000,
    projected: Math.floor(Math.random() * 11000) + 6000,
  }))
}
