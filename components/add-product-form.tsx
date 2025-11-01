"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface FormData {
  name: string
  category: string
  quantity: number
  base_price: number
  batch_id: string
  manufacture_date: string
  expiry_date: string
  holding_cost: number
  depreciation_rate: number
  demand_index: number
}

export default function AddProductForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    name: "",
    category: "non-perishable",
    quantity: 0,
    base_price: 0,
    batch_id: `BATCH-${Date.now()}`,
    manufacture_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    holding_cost: 1,
    depreciation_rate: 0,
    demand_index: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (response.ok) {
        setForm({
          name: "",
          category: "non-perishable",
          quantity: 0,
          base_price: 0,
          batch_id: `BATCH-${Date.now()}`,
          manufacture_date: new Date().toISOString().split("T")[0],
          expiry_date: "",
          holding_cost: 1,
          depreciation_rate: 0,
          demand_index: 1,
        })
        onSuccess()
      }
    } catch (error) {
      console.error("Failed to add product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
            placeholder="e.g., Organic Apples"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          >
            <option value="perishable">Perishable</option>
            <option value="non-perishable">Non-Perishable</option>
            <option value="electronics">Electronics</option>
            <option value="seasonal">Seasonal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Quantity (units)</label>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Base Price (₹)</label>
          <input
            type="number"
            name="base_price"
            value={form.base_price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Batch ID</label>
          <input
            type="text"
            name="batch_id"
            value={form.batch_id}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Manufacture Date</label>
          <input
            type="date"
            name="manufacture_date"
            value={form.manufacture_date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Expiry Date (optional)</label>
          <input
            type="date"
            name="expiry_date"
            value={form.expiry_date}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Holding Cost (₹/unit/day)</label>
          <input
            type="number"
            name="holding_cost"
            value={form.holding_cost}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Depreciation Rate (%/day)</label>
          <input
            type="number"
            name="depreciation_rate"
            value={form.depreciation_rate}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="100"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Demand Index</label>
          <input
            type="number"
            name="demand_index"
            value={form.demand_index}
            onChange={handleChange}
            step="0.1"
            min="0.1"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? "Adding..." : "Add Product"}
        </Button>
      </div>
    </form>
  )
}
