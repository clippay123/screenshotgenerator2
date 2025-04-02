"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Users } from "lucide-react"
import { Gender, ScreenType } from "./types/hair-analysis"

interface ScreenTypeSelectorProps {
  screenType: ScreenType
  onScreenTypeChange: (type: ScreenType) => void
  gender: Gender
  onGenderChange: (gender: Gender) => void
}

export function ScreenTypeSelector({
  screenType,
  onScreenTypeChange,
  gender,
  onGenderChange,
}: ScreenTypeSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Screen Type</h3>
        <RadioGroup
          value={screenType}
          onValueChange={(value) => onScreenTypeChange(value as ScreenType)}
          className="grid grid-cols-1 gap-2"
        >
          {["Hair Attributes", "Hair Health", "Recession Analysis", "Hair Style", "Action Plan"].map((type) => (
            <div key={type} className="flex items-center">
              <RadioGroupItem value={type} id={`screen-${type}`} className="peer sr-only" />
              <Label
                htmlFor={`screen-${type}`}
                className="flex flex-1 items-center justify-between rounded-md border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                {type}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-500">Gender</h3>
        <RadioGroup
          value={gender}
          onValueChange={(value) => onGenderChange(value as Gender)}
          className="grid grid-cols-2 gap-2"
        >
          {["Male", "Female"].map((genderOption) => (
            <div key={genderOption} className="flex items-center">
              <RadioGroupItem value={genderOption} id={`gender-${genderOption}`} className="peer sr-only" />
              <Label
                htmlFor={`gender-${genderOption}`}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-gray-200 bg-white p-3 hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 [&:has([data-state=checked])]:border-blue-500 cursor-pointer"
              >
                <Users className="h-4 w-4" />
                {genderOption}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )
}

