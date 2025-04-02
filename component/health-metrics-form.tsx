"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { HairHealthMetrics, HealthMetricKey } from "./types/hair-analysis"

type Gender = "Male" | "Female"

interface HealthMetricsFormProps {
  metrics: HairHealthMetrics
  onMetricsChange: (metrics: HairHealthMetrics) => void
  gender?: Gender
}

export function HealthMetricsForm({ metrics, onMetricsChange, gender = "Male" }: HealthMetricsFormProps) {
  const handleValueChange = (key: HealthMetricKey, value: string) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        value,
      },
    })
  }

  const handlePercentageChange = (key: HealthMetricKey, percentage: number) => {
    onMetricsChange({
      ...metrics,
      [key]: {
        ...metrics[key],
        percentage,
        // If it's dandruff, update the value based on percentage
        ...(key === "dandruff" && {
          value: percentage > 0 ? "Present" : "None",
        }),
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

  const metricLabels: Record<HealthMetricKey, string> = {
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
          {(Object.keys(metrics) as HealthMetricKey[]).map((key) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor={key}>{metricLabels[key]}</Label>
                <span className="text-sm text-muted-foreground">
                  {key === "dandruff" ? metrics[key].value : `${metrics[key].percentage}%`}
                </span>
              </div>

              {key === "dandruff" ? (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="dandruff-toggle"
                    checked={metrics.dandruff.percentage > 0}
                    onCheckedChange={handleDandruffToggle}
                  />
                  <Label htmlFor="dandruff-toggle">{metrics.dandruff.percentage > 0 ? "Present" : "None"}</Label>
                </div>
              ) : (
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
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

