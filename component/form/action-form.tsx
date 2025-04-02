"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Upload, X } from "lucide-react"
import { ActionMetrics } from "../types/hair-analysis"
import imagePla from "@/public/assest/imageplaceholder.svg"
type Gender = "Male" | "Female"

interface ActionFormProps {
  metrics: ActionMetrics
  onMetricsChange: (metrics: ActionMetrics) => void
  gender: Gender
}

export function ActionForm({ metrics, onMetricsChange, gender }: ActionFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleTitleChange = (title: string) => {
    onMetricsChange({
      ...metrics,
      title,
    })
  }

  const handleDescriptionChange = (description: string) => {
    onMetricsChange({
      ...metrics,
      description,
    })
  }

  const handleFrequencyChange = (value: string) => {
    onMetricsChange({
      ...metrics,
      frequency: { ...metrics.frequency, value },
    })
  }

  const handleDurationChange = (value: string) => {
    onMetricsChange({
      ...metrics,
      duration: { ...metrics.duration, value },
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onMetricsChange({
            ...metrics,
            imageUrl: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBeforeAfterImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onMetricsChange({
            ...metrics,
            beforeAfterImage: {
              ...metrics.beforeAfterImage,
              imageUrl: event.target.result as string,
            },
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBeforeAfterToggle = (enabled: boolean) => {
    onMetricsChange({
      ...metrics,
      beforeAfterImage: {
        ...metrics.beforeAfterImage,
        enabled,
      },
    })
  }

  const handleFrequencyVisibilityChange = (visible: boolean) => {
    onMetricsChange({
      ...metrics,
      frequency: { ...metrics.frequency, visible },
    })
  }

  const handleDurationVisibilityChange = (visible: boolean) => {
    onMetricsChange({
      ...metrics,
      duration: { ...metrics.duration, visible },
    })
  }

  const handleProductNameChange = (index: number, name: string) => {
    const newProducts = [...metrics.recommendedProducts]
    newProducts[index] = { ...newProducts[index], name }
    onMetricsChange({
      ...metrics,
      recommendedProducts: newProducts,
    })
  }

  const handleProductDescriptionChange = (index: number, description: string) => {
    const newProducts = [...metrics.recommendedProducts]
    newProducts[index] = { ...newProducts[index], description }
    onMetricsChange({
      ...metrics,
      recommendedProducts: newProducts,
    })
  }

  const handleProductImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newProducts = [...metrics.recommendedProducts]
          newProducts[index] = {
            ...newProducts[index],
            imageUrl: event.target.result as string,
          }
          onMetricsChange({
            ...metrics,
            recommendedProducts: newProducts,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProductVisibilityChange = (index: number, visible: boolean) => {
    const newProducts = [...metrics.recommendedProducts]
    newProducts[index] = { ...newProducts[index], visible }
    onMetricsChange({
      ...metrics,
      recommendedProducts: newProducts,
    })
  }

  const addProduct = () => {
    onMetricsChange({
      ...metrics,
      recommendedProducts: [
        ...metrics.recommendedProducts,
        {
          name: "New Product",
          description: "Description of the new product",
          imageUrl: "/placeholder.svg?height=80&width=80",
          visible: true,
        },
      ],
    })
    setEditingIndex(metrics.recommendedProducts.length)
  }

  const removeProduct = (index: number) => {
    const newProducts = [...metrics.recommendedProducts]
    newProducts.splice(index, 1)
    onMetricsChange({
      ...metrics,
      recommendedProducts: newProducts,
    })
    setEditingIndex(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Action Plan</h2>
        <div className="space-y-6">
          {/* Action Title */}
          <div className="space-y-2">
            <Label htmlFor="action-title">Action Title</Label>
            <Input
              id="action-title"
              value={metrics.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full" 
              maxLength={13}
              
            />
            <p className="text-sm text-gray-500">
  {metrics.title.length}/13 characters
</p>
          </div>

          {/* Action Description */}
          <div className="space-y-2">
            <Label htmlFor="action-description">Description</Label>
            <Textarea
              id="action-description"
              value={metrics.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              className="w-full"
              rows={3}
              maxLength={120}
            />
            <p className="text-sm text-gray-500">
  {metrics.description.length}/120 characters
</p>
          </div>

          {/* Frequency */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="frequency-visible"
                checked={metrics.frequency.visible}
                onCheckedChange={handleFrequencyVisibilityChange}
              />
              <Label htmlFor="frequency-visible">Frequency</Label>
            </div>
            <Input
              id="frequency"
              value={metrics.frequency.value}
              onChange={(e) => handleFrequencyChange(e.target.value)}
              className="w-full"
              placeholder="e.g., 3X per day"
              disabled={!metrics.frequency.visible}
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="duration-visible"
                checked={metrics.duration.visible}
                onCheckedChange={handleDurationVisibilityChange}
              />
              <Label htmlFor="duration-visible">Duration</Label>
            </div>
            <Input
              id="duration"
              value={metrics.duration.value}
              onChange={(e) => handleDurationChange(e.target.value)}
              className="w-full"
              placeholder="e.g., 4 weeks"
              disabled={!metrics.duration.visible}
            />
          </div>

          {/* Main Image */}
          <div className="space-y-2">
            <Label htmlFor="action-image">Main Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border rounded overflow-hidden">
                <Image src={metrics.imageUrl || imagePla} alt="Action image" fill className="object-cover" />
              </div>
              <label className="cursor-pointer flex items-center justify-center px-4 py-2 border rounded-md hover:bg-accent">
                <Upload className="h-4 w-4 mr-2" />
                <span>Upload Image</span>
                <input id="action-image" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>
          </div>

          {/* Before/After Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="before-after-toggle"
                checked={metrics.beforeAfterImage.enabled}
                onCheckedChange={handleBeforeAfterToggle}
              />
              <Label htmlFor="before-after-toggle">Show Before/After Image</Label>
            </div>

            {metrics.beforeAfterImage.enabled && (
              <div className="ml-10 mt-2">
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-24 border rounded overflow-hidden">
                    <Image
                      src={metrics.beforeAfterImage.imageUrl ||imagePla}
                      alt="Before/After image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <label className="cursor-pointer flex items-center justify-center px-4 py-2 border rounded-md hover:bg-accent">
                    <Upload className="h-4 w-4 mr-2" />
                    <span>Upload Image</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleBeforeAfterImageChange} />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Products */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Recommended Products</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addProduct}
                disabled={metrics.recommendedProducts.length >= 4}
              >
                Add Product
              </Button>
            </div>

            {metrics.recommendedProducts.map((product, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`product-${index}-visible`}
                        checked={product.visible}
                        onCheckedChange={(checked) => handleProductVisibilityChange(index, checked)}
                      />
                      <h3 className="font-medium">{product.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      >
                        {editingIndex === index ? "Done" : "Edit"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        disabled={metrics.recommendedProducts.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`product-name-${index}`} className="text-sm">
                          Product Name
                        </Label>
                        <Input
                          id={`product-name-${index}`}
                          value={product.name}
                          onChange={(e) => handleProductNameChange(index, e.target.value)}
                          className="w-full"
                          disabled={!product.visible}
                          maxLength={13}
                        /><p className="text-sm text-gray-500">
                        {product.name.length}/20 characters
                      </p>
                      </div>
                      <div>
                        <Label htmlFor={`product-desc-${index}`} className="text-sm">
                          Description
                        </Label>
                        <Textarea
                          id={`product-desc-${index}`}
                          value={product.description}
                          onChange={(e) => handleProductDescriptionChange(index, e.target.value)}
                          className="w-full"
                          rows={2}
                          disabled={!product.visible}
                          maxLength={70}
                        />
                        <p className="text-sm text-gray-500">
                        {product.description.length}/70 characters
                      </p>
                      </div>
                      <div>
                        <Label htmlFor={`product-image-${index}`} className="text-sm">
                          Image
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-16 h-16 border rounded overflow-hidden">
                            <Image
                              src={product.imageUrl || imagePla}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <label
                            className={`cursor-pointer flex items-center justify-center px-4 py-2 border rounded-md hover:bg-accent ${
                              !product.visible ? "opacity-50 pointer-events-none" : ""
                            }`}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Upload</span>
                            <input
                              id={`product-image-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleProductImageChange(index, e)}
                              disabled={!product.visible}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 ml-10">
                      <div className="relative w-16 h-16 shrink-0 border rounded overflow-hidden">
                        <Image
                          src={product.imageUrl || imagePla}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

