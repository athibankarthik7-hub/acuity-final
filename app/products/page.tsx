"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import ProductList from "@/components/product-list"
import AddProductForm from "@/components/add-product-form"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const handleProductAdded = async () => {
    setShowForm(false)
    await fetchProducts()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-muted-foreground mt-2">Manage inventory and product batches</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {showForm ? "Cancel" : "Add Product"}
          </Button>
        </div>

        {showForm && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Add New Product or Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <AddProductForm onSuccess={handleProductAdded} />
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>{products.length} products in system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading products...</div>
            ) : (
              <ProductList products={products} onUpdate={fetchProducts} />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
