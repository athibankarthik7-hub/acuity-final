import { Card } from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"

interface Product {
  id: string
  name: string
  quantity: number
  expiry_date: string | null
  base_price: number
}

export default function ProductHeatmap({ products }: { products: Product[] }) {
  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return "neutral"
    const days = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 3) return "critical"
    if (days < 7) return "warning"
    return "healthy"
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return "critical"
    if (quantity < 10) return "warning"
    return "healthy"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "bg-destructive/20 border-destructive/50"
      case "warning":
        return "bg-accent/20 border-accent/50"
      default:
        return "bg-chart-4/20 border-chart-4/50"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto scrollbar-hide">
      {products.map((product) => {
        const expiryStatus = getExpiryStatus(product.expiry_date)
        const stockStatus = getStockStatus(product.quantity)
        const worstStatus =
          expiryStatus === "critical" || stockStatus === "critical"
            ? "critical"
            : expiryStatus === "warning" || stockStatus === "warning"
              ? "warning"
              : "healthy"

        return (
          <Card key={product.id} className={`p-3 border ${getStatusColor(worstStatus)}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-sm text-foreground truncate">{product.name}</h3>
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
                {formatCurrency(product.base_price)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                Stock: <span className="font-semibold text-foreground">{product.quantity} units</span>
              </div>
              {product.expiry_date && (
                <div>
                  Expires:{" "}
                  <span className="font-semibold text-foreground">
                    {Math.ceil((new Date(product.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
                  </span>
                </div>
              )}
            </div>
          </Card>
        )
      })}
      {products.length === 0 && (
        <div className="col-span-full text-center py-8 text-muted-foreground">
          No products in inventory. Add some to get started.
        </div>
      )}
    </div>
  )
}
