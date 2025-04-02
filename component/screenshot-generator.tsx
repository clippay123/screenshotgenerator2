"use client"

import { useState } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { LayoutTemplate, ImageIcon, Settings } from "lucide-react"
import {
  ScreenType, Gender,
  AttributeMetrics,
  HealthMetrics,
  LossMetrics,
  StyleMetrics,
  ActionMetrics,
} from "./types/hair-analysis"
import { ScreenTypeSelector } from "./screen-type-selector"
import { AttributesForm } from "./form/attributes-form"
import { HealthForm } from "./form/health-form"
import { LossForm } from "./form/loss-form"
import { StyleForm } from "./form/style-form"
import { ActionForm } from "./form/action-form"
import { ImageUploader } from "./image-uploader"
import { ScreenPreview } from "./screen-preview"

export function ScreenshotGenerator() {
  const [images, setImages] = useState<string[]>(Array(4).fill(""))
  const [screenType, setScreenType] = useState<ScreenType>("Hair Attributes")
  const [gender, setGender] = useState<Gender>("Male")

  // State for each screen type's metrics
  const [attributeMetrics, setAttributeMetrics] = useState<AttributeMetrics>({
    density: { value: "75.68%", percentage: 75.68, visible: true },
    type: { value: "Wavy 2B", percentage: 80, visible: true },
    texture: { value: "Medium", percentage: 50, visible: true },
    porosity: { value: "Medium", percentage: 59.77, visible: true },
    volume: { value: "Moderate", percentage: 60, visible: true },
    shine: { value: "79.85%", percentage: 79.85, visible: true },
  })

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    scalpHealth: { value: "84.84%", percentage: 84.84, visible: true },
    splitEnds: { value: "Minimal", percentage: 20, visible: true },
    breakage: { value: "Minimal", percentage: 15, visible: true },
    frizz: { value: "Mild", percentage: 30, visible: true },
    dandruff: { value: "None", percentage: 0, visible: true },
  })

  const [lossMetrics, setLossMetrics] = useState<LossMetrics>({
    hairlossStage: { value: "Stage 1", stage: 1, visible: true },
    hairLossType: { value: "None", visible: true },
    riskOfRecession: { value: "12.14%", percentage: 12.14, visible: true },
    hairLoss: { value: "None", percentage: 0, visible: true },
    yearsUntilBald: {
      value: 15,
      targetAge: 35,
      confidence: 75,
      visible: true,
    },
    hairThickness: {
      value: "72.5 μm",
      percentage: 72.5,
      visible: true,
    },
    scalpHairCounts: {
      frontal: { value: 80, unit: "per cm²" },
      occipital: { value: 85, unit: "per cm²" },
      vertex: { value: 82, unit: "per cm²" },
      visible: true,
    },
    advancedMetricsVisible: true,
  })

  const [styleMetrics, setStyleMetrics] = useState<StyleMetrics>({
    faceShape: { value: "OVAL", visible: true },
    recommendedStyles: [
      {
        name: "Natural Waves",
        description: "Natural loose waves styled casually with mildly tapered sides for a relaxed and easy look",
        imageUrl: "",
        visible: true,
      },
      {
        name: "Disconnected Slickback",
        description: "A voluminous textured pompadour on top with a clean fade on the sides",
        imageUrl: "",
        visible: true,
      },
    ],
  })

  const [actionMetrics, setActionMetrics] = useState<ActionMetrics>({
    title: "Scalp Massage",
    description: "Perform scalp massage to improve blood circulation, promote healthy hair growth, and reduce stress.",
    frequency: { value: "2X per day", visible: true },
    duration: { value: "5 minutes", visible: true },
    imageUrl: "",
    beforeAfterImage: { enabled: false, imageUrl: "" },
    recommendedProducts: [
      {
        name: "Scalp Massager",
        description: "Silicone scalp massager with soft bristles for deep stimulation",
        imageUrl: "",
        visible: true,
      },
      {
        name: "Hair Growth Oil",
        description: "Natural oil blend with rosemary and peppermint to stimulate hair follicles",
        imageUrl: "",
        visible: true,
      },
    ],
  })

  const handleImageChange = (index: number, imageUrl: string) => {
    const newImages = [...images]
    newImages[index] = imageUrl
    setImages(newImages)
  }

  const handleScreenTypeChange = (type: ScreenType) => {
    setScreenType(type)
  }

  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left sidebar - Settings */}
      <div className="lg:col-span-3 space-y-6">
        <Card className="border shadow-sm bg-white overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-800">
              <Settings className="mr-2 h-5 w-5 text-blue-500" />
              Settings
            </h2>
            <ScreenTypeSelector
              screenType={screenType}
              onScreenTypeChange={handleScreenTypeChange}
              gender={gender}
              onGenderChange={handleGenderChange}
            />
          </div>
        </Card>
      </div>

      {/* Main content area */}
      <div className="lg:col-span-9 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Content editor */}
          <div className="space-y-6">
            <Card className="border shadow-sm bg-white overflow-hidden">
              <div className="p-6">
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-4 w-full bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger
                      value="content"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <LayoutTemplate className="mr-2 h-4 w-4" />
                      Content
                    </TabsTrigger>
                    <TabsTrigger
                      value="images"
                      className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Images
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="mt-4">
                    {screenType === "Hair Attributes" && (
                      <AttributesForm
                        metrics={attributeMetrics}
                        onMetricsChange={setAttributeMetrics}
                        gender={gender}
                      />
                    )}

                    {screenType === "Hair Health" && (
                      <HealthForm metrics={healthMetrics} onMetricsChange={setHealthMetrics} gender={gender} />
                    )}

                    {screenType === "Recession Analysis" && (
                      <LossForm metrics={lossMetrics} onMetricsChange={setLossMetrics} gender={gender} />
                    )}

                    {screenType === "Hair Style" && (
                      <StyleForm metrics={styleMetrics} onMetricsChange={setStyleMetrics} gender={gender} />
                    )}

                    {screenType === "Action Plan" && (
                      <ActionForm metrics={actionMetrics} onMetricsChange={setActionMetrics} gender={gender} />
                    )}
                  </TabsContent>

                  <TabsContent value="images" className="mt-4">
                    <ImageUploader images={images} onImageChange={handleImageChange} />
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          </div>

          {/* Preview */}
          <div>
            <ScreenPreview
              images={images}
              screenType={screenType}
              gender={gender}
              attributeMetrics={attributeMetrics}
              healthMetrics={healthMetrics}
              lossMetrics={lossMetrics}
              styleMetrics={styleMetrics}
              actionMetrics={actionMetrics}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

