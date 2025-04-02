"use client"


import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { LossMetrics } from "../types/hair-analysis"

type Gender = "Male" | "Female"

interface LossFormProps {
  metrics: LossMetrics
  onMetricsChange: (metrics: LossMetrics) => void
  gender: Gender
}

export function LossForm({ metrics, onMetricsChange, gender }: LossFormProps) {
  const handleStageChange = (stage: string) => {
    onMetricsChange({
      ...metrics,
      hairlossStage: {
        ...metrics.hairlossStage,
        value: `Stage ${stage}`,
        stage: Number.parseInt(stage),
      },
    })
  }

  const handleLossTypeChange = (value: string) => {
    onMetricsChange({
      ...metrics,
      hairLossType: {
        ...metrics.hairLossType,
        value,
      },
    })
  }

  const handlePercentageChange = (key: "riskOfRecession" | "hairLoss" | "hairThickness", percentage: number) => {
    let value = `${percentage.toFixed(2)}%`

    // For hairLoss, set text based on percentage
    if (key === "hairLoss") {
      if (percentage < 5) value = "None"
      else if (percentage < 25) value = "Minimal"
      else if (percentage < 50) value = "Moderate"
      else if (percentage < 75) value = "Significant"
      else value = "Severe"
    } else if (key === "hairThickness") {
      // Hair thickness in micrometers (μm)
      value = `${percentage.toFixed(1)} μm`
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

  const handleHairCountChange = (area: "frontal" | "occipital" | "vertex", value: number) => {
    onMetricsChange({
      ...metrics,
      scalpHairCounts: {
        ...metrics.scalpHairCounts,
        [area]: {
          ...metrics.scalpHairCounts[area],
          value,
        },
      },
    })
  }

  const handleYearsUntilBaldChange = (years: number) => {
    const targetAge = 20 + years // Assuming starting age of 20

    onMetricsChange({
      ...metrics,
      yearsUntilBald: {
        ...metrics.yearsUntilBald,
        value: years,
        targetAge: targetAge,
      },
    })
  }

  const handleTargetAgeChange = (targetAge: number) => {
    const years = Math.max(0, targetAge - 20) // Assuming starting age of 20

    onMetricsChange({
      ...metrics,
      yearsUntilBald: {
        ...metrics.yearsUntilBald,
        value: years,
        targetAge: targetAge,
      },
    })
  }

  const handleConfidenceChange = (confidence: number) => {
    onMetricsChange({
      ...metrics,
      yearsUntilBald: {
        ...metrics.yearsUntilBald,
        confidence,
      },
    })
  }

  const handleVisibilityChange = (key: keyof LossMetrics, visible: boolean) => {
    if (key === "scalpHairCounts") {
      onMetricsChange({
        ...metrics,
        scalpHairCounts: {
          ...metrics.scalpHairCounts,
          visible,
        },
      })
    } else if (key === "hairlossStage" || key === "hairLossType" || key === "riskOfRecession" || key === "hairLoss") {
      onMetricsChange({
        ...metrics,
        [key]: {
          ...metrics[key],
          visible,
        },
      })
    }
  }

  const handleAdvancedMetricsVisibilityChange = (visible: boolean) => {
    onMetricsChange({
      ...metrics,
      advancedMetricsVisible: visible,
      yearsUntilBald: {
        ...metrics.yearsUntilBald,
        visible,
      },
      hairThickness: {
        ...metrics.hairThickness,
        visible,
      },
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Hair Loss Metrics</h2>
        <div className="space-y-6">
          {/* Hairloss Stage */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hairlossStage-visible"
                checked={metrics.hairlossStage.visible}
                onCheckedChange={(checked) => handleVisibilityChange("hairlossStage", checked)}
              />
              <Label htmlFor="hairlossStage-visible">Hairloss Stage</Label>
            </div>
            <Select
              value={metrics.hairlossStage.stage.toString()}
              onValueChange={handleStageChange}
              disabled={!metrics.hairlossStage.visible}
            >
              <SelectTrigger id="hairlossStage">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Stage 1</SelectItem>
                <SelectItem value="2">Stage 2</SelectItem>
                <SelectItem value="3">Stage 3</SelectItem>
                <SelectItem value="4">Stage 4</SelectItem>
                <SelectItem value="5">Stage 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Hair Loss Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="hairLossType-visible"
                checked={metrics.hairLossType.visible}
                onCheckedChange={(checked) => handleVisibilityChange("hairLossType", checked)}
              />
              <Label htmlFor="hairLossType-visible">Hair Loss Type</Label>
            </div>
            <Select
              value={metrics.hairLossType.value}
              onValueChange={handleLossTypeChange}
              disabled={!metrics.hairLossType.visible}
            >
              <SelectTrigger id="hairLossType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Male Pattern">Male Pattern</SelectItem>
                <SelectItem value="Female Pattern">Female Pattern</SelectItem>
                <SelectItem value="Alopecia Areata">Alopecia Areata</SelectItem>
                <SelectItem value="Telogen Effluvium">Telogen Effluvium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Risk of Recession */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="riskOfRecession-visible"
                  checked={metrics.riskOfRecession.visible}
                  onCheckedChange={(checked) => handleVisibilityChange("riskOfRecession", checked)}
                />
                <Label htmlFor="riskOfRecession-visible">Recession Risk</Label>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.riskOfRecession.value}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  id="riskOfRecession"
                  value={metrics.riskOfRecession.value}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                  disabled={!metrics.riskOfRecession.visible}
                />
              </div>
              <div className="col-span-2 flex items-center">
                <Slider
                  value={[metrics.riskOfRecession.percentage]}
                  min={0}
                  max={100}
                  step={0.01}
                  onValueChange={(values) => handlePercentageChange("riskOfRecession", values[0])}
                  className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                  disabled={!metrics.riskOfRecession.visible}
                />
              </div>
            </div>
          </div>

          {/* Hair Loss */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Switch
                  id="hairLoss-visible"
                  checked={metrics.hairLoss.visible}
                  onCheckedChange={(checked) => handleVisibilityChange("hairLoss", checked)}
                />
                <Label htmlFor="hairLoss-visible">Hair Loss</Label>
              </div>
              <span className="text-sm text-muted-foreground">{metrics.hairLoss.value}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <Input
                  id="hairLoss"
                  value={metrics.hairLoss.value}
                  readOnly
                  className="w-full bg-gray-100 cursor-not-allowed"
                  disabled={!metrics.hairLoss.visible}
                />
              </div>
              <div className="col-span-2 flex items-center">
                <Slider
                  value={[metrics.hairLoss.percentage]}
                  min={0}
                  max={100}
                  step={0.01}
                  onValueChange={(values) => handlePercentageChange("hairLoss", values[0])}
                  className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                  disabled={!metrics.hairLoss.visible}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Advanced Metrics Toggle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="advanced-metrics-visible"
                checked={metrics.advancedMetricsVisible}
                onCheckedChange={handleAdvancedMetricsVisibilityChange}
              />
              <Label htmlFor="advanced-metrics-visible" className="font-medium">
                Show Advanced Metrics
              </Label>
            </div>
            <p className="text-sm text-muted-foreground ml-10">
              Toggles both "Bald by Age" and "Hair Thickness" metrics
            </p>
          </div>

          {metrics.advancedMetricsVisible && (
            <>
              {/* Bald by Age */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="baldByAge">Bald by Age</Label>
                  <span className="text-sm text-muted-foreground">
                    Bald by Age {metrics.yearsUntilBald.targetAge} ({metrics.yearsUntilBald.confidence}% confidence)
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Input
                      id="baldByAge"
                      type="number"
                      value={metrics.yearsUntilBald.targetAge}
                      onChange={(e) => handleTargetAgeChange(Number.parseInt(e.target.value) || 20)}
                      className="w-full"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Slider
                      value={[metrics.yearsUntilBald.confidence]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(values) => handleConfidenceChange(values[0])}
                      className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                    />
                  </div>
                </div>
              </div>

              {/* Hair Thickness */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="hairThickness">Hair Thickness</Label>
                  <span className="text-sm text-muted-foreground">{metrics.hairThickness.value}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <Input
                      id="hairThickness"
                      value={metrics.hairThickness.value}
                      readOnly
                      className="w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="col-span-2 flex items-center">
                    <Slider
                      value={[metrics.hairThickness.percentage]}
                      min={20}
                      max={120}
                      step={0.1}
                      onValueChange={(values) => handlePercentageChange("hairThickness", values[0])}
                      className={`w-full ${gender === "Female" ? "accent-pink-500" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Scalp Hair Counts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Switch
                id="scalpHairCounts-visible"
                checked={metrics.scalpHairCounts.visible}
                onCheckedChange={(checked) => handleVisibilityChange("scalpHairCounts", checked)}
              />
              <Label htmlFor="scalpHairCounts-visible">Scalp Hair Counts (per cm²)</Label>
            </div>
            <div className="grid grid-cols-3 gap-4 ml-10">
              <div>
                <Label htmlFor="frontal" className="text-sm">
                  Frontal
                </Label>
                <Input
                  id="frontal"
                  type="number"
                  value={metrics.scalpHairCounts.frontal.value}
                  onChange={(e) => handleHairCountChange("frontal", Number.parseInt(e.target.value) || 0)}
                  className="w-full"
                  disabled={!metrics.scalpHairCounts.visible}
                />
              </div>
              <div>
                <Label htmlFor="occipital" className="text-sm">
                  Occipital
                </Label>
                <Input
                  id="occipital"
                  type="number"
                  value={metrics.scalpHairCounts.occipital.value}
                  onChange={(e) => handleHairCountChange("occipital", Number.parseInt(e.target.value) || 0)}
                  className="w-full"
                  disabled={!metrics.scalpHairCounts.visible}
                />
              </div>
              <div>
                <Label htmlFor="vertex" className="text-sm">
                  Vertex
                </Label>
                <Input
                  id="vertex"
                  type="number"
                  value={metrics.scalpHairCounts.vertex.value}
                  onChange={(e) => handleHairCountChange("vertex", Number.parseInt(e.target.value) || 0)}
                  className="w-full"
                  disabled={!metrics.scalpHairCounts.visible}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

