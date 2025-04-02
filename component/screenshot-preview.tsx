"use client"

import { useRef } from "react"
import Image from "next/image"
import { toPng } from "html-to-image"
import type { AnalysisType, Gender, HairMetrics, HairHealthMetrics } from "./types/hair-analysis"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Home, Save, Share } from "lucide-react"

interface ScreenshotPreviewProps {
  images: string[]
  metrics: HairMetrics
  healthMetrics: HairHealthMetrics
  analysisType: AnalysisType
  gender: Gender
}

type MetricKey = keyof HairMetrics
type HealthMetricKey = keyof HairHealthMetrics

export function ScreenshotPreview({ images, metrics, healthMetrics, analysisType, gender }: ScreenshotPreviewProps) {
  const screenshotRef = useRef<HTMLDivElement>(null)

  const downloadScreenshot = async () => {
    if (!screenshotRef.current) return

    try {
      const dataUrl = await toPng(screenshotRef.current, { quality: 1.0 })
      const link = document.createElement("a")
      link.download = `strand-${analysisType.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error("Error generating screenshot:", error)
    }
  }

  const getProgressBarColor = (percentage: number, isHealth = false) => {
    // For female, use pink-based colors
    if (gender === "Female") {
      if (percentage >= 80) return isHealth ? "bg-pink-500" : "bg-pink-500"
      if (percentage >= 50) return isHealth ? "bg-pink-400" : "bg-pink-400"
      return isHealth ? "bg-pink-300" : "bg-pink-300"
    }

    // For health metrics, use red/orange/green
    if (isHealth) {
      if (percentage < 40) return "bg-red-500"
      if (percentage < 70) return "bg-orange-500"
      return "bg-green-500"
    }

    // For regular metrics (male)
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-orange-500"
    return "bg-yellow-500"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <Button onClick={downloadScreenshot}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <div ref={screenshotRef} className="bg-gray-900 text-white w-full aspect-[9/16] max-w-sm mx-auto relative">
              {/* Header with time and status bar */}
              {analysisType === "Hair Health" && (
                <div className="flex justify-between items-center p-2 text-xs">
                  <span>11:07</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                    <div className="w-4 h-1 bg-gray-400"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center p-4">
                <button className="bg-gray-800 p-2 rounded-full">
                  <Home className="h-5 w-5" />
                </button>
                <h1 className={`text-xl font-bold text-center ${gender === "Female" ? "text-pink-100" : "text-white"}`}>
                  {analysisType}
                </h1>
                <div className="w-9"></div> {/* Spacer for alignment */}
              </div>

              {/* Images */}
              <div className="grid grid-cols-4 gap-2 px-4">
                {images.map((src, index) => (
                  <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                    {src ? (
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Hair view ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <span className="text-xs">Image {index + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Metrics - Hair Analysis */}
              {analysisType === "Hair Analysis" && (
                <div className="grid grid-cols-2 gap-4 p-4">
                  {(Object.entries(metrics) as [MetricKey, { value: string; percentage: number }][]).map(
                    ([key, { value, percentage }]) => (
                      <div key={key} className="bg-gray-800 p-4 rounded-lg">
                        <div className="text-sm text-gray-400 mb-1">
                          {/* {key === "hairType" ? "Hair Type" : key.charAt(0).toUpperCase() + key.slice(1)} */}
                        </div>
                        <div className="text-2xl font-bold mb-2">{value}</div>
                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressBarColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}

              {/* Metrics - Hair Health */}
              {analysisType === "Hair Health" && (
                <div className="px-4 space-y-4">
                  {/* Scalp Health - Main metric */}
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <div className="text-sm text-gray-400 mb-1">Scalp Health</div>
                    <div className="text-3xl font-bold mb-2">{healthMetrics.scalpHealth.value}</div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{ width: `${healthMetrics.scalpHealth.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Other health metrics in a grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Split Ends */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Split Ends</div>
                      <div className="text-2xl font-bold mb-2">{healthMetrics.splitEnds.value}</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500"
                          style={{ width: `${healthMetrics.splitEnds.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Breakage */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Breakage</div>
                      <div className="text-2xl font-bold mb-2">{healthMetrics.breakage.value}</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${healthMetrics.breakage.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Frizz */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Frizz</div>
                      <div className="text-2xl font-bold mb-2">{healthMetrics.frizz.value}</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${healthMetrics.frizz.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Dandruff */}
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Dandruff</div>
                      <div className="text-2xl font-bold mb-2 flex items-center">
                        {healthMetrics.dandruff.value}
                        {healthMetrics.dandruff.percentage === 0 && (
                          <div className="ml-2 w-4 h-4 rounded-full bg-green-500"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="absolute bottom-16 w-full text-center">
                <p className="text-lg font-semibold italic">
                  Strand <span className={gender === "Female" ? "text-pink-400" : "text-blue-400"}>AI</span>
                </p>
                <div className="flex justify-center mt-2 space-x-1">
                  {[0, 1, 2, 3].map((dot) => (
                    <div
                      key={dot}
                      className={`w-1.5 h-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-gray-600"}`}
                    ></div>
                  ))}
                </div>
                <p className="mt-2 text-white font-semibold">Strand</p>
              </div>

              {/* Action Buttons - Only for Hair Health */}
              {analysisType === "Hair Health" && (
                <div className="absolute bottom-4 w-full px-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button className="border border-indigo-500 rounded-lg py-2 flex items-center justify-center text-white">
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </button>
                    <button className="bg-indigo-500 rounded-lg py-2 flex items-center justify-center text-white">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

