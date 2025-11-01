import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"

interface KPIProps {
  kpis: {
    projected_revenue: number
    waste_reduction: number
    avg_margin: number
    risk_metric: number
  }
}

export default function KPIMetrics({ kpis }: KPIProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 p-4">
        <div className="text-sm text-muted-foreground mb-1">Projected Revenue</div>
        <div className="text-2xl font-bold text-primary">{formatCurrency(kpis.projected_revenue)}</div>
        <div className="text-xs text-muted-foreground mt-2">Next 30 days</div>
      </Card>

      <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 p-4">
        <div className="text-sm text-muted-foreground mb-1">Waste Reduction</div>
        <div className="text-2xl font-bold text-accent">{kpis.waste_reduction.toFixed(1)}%</div>
        <div className="text-xs text-muted-foreground mt-2">vs. baseline</div>
      </Card>

      <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20 p-4">
        <div className="text-sm text-muted-foreground mb-1">Average Margin</div>
        <div className="text-2xl font-bold text-chart-4">{kpis.avg_margin.toFixed(1)}%</div>
        <div className="text-xs text-muted-foreground mt-2">Across all SKUs</div>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 p-4">
        <div className="text-sm text-muted-foreground mb-1">Risk Metric</div>
        <div className="text-2xl font-bold text-destructive">{kpis.risk_metric.toFixed(2)}</div>
        <div className="text-xs text-muted-foreground mt-2">Stockout probability</div>
      </Card>
    </div>
  )
}
