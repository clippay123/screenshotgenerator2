"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { HealthMetrics } from "../types/hair-analysis"

type Gender = "Male" | "Female"
type HealthKey = keyof HealthMetrics

interface HealthFormProps {
  metrics: HealthMetrics
  onMetricsChange: (metrics: HealthMetrics) => void
  gender: Gender
}

export function HealthForm({ metrics, onMetricsChange, gender }: HealthFormProps) {
  const handleValueChange = (key: HealthKey, value: string) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        value,
      },
    })
  }

  const handlePercentageChange = (key: HealthKey, percentage: number) => {
    let value = metrics[key].value

    // Update text values based on percentage ranges
    if (key === "splitEnds" || key === "breakage" || key === "frizz") {
      if (percentage < 20) value = "Minimal"
      else if (percentage < 40) value = "Mild"
      else if (percentage < 60) value = "Moderate"
      else if (percentage < 80) value = "Significant"
      else value = "Severe"
    } else if (key === "dandruff") {
      value = percentage > 0 ? "Present" : "None"
    } else {
      // For scalpHealth, just use the percentage
      value = `${percentage.toFixed(2)}%`
    }

    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        percentage,
        value,
      },
    })
  }

  const handleDandruffToggle = (checked: boolean) => {
    onMetricsChange({
      ...metrics,
      dandruff: {
        ...metrics.dandruff,
        percentage: checked ? 100 : 0,
        value: checked ? "Present" : "None",
      },
    })
  }

  const handleVisibilityChange = (key: HealthKey, visible: boolean) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        visible,
      },
    })
  }

  const metricLabels: Record<HealthKey, string> = {
    scalpHealth: "Scalp Health",
    splitEnds: "Split Ends",
    breakage: "Breakage",
    frizz: "Frizz",
    dandruff: "Dandruff",
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Hair Health Metrics</h2>
        <div className="space-y-6">
          {(Object.keys(metrics) as HealthKey[]).map((key) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Switch
                    id={`${key}-visible`}
                    checked={metrics[key].visible}
                    onCheckedChange={(checked) => handleVisibilityChange(key, checked)}
                  />
                  <Label htmlFor={`${key}-visible`}>{metricLabels[key]}</Label>
                </div>
                <span className="text-sm text-muted-foreground">
                  {key === "dandruff" ? metrics[key].value : `${metrics[key].percentage.toFixed(2)}%`}
                </span>
              </div>

              {key === "dandruff" ? (
                <div className="flex items-center space-x-2 ml-10">
                  <Switch
                    id="dandruff-toggle"
                    checked={metrics.dandruff.percentage > 0}
                    onCheckedChange={handleDandruffToggle}
                    disabled={!metrics.dandruff.visible}
                  />
                  <Label htmlFor="dandruff-toggle">{metrics.dandruff.percentage > 0 ? "Present" : "None"}</Label>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Input
                      id={key}
                      value={metrics[key].value}
                      readOnly
                      className="w-full bg-gray-100 cursor-not-allowed"
                      disabled={!metrics[key].visible}
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Slider
                      value={[metrics[key].percentage]}
                      min={0}
                      max={100}
                      step={0.01}
                      onValueChange={(values) => handlePercentageChange(key, values[0])}
                      className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                      disabled={!metrics[key].visible}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

