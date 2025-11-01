"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus } from "lucide-react"

interface Competitor {
  id: string
  name: string
  price: number
  market_share: number
}

interface CompetitorSimulatorProps {
  onAnalyze: (competitors: Competitor[]) => void
  loading: boolean
}

export default function CompetitorSimulator({ onAnalyze, loading }: CompetitorSimulatorProps) {
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [nextId, setNextId] = useState(1)

  const addCompetitor = () => {
    const newCompetitor: Competitor = {
      id: `comp-${nextId}`,
      name: `Competitor ${nextId}`,
      price: 10.0,
      market_share: 0.2,
    }
    setCompetitors([...competitors, newCompetitor])
    setNextId(nextId + 1)
  }

  const removeCompetitor = (id: string) => {
    setCompetitors(competitors.filter((c) => c.id !== id))
  }

  const handlePriceChange = (id: string, newPrice: number) => {
    setCompetitors(competitors.map((c) => (c.id === id ? { ...c, price: newPrice } : c)))
  }

  const handleMarketShareChange = (id: string, newShare: number) => {
    const shareValue = Math.max(0, Math.min(1, newShare / 100))
    setCompetitors(competitors.map((c) => (c.id === id ? { ...c, market_share: shareValue } : c)))
  }

  const competitorsForAnalysis = [
    ...competitors,
    { id: "our-company", name: "Our Company", price: 10.5, market_share: 0.3 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-foreground">Competitors ({competitors.length})</h3>
        <Button
          onClick={addCompetitor}
          variant="outline"
          size="sm"
          className="gap-2 text-primary border-primary hover:bg-primary/10 bg-transparent"
        >
          <Plus className="w-4 h-4" />
          Add Competitor
        </Button>
      </div>

      {competitors.length === 0 ? (
        <Card className="p-6 bg-secondary/30 border-dashed text-center">
          <p className="text-muted-foreground text-sm">
            No competitors added yet. Click "Add Competitor" to start market analysis.
          </p>
        </Card>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {competitors.map((comp) => (
            <Card key={comp.id} className="p-4" style={{ backgroundColor: "#1a1f3a" }}>
              <div className="flex gap-4 items-start mb-3">
                <div className="flex-1">
                  <label className="font-medium text-foreground text-sm">Competitor Name</label>
                  <input
                    type="text"
                    value={comp.name}
                    onChange={(e) =>
                      setCompetitors(competitors.map((c) => (c.id === comp.id ? { ...c, name: e.target.value } : c)))
                    }
                    className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-sm mt-1"
                  />
                </div>
                <Button
                  onClick={() => removeCompetitor(comp.id)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10 mt-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-foreground text-sm">Price (₹)</label>
                  <input
                    type="number"
                    value={comp.price}
                    onChange={(e) => handlePriceChange(comp.id, Number.parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="font-medium text-foreground text-sm">Market Share (%)</label>
                  <input
                    type="number"
                    value={Number((comp.market_share * 100).toFixed(1))}
                    onChange={(e) => handleMarketShareChange(comp.id, Number.parseFloat(e.target.value) || 0)}
                    step="1"
                    min="0"
                    max="100"
                    className="w-full px-2 py-1 rounded border border-input bg-background text-foreground text-sm mt-1"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button
        onClick={() => onAnalyze(competitorsForAnalysis)}
        disabled={loading || competitors.length === 0}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {loading ? "Analyzing..." : `Analyze Market (${competitors.length} Competitors)`}
      </Button>
    </div>
  )
}
