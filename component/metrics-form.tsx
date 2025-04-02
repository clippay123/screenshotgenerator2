"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { HairMetrics, MetricKey } from "./types/hair-analysis"

// Add a gender prop to the MetricsForm component
type Gender = "Male" | "Female"

interface MetricsFormProps {
  metrics: HairMetrics
  onMetricsChange: (metrics: HairMetrics) => void
  gender?: Gender // Add this line
}

// Update the function signature to include the gender prop with a default value
export function MetricsForm({ metrics, onMetricsChange, gender = "Male" }: MetricsFormProps) {
  // Add this helper function to get slider color based on gender
  const getSliderClass = () => {
    return gender === "Female" ? "bg-pink-500" : "bg-primary"
  }

  const handleValueChange = (key: MetricKey, value: string) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        value,
      },
    })
  }

  const handlePercentageChange = (key: MetricKey, percentage: number) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        percentage,
      },
    })
  }

  const metricLabels: Record<MetricKey, string> = {
    texture: "Texture",
    porosity: "Porosity",
    volume: "Volume",
    shine: "Shine",
    density: "Density",
    type: ""
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Hair Metrics</h2>
        <div className="space-y-6">
          {(Object.keys(metrics) as MetricKey[]).map((key) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={key}>{metricLabels[key]}</Label>
                <span className="text-sm text-muted-foreground">{metrics[key].percentage}%</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Input
                    id={key}
                    value={metrics[key].value}
                    onChange={(e) => handleValueChange(key, e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="col-span-2 flex items-center">
                  <Slider
                    value={[metrics[key].percentage]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(values) => handlePercentageChange(key, values[0])}
                    className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

