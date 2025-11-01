"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"
import Header from "@/components/header"

interface AlgorithmConfig {
  demandSensitivity: number
  targetProfitMargin: number
  safetyStockLevel: number
  expiryDiscountRate: number
}

const DEFAULT_CONFIG: AlgorithmConfig = {
  demandSensitivity: 1.0,
  targetProfitMargin: 20,
  safetyStockLevel: 15,
  expiryDiscountRate: 30,
}

export default function SettingsPage() {
  const [config, setConfig] = useState<AlgorithmConfig>(DEFAULT_CONFIG)
  const [saved, setSaved] = useState(false)

  const calculateImpact = () => {
    return {
      highDemandPrice: Math.round(config.demandSensitivity * 15),
      expiringDiscount: Math.round(config.expiryDiscountRate),
      minMargin: config.targetProfitMargin,
      stockAlert: config.safetyStockLevel,
    }
  }

  const impact = calculateImpact()

  const handleSliderChange = (key: keyof AlgorithmConfig, value: number) => {
    setConfig({ ...config, [key]: value })
    setSaved(false)
  }

  const handleSave = () => {
    console.log("[v0] Settings saved:", config)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
    setSaved(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure AI pricing algorithms and business rules</p>
        </div>

        {/* AI Parameters Section */}
        <Card className="bg-card border border-border rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">AI Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Demand Sensitivity Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Demand Sensitivity</label>
                <span className="text-lg font-semibold text-blue-600">{config.demandSensitivity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.demandSensitivity}
                onChange={(e) => handleSliderChange("demandSensitivity", Number.parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-sm text-muted-foreground mt-2">
                How aggressively the AI adjusts prices based on demand changes. Higher values = more responsive pricing.
              </p>
            </div>

            {/* Target Profit Margin Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Target Profit Margin</label>
                <span className="text-lg font-semibold text-blue-600">{config.targetProfitMargin}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={config.targetProfitMargin}
                onChange={(e) => handleSliderChange("targetProfitMargin", Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Minimum profit margin to maintain when optimizing prices.
              </p>
            </div>

            {/* Safety Stock Level Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Safety Stock Level</label>
                <span className="text-lg font-semibold text-blue-600">{config.safetyStockLevel}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="1"
                value={config.safetyStockLevel}
                onChange={(e) => handleSliderChange("safetyStockLevel", Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Percentage of stock to maintain as safety buffer. Prices increase when inventory falls below this level.
              </p>
            </div>

            {/* Expiry Discount Rate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="font-medium text-foreground">Expiry Discount Rate</label>
                <span className="text-lg font-semibold text-blue-600">{config.expiryDiscountRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={config.expiryDiscountRate}
                onChange={(e) => handleSliderChange("expiryDiscountRate", Number.parseInt(e.target.value))}
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Maximum discount to apply for products approaching expiry date.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Preview Impact Section */}
        <Card className="bg-card border border-border rounded-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Preview Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* High Demand Products */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">High Demand Products</p>
                <p className="text-3xl font-bold text-orange-600">+{impact.highDemandPrice}%</p>
                <p className="text-xs text-muted-foreground">Price increase estimate</p>
              </div>

              {/* Expiring Products */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expiring Products</p>
                <p className="text-3xl font-bold text-orange-600">-{impact.expiringDiscount}%</p>
                <p className="text-xs text-muted-foreground">Discount applied</p>
              </div>

              {/* Minimum Margin */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Minimum Margin</p>
                <p className="text-3xl font-bold text-green-600">{impact.minMargin}%</p>
                <p className="text-xs text-muted-foreground">Protected margin</p>
              </div>

              {/* Stock Alert Level */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Stock Alert Level</p>
                <p className="text-3xl font-bold text-red-600">{impact.stockAlert}%</p>
                <p className="text-xs text-muted-foreground">Triggers price increase</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 border-border hover:bg-secondary bg-transparent"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            {saved ? "✓ Saved" : "Save Settings"}
          </Button>
        </div>
      </main>
    </div>
  )
}
