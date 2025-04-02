export type ScreenType = "Hair Attributes" | "Hair Health" | "Recession Analysis" | "Hair Style" | "Action Plan"
export type Gender = "Male" | "Female"

export interface AttributeMetrics {
  density: { value: string; percentage: number; visible?: boolean }
  type: { value: string; percentage: number; visible?: boolean }
  texture: { value: string; percentage: number; visible?: boolean }
  porosity: { value: string; percentage: number; visible?: boolean }
  volume: { value: string; percentage: number; visible?: boolean }
  shine: { value: string; percentage: number; visible?: boolean }
}

export type MetricKey = keyof AttributeMetrics

export interface HealthMetrics {
  scalpHealth: { value: string; percentage: number; visible?: boolean }
  splitEnds: { value: string; percentage: number; visible?: boolean }
  breakage: { value: string; percentage: number; visible?: boolean }
  frizz: { value: string; percentage: number; visible?: boolean }
  dandruff: { value: string; percentage: number; visible?: boolean }
}


export type HealthMetricKey = keyof HealthMetrics

export interface StyleMetrics {
  faceShape: { value: string; visible?: boolean }
  recommendedStyles: {
    name: string
    description: string
    imageUrl: string
    visible?: boolean
  }[]
}

export interface LossMetrics {
  hairlossStage: { value: string; stage: number; visible?: boolean }
  hairLossType: { value: string; visible?: boolean }
  riskOfRecession: { value: string; percentage: number; visible?: boolean }
  hairLoss: { value: string; percentage: number; visible?: boolean }
  yearsUntilBald: { value: number; targetAge: number; confidence: number; visible?: boolean }
  hairThickness: { value: string; percentage: number; visible?: boolean }
  scalpHairCounts: {
    frontal: { value: number; unit: string }
    occipital: { value: number; unit: string }
    vertex: { value: number; unit: string }
    visible?: boolean
  }
  advancedMetricsVisible: boolean
}

export interface ActionMetrics {
  title: string
  description: string
  frequency: { value: string; visible?: boolean }
  duration: { value: string; visible?: boolean }
  imageUrl: string
  beforeAfterImage: { enabled: boolean; imageUrl: string }
  recommendedProducts: {
    name: string
    description: string
    imageUrl: string
    visible?: boolean
  }[]
}

export type AnalysisType = "Hair Analysis" | "Hair Health"

export type HairMetrics = AttributeMetrics
export type HairHealthMetrics = HealthMetrics

