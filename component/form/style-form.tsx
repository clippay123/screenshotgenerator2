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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X } from "lucide-react"
import { StyleMetrics } from "../types/hair-analysis"
import imagePal from "@/public/assest/imageplaceholder.svg";

type Gender = "Male" | "Female"

interface StyleFormProps {
  metrics: StyleMetrics
  onMetricsChange: (metrics: StyleMetrics) => void
  gender: Gender
}

export function StyleForm({ metrics, onMetricsChange, gender }: StyleFormProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  const handleFaceShapeChange = (value: string) => {
    onMetricsChange({
      ...metrics,
      faceShape: { ...metrics.faceShape, value },
    })
  }

  const handleStyleNameChange = (index: number, name: string) => {
    const newStyles = [...metrics.recommendedStyles]
    newStyles[index] = { ...newStyles[index], name }
    onMetricsChange({
      ...metrics,
      recommendedStyles: newStyles,
    })
  }

  const handleStyleDescriptionChange = (index: number, description: string) => {
    const newStyles = [...metrics.recommendedStyles]
    newStyles[index] = { ...newStyles[index], description }
    onMetricsChange({
      ...metrics,
      recommendedStyles: newStyles,
    })
  }

  const handleStyleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const newStyles = [...metrics.recommendedStyles]
          newStyles[index] = {
            ...newStyles[index],
            imageUrl: event.target.result as string,
          }
          onMetricsChange({
            ...metrics,
            recommendedStyles: newStyles,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleStyleVisibilityChange = (index: number, visible: boolean) => {
    const newStyles = [...metrics.recommendedStyles]
    newStyles[index] = { ...newStyles[index], visible }
    onMetricsChange({
      ...metrics,
      recommendedStyles: newStyles,
    })
  }

  const handleFaceShapeVisibilityChange = (visible: boolean) => {
    onMetricsChange({
      ...metrics,
      faceShape: { ...metrics.faceShape, visible },
    })
  }

  const addStyle = () => {
    onMetricsChange({
      ...metrics,
      recommendedStyles: [
        ...metrics.recommendedStyles,
        {
          name: "New Style",
          description: "Description of the new hairstyle",
          imageUrl: imagePal,
          visible: true,
        },
      ],
    })
    setEditingIndex(metrics.recommendedStyles.length)
  }

  const removeStyle = (index: number) => {
    const newStyles = [...metrics.recommendedStyles]
    newStyles.splice(index, 1)
    onMetricsChange({
      ...metrics,
      recommendedStyles: newStyles,
    })
    setEditingIndex(null)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Hair Style Recommendations</h2>
        <div className="space-y-6">
          {/* Face Shape */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="faceShape-visible"
                checked={metrics.faceShape.visible}
                onCheckedChange={handleFaceShapeVisibilityChange}
              />
              <Label htmlFor="faceShape-visible">Face Shape</Label>
            </div>
            <Select
              value={metrics.faceShape.value}
              onValueChange={handleFaceShapeChange}
              disabled={!metrics.faceShape.visible}
            >
              <SelectTrigger id="faceShape">
                <SelectValue placeholder="Select face shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OVAL">OVAL</SelectItem>
                <SelectItem value="ROUND">ROUND</SelectItem>
                <SelectItem value="SQUARE">SQUARE</SelectItem>
                <SelectItem value="HEART">HEART</SelectItem>
                <SelectItem value="DIAMOND">DIAMOND</SelectItem>
                <SelectItem value="OBLONG">OBLONG</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Recommended Styles */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Recommended Hairstyles</Label>
              <Button variant="outline" size="sm" onClick={addStyle} disabled={metrics.recommendedStyles.length >= 4}>
                Add Style
              </Button>
            </div>

            {metrics.recommendedStyles.map((style, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`style-${index}-visible`}
                        checked={style.visible}
                        onCheckedChange={(checked) => handleStyleVisibilityChange(index, checked)}
                      />
                      <h3 className="font-medium">{style.name}</h3>
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
                        onClick={() => removeStyle(index)}
                        disabled={metrics.recommendedStyles.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {editingIndex === index ? (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`style-name-${index}`} className="text-sm">
                          Style Name
                        </Label>
                        <Input
                          id={`style-name-${index}`}
                          value={style.name}
                          onChange={(e) => handleStyleNameChange(index, e.target.value)}
                          className="w-full"
                          disabled={!style.visible}
                          maxLength={13}

                        />
<p className="text-sm text-gray-500">
                        {style.name.length}/20 characters
                      </p>
                      </div>
                      <div>
                        <Label htmlFor={`style-desc-${index}`} className="text-sm">
                          Description
                        </Label>
                        <Textarea
                          id={`style-desc-${index}`}
                          value={style.description}
                          onChange={(e) => handleStyleDescriptionChange(index, e.target.value)}
                          className="w-full"
                          rows={2}
                          maxLength={20}
                          disabled={!style.visible}
                        />
                        <p className="text-sm text-gray-500">
                        {style.description.length}/20 characters
                      </p>
                      </div>
                      <div>
                        <Label htmlFor={`style-image-${index}`} className="text-sm">
                          Image
                        </Label>
                        <div className="flex items-center gap-2">
                          <div className="relative w-16 h-16 border rounded overflow-hidden">
                            <Image
                              src={style.imageUrl ? style.imageUrl : imagePal}
                              alt={style.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <label
                            className={`cursor-pointer flex items-center justify-center px-4 py-2 border rounded-md hover:bg-accent ${!style.visible ? "opacity-50 pointer-events-none" : ""}`}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            <span>Upload</span>
                            <input
                              id={`style-image-${index}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleStyleImageChange(index, e)}
                              disabled={!style.visible}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4 ml-10">
                      <div className="relative w-16 h-16 shrink-0 border rounded overflow-hidden">
                        <Image
                          src={style.imageUrl ? style.imageUrl : imagePal}
                          alt={style.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{style.description}</p>
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

