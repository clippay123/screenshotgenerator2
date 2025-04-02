"use client"


import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { AttributeMetrics } from "../types/hair-analysis"

const getPorosityDescription = (percentage: number): string => {
  if (percentage < 30) return "Very Low"
  if (percentage < 45) return "Low"
  if (percentage < 65) return "Medium"
  if (percentage < 85) return "High"
  return "Very High"
}
const getTextureDesciption = (percentage: number): string => {
  if (percentage < 30) return "Very Low"
  if (percentage < 45) return "Low"
  if (percentage < 65) return "Medium"
  if (percentage < 85) return "High"
  return "Very High"
}
const getVolumenDesciption = (percentage: number): string => {
  if (percentage < 30) return "Very Low"
  if (percentage < 45) return "Low"
  if (percentage < 65) return "Medium"
  if (percentage < 85) return "High"
  return "Very High"
}

type Gender = "Male" | "Female"
type AttributeKey = keyof AttributeMetrics

interface AttributesFormProps {
  metrics: AttributeMetrics
  onMetricsChange: (metrics: AttributeMetrics) => void
  gender: Gender
}

export function AttributesForm({ metrics, onMetricsChange, gender }: AttributesFormProps) {
  const handleValueChange = (key: AttributeKey, value: string) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        value,
      },
    })
  }

  const handlePercentageChange = (key: AttributeKey, percentage: number) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        percentage,
        // Update the value if it's a percentage display or porosity
        ...(key !== "texture" &&
          key !== "type" &&
          key !== "volume" &&
          key !== "porosity" && {
            value: `${percentage.toFixed(2)}%`,
          }),
        // Special handling for porosity
        ...(key === "porosity" && {
          value: getPorosityDescription(percentage),
        }),
        ...(key === "texture" && {
          value: getTextureDesciption(percentage),
        }),
        ...(key === "volume" && {
          value: getVolumenDesciption(percentage),
        }),
      },
    })
  }

  const handleVisibilityChange = (key: AttributeKey, visible: boolean) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        visible,
      },
    })
  }

  const getSliderColor = (percentage: number) => {
    if (gender === "Female") return "bg-gradient-to-r from-pink-400 to-pink-600"
    return "bg-gradient-to-r from-blue-400 to-blue-600"
  }

  const metricLabels: Record<AttributeKey, string> = {
    density: "Density",
    type: "Hair Type",
    texture: "Texture",
    porosity: "Porosity",
    volume: "Volume",
    shine: "Shine"
    // hairType: ""
  }

  const getQualityBadge = (percentage: number) => {
    let color = ""
    let label = ""

    if (percentage >= 80) {
      color = "bg-green-100 text-green-800"
      label = "Excellent"
    } else if (percentage >= 60) {
      color = "bg-blue-100 text-blue-800"
      label = "Good"
    } else if (percentage >= 40) {
      color = "bg-yellow-100 text-yellow-800"
      label = "Average"
    } else if (percentage >= 20) {
      color = "bg-orange-100 text-orange-800"
      label = "Fair"
    } else {
      color = "bg-red-100 text-red-800"
      label = "Poor"
    }

    return <Badge className={`ml-2 ${color}`}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Hair Attributes</h2>
      <div className="space-y-4">
        {(Object.keys(metrics) as AttributeKey[]).map((key) => (
          <div key={key} className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id={`${key}-visible`}
                  checked={metrics[key].visible}
                  onCheckedChange={(checked) => handleVisibilityChange(key, checked)}
                  className="data-[state=checked]:bg-blue-500"
                />
                <Label htmlFor={`${key}-visible`} className="text-base font-medium text-gray-800">
                  {metricLabels[key]}
                </Label>
                {metrics[key].visible && getQualityBadge(metrics[key].percentage)}
              </div>
              <span className="text-sm font-medium text-blue-600">{metrics[key].percentage.toFixed(0)}%</span>
            </div>

            {metrics[key].visible && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1">
                  <Input
                    id={key}
                    value={metrics[key].value}
                    readOnly
                    className="w-full bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="relative pt-1">
                    <Slider
                      value={[metrics[key].percentage]}
                      min={0}
                      max={100}
                      step={0.01}
                      onValueChange={(values) => handlePercentageChange(key, values[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>Medium</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

