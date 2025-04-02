"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  images: string[]
  onImageChange: (index: number, imageUrl: string) => void
}

export function ImageUploader({ images, onImageChange }: ImageUploaderProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(index, event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDragOverIndex(null)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageChange(index, event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Upload Images</h2>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`relative aspect-square rounded-lg flex items-center justify-center overflow-hidden shadow-sm transition-all duration-200 ${
              dragOverIndex === index
                ? "border-2 border-dashed border-blue-500 bg-blue-50"
                : "border border-gray-200 hover:border-blue-300"
            }`}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
          >
            {images[index] ? (
              <div className="relative w-full h-full group">
                <Image
                  src={images[index] || "/placeholder.svg"}
                  alt={`Hair image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full"
                    onClick={() => onImageChange(index, "")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full p-4 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Upload className="h-6 w-6 text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">Upload image {index + 1}</span>
                <span className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, index)} />
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

