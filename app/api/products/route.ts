import { type NextRequest, NextResponse } from "next/server"

// In-memory product storage for demo
let products: any[] = []

// Initialize with sample data
if (products.length === 0) {
  products = generateSampleProducts()
}

export async function GET() {
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const product = {
      id: `PROD-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }
    products.push(product)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 400 })
  }
}

function generateSampleProducts() {
  const categories = ["perishable", "non-perishable", "electronics", "seasonal"]
  const names = [
    "Organic Apples",
    "Whole Milk",
    "Laptop Stand",
    "Winter Boots",
    "Cheddar Cheese",
    "Pasta",
    "USB Hub",
    "Summer Dress",
    "Greek Yogurt",
    "Olive Oil",
    "Wireless Mouse",
    "Spring Jacket",
    "Orange Juice",
    "Bread",
    "Monitor",
    "Holiday Wreath",
  ]

  return names.map((name, i) => {
    const category = categories[i % categories.length]
    const daysToExpiry = Math.random() * 30 + 5

    return {
      id: `PROD-${1000 + i}`,
      name,
      category,
      quantity: Math.floor(Math.random() * 500) + 10,
      base_price: Math.random() * 50 + 5,
      batch_id: `BATCH-${1000 + i}`,
      manufacture_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      expiry_date:
        category === "perishable"
          ? new Date(Date.now() + daysToExpiry * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
          : null,
      holding_cost: Math.random() * 2 + 0.5,
      depreciation_rate: category === "electronics" ? 0.5 : category === "seasonal" ? 2 : 0,
      demand_index: Math.random() * 2 + 0.5,
      last_sold_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    }
  })
}
