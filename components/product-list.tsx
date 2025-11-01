"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { formatCurrency, formatDate } from "@/lib/format"

interface Product {
  id: string
  name: string
  category: string
  quantity: number
  base_price: number
  expiry_date: string | null
  batch_id: string
  manufacture_date: string
}

export default function ProductList({ products, onUpdate }: { products: Product[]; onUpdate: () => void }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    setDeletingId(id)
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" })
      onUpdate()
    } catch (error) {
      console.error("Failed to delete product:", error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {products.map((product) => (
        <Card
          key={product.id}
          className="p-4 hover:opacity-80 transition-all glow-border-cyan"
          style={{ backgroundColor: "#1a1f3a" }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground">Batch: {product.batch_id}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(product.id)}
              disabled={deletingId === product.id}
              className="text-destructive hover:bg-destructive/10"
            >
              Delete
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Category</span>
              <p className="font-semibold text-foreground">{product.category}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Stock</span>
              <p className="font-semibold text-foreground">{product.quantity} units</p>
            </div>
            <div>
              <span className="text-muted-foreground">Price</span>
              <p className="font-semibold text-foreground">{formatCurrency(product.base_price)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Mfg Date</span>
              <p className="font-semibold text-foreground">{formatDate(product.manufacture_date)}</p>
            </div>
          </div>

          {product.expiry_date && (
            <div className="mt-3 p-2 bg-accent/20 rounded text-sm text-accent-foreground">
              ⚠️ Expires: {formatDate(product.expiry_date)} (
              {Math.ceil((new Date(product.expiry_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days)
            </div>
          )}
        </Card>
      ))}
      {products.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No products added yet. Create one to get started.</div>
      )}
    </div>
  )
}
