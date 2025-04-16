"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { toPng } from "html-to-image"
import {
  ScreenType,
  Gender,
  AttributeMetrics,
  HealthMetrics,
  LossMetrics,
  StyleMetrics,
  ActionMetrics,
} from "./types/hair-analysis"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, X, Info, SaveIcon, Share, ShoppingBag, Copy, Check, FileChartColumnIncreasing, Send, Brush, Home } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@supabase/supabase-js"
import logomale from "@/public/assest/logomale.png"
import logofemale from "@/public/assest/logofemale.png"
import imagePla from "@/public/assest/imageplaceholder.svg"
import arrowRight from "@/public/assest/arrowright.svg";
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


interface ScreenPreviewProps {
  images: string[]
  screenType: ScreenType
  gender: Gender
  attributeMetrics: AttributeMetrics
  healthMetrics: HealthMetrics
  lossMetrics: LossMetrics
  styleMetrics: StyleMetrics
  actionMetrics: ActionMetrics
}

export function ScreenPreview({
  images,
  screenType,
  gender,
  attributeMetrics,
  healthMetrics,
  lossMetrics,
  styleMetrics,
  actionMetrics,
}: ScreenPreviewProps) {
  const screenshotRef = useRef<HTMLDivElement>(null)
  const [copying, setCopying] = useState(false)

  const downloadScreenshot = async () => {
    if (!screenshotRef.current) return;
  
    try {
      const dataUrl = await toPng(screenshotRef.current, {
        quality: 1.0,
        skipFonts: false, // Ensure fonts are not skipped
        filter: (node) => {
          if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
            return false;
          }
          return true;
        },
        style: {
          fontFamily: "'Poppins', sans-serif", // Force Poppins
        
        },
      });
  
      const link = document.createElement("a");
      link.download = `strand-ai-${screenType.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error generating screenshot:", error);
    }
  };
  
  const saveScreenshot = async () => {
    if (!screenshotRef.current) return;
  
    try {
      const dataUrl = await toPng(screenshotRef.current, { quality: 1.0 });
  
      // Convert to Blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();
  
      // Generate a unique filename
      const fileName = `screenshots/${Date.now()}.png`;
  
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("screenshots") // Bucket name
        .upload(fileName, blob, { contentType: "image/png" });
  
      if (error) throw error;
  
      // Get public URL
      const { data: publicURL } = supabase.storage
        .from("screenshots")
        .getPublicUrl(fileName);
  
      if (!publicURL.publicUrl) throw new Error("Failed to get public URL");
  
      // Insert into the `screenshots` table
      const { data: screenshotData, error: dbError } = await supabase
        .from("screenshots")
        .insert([{ url: publicURL.publicUrl }])
        .select("id")
        .single();
  
      if (dbError) throw dbError;
  
      // console.log("Screenshot saved:", screenshotData.id);
      toast.success("Screenshot saved")
      return screenshotData.id;
    } catch (error) {
      console.error("Error saving screenshot:", error);
      return null;
    }
  };
  
  
  
  const copyScreenshot = async () => {
    if (!screenshotRef.current) return

    try {
      setCopying(true)

      // Use a more reliable approach for capturing the screenshot
      const dataUrl = await toPng(screenshotRef.current, {
        quality: 1.0,
        skipFonts: true, // Skip fonts to avoid cross-origin issues
        filter: (node) => {
          // Skip any nodes with external resources that might cause CORS issues
          if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
            return false
          }
          return true
        },
      })

      // Create a temporary image element
      const img = document.createElement("img")
      img.src = dataUrl

      // Wait for the image to load
      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Create a canvas to draw the image
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")

      if (ctx) {
        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0)

        // Convert canvas to blob and copy to clipboard
        canvas.toBlob(async (blob) => {
          if (blob) {
            try {
              // Use the clipboard API to copy the image
              const item = new ClipboardItem({ [blob.type]: blob })
              await navigator.clipboard.write([item])

              // toast({
              //   title: "Screenshot copied",
              //   description: "Your screenshot has been copied to clipboard.",
              // })
            } catch (err) {
              console.error("Clipboard API error:", err)
              // toast({
              //   title: "Copy failed",
              //   description: "Your browser doesn't support copying images. Try downloading instead.",
              //   variant: "destructive",
              // })
            }
          }
        }, "image/png")
      }
    } catch (error) {
      console.error("Error copying screenshot:", error)
      // toast({
      //   title: "Copy failed",
      //   description: "There was an error copying your screenshot.",
      //   variant: "destructive",
      // })
    } finally {
      setCopying(false)
    }
  }

  const getProgressBarColor = (percentage: number, isHealth = false) => {
    // For female, always use pink-based colors
    if (gender === "Female") {
      if (percentage >= 80) return "bg-green-500"
      if (percentage >= 50) return "bg-pink-400"
      return "bg-red-500"
    }

    // For health metrics, use red/orange/green
    if (isHealth) {
      if (percentage < 40) return "bg-red-500"
      if (percentage < 70) return "bg-orange-500"
      return "bg-green-500"
    }

    // For regular metrics (male)
    if (percentage >= 80) return "bg-green-500"
    if (percentage >= 50) return "bg-[#764AF7]"
    return "bg-red-500"
  }

  // Filter visible metrics
  const visibleAttributeMetrics = Object.entries(attributeMetrics)
    .filter(([_, metric]) => metric.visible)
    .map(([key, metric]) => ({ key, ...metric }))

  const visibleHealthMetrics = Object.entries(healthMetrics)
    .filter(([_, metric]) => metric.visible)
    .map(([key, metric]) => ({ key, ...metric }))

  const visibleRecommendedStyles = styleMetrics.recommendedStyles.filter((style) => style.visible).slice(0, 2)

  const visibleRecommendedProducts = actionMetrics.recommendedProducts.filter((product) => product.visible).slice(0, 4)

  const saveAndShareScreenshot = async (userId: string) => {
    if (!screenshotRef.current) return
  
    try {
      // Convert the screenshot to a PNG data URL
      const dataUrl = await toPng(screenshotRef.current, {
        quality: 1.0,
        skipFonts: true,
        filter: (node) => {
          if (node.tagName === "LINK" && node.getAttribute("rel") === "stylesheet") {
            return false
          }
          return true
        },
      })
  
      // Convert to Blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
  
      // Generate a unique filename
      const fileName = `screenshots/${userId}-${Date.now()}.png`
  
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("screenshots") // Change to your bucket name
        .upload(fileName, blob, { contentType: "image/png" })
  
      if (error) throw error
  
      // Get Public URL
      const { data: publicURL } = supabase.storage
        .from("screenshots")
        .getPublicUrl(fileName)
  
      if (!publicURL.publicUrl) throw new Error("Failed to get public URL")
  
      // Store in database
      const { error: dbError } = await supabase.from("screenshots").insert([
        {
          user_id: userId,
          image_url: publicURL.publicUrl,
          created_at: new Date(),
        },
      ])
  
      if (dbError) throw dbError
  
      // toast({
      //   title: "Screenshot saved",
      //   description: "Your screenshot has been saved successfully.",
      // })
      toast.success("Screen shot saved");  
      console.log("Screenshot URL saved:", publicURL.publicUrl)
  
      // Now share the image
      shareImage(publicURL.publicUrl)
  
    } catch (error) {
      console.error("Error saving screenshot:", error)
      // toast({
      //   title: "Save failed",
      //   description: "There was an error saving your screenshot.",
      //   variant: "destructive",
      // })
      toast.error("Save failed");
    }
  }
  const shareImage = async (imageUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this screenshot",
          text: "Here's a screenshot I saved!",
          url: imageUrl,
        })
        // toast({ title: "Shared successfully!" })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback: Copy link to clipboard
      try {
        await navigator.clipboard.writeText(imageUrl)
        // toast({ title: "Link copied", description: "URL copied to clipboard!" })
      } catch (error) {
        console.error("Error copying link:", error)
      }
    }
  }
  

  const shareScreenshot = async () => {
    try {
      // Fetch the latest saved screenshot
      const { data, error } = await supabase
        .from("screenshots")
        .select("id")
        .order("created_at", { ascending: false }) // Get the latest
        .limit(1);
  
      if (error) throw error;
  
      let screenshotId: string | null = null;
  
      if (data && data.length > 0) {
        screenshotId = data[0].id;
      } else {
        screenshotId = await saveScreenshot();
      }
  
      if (!screenshotId) {
        console.error("Could not generate shareable link.");
        return;
      }
  
      // Generate shareable link
      const shareableLink = `${process.env.NEXT_PUBLIC_BASE_URL}/screenshot/${screenshotId}`;
  toast.success('Screenshot Shared success')
      if (navigator.share) {
        await navigator.share({
          title: "Check out this screenshot",
          text: "Here's a screenshot I saved!",
          url: shareableLink,
        });
      } else {
        await navigator.clipboard.writeText(shareableLink);
        console.log("Link copied:", shareableLink);
      }
    } catch (error) {
      console.error("Error sharing screenshot:", error);
    }
  };
  
  
  return (
    <div className="space-y-4 sticky top-4">
      <div className="border shadow-sm bg-white overflow-hidden">
        <CardContent className="md:p-6 p-0">
          <div className="flex md:flex-row flex-col justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Preview
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyScreenshot} disabled={copying}>
                {copying ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              <Button size="sm" onClick={downloadScreenshot}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="flex justify-center"   >
            {/* iPhone 15 mockup */}
            <div className="relative  w-80 md:w-80 h-[650px] rounded-[45px] shadow-[0_0_2px_2px_rgba(255,255,255,0.1)] border-8 border-zinc-900"  ref={screenshotRef}>
       
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[90px] h-[22px] bg-zinc-900 rounded-full z-20">
        </div>

        <div className="absolute -inset-[1px] border-[3px] border-zinc-700 border-opacity-40 rounded-[37px] pointer-events-none"></div>

              {/* Screen content */}
              <div
             
             className="bg-[#121212] text-white w-full h-full rounded-[40px] overflow-hidden relative"
              >

                {/* Status Bar */}

<div className="relative flex items-center justify-center w-full pt-6 z-50">
  {/* Notch */}
  <div className="absolute top-0 mt-4 left-1/2 transform -translate-x-1/2 w-[90px] h-[22px] bg-zinc-900 rounded-full z-20"></div>

  {/* Time */}
  <div className="absolute left-6 text-xs font-medium">9:41</div>

  {/* Status Icons */}
  <div className="absolute right-6 flex items-center space-x-1">
    <div className="w-4 h-4">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 20.5c4.14 0 7.5-3.36 7.5-7.5S16.14 5.5 12 5.5 4.5 8.86 4.5 13s3.36 7.5 7.5 7.5z" />
      </svg>
    </div>
    <div className="w-4 h-4">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
      </svg>
    </div>
    <div className="w-6 h-3 bg-white rounded-sm relative">
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-black rounded-r-sm"></div>
    </div>
  </div>
</div>


<div className="h-full overflow-y-auto max-h-full hide-scrollbar mt-8">
                {/* Header */}

                <div className={`${gender==="Male" &&"flex items-center gap-6 ml-3" } `}>
        
        {gender==="Male" && 
        (
                <div>
                  <Home className="bg-[#50535B] p-1 rounded-full"/>
                </div>
                )}
                <div className="flex justify-between items-center px-4 py-2">
                  <h1
                    className={` flex items-center  ${gender==="Male" && "justify-center"} gap-2 font-medium text-center flex-1 ${gender === "Female" && screenType === "Hair Health" ? "text-pink-300" : ""}`}
                  >
                  
                    {screenType === "Action Plan" && (
                      <div className="flex items-center justify-center">
                        <span>{actionMetrics.title}</span>
                        {gender === "Female" ? "🌸" : "🔄"}
                      </div>
                    )}
               <FileChartColumnIncreasing className="w-4 h-4"/>     {screenType !== "Hair Style" && screenType !== "Action Plan" && screenType}   {screenType === "Hair Style" && (
                      <div className="flex">
                       
                        <span className="text-sm font-normal">Hair Recommendations</span>
                      </div>
                    )}
                  </h1>
                  {gender === "Male" ? (
                    <></>
                  ) :( <button className="bg-gray-800 p-1.5 rounded-full">
                    <X className="h-5 w-5" />
                  </button>)}
                 
                </div>
          
                </div>
                {/* {gender==='Female' && (
                <div className=" w-full text-center italic">
                  <p className={gender === "Female" ? "text-white font-semibold flex justify-center gap-2 items-center" : "text-white font-semibold flex items-center justify-center gap-2"}>
                    Strand AI
                    
                    <Image src={logofemale} alt="Logo Female"  className="h-7"/>
                  </p>
                </div>
)} */}
                {/* Images */}
                {screenType !== "Hair Style" && screenType !== "Action Plan" && (
                  <div className="grid grid-cols-4 gap-1 px-6 mt-2">
                    {images.map((src, index) => (
                      <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                        {src ? (
                          <Image
                            src={src || ""}
                            alt={`Hair view ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <span className="text-xs">Image   <Image
                            src={imagePla}
                            alt={`Hair view ${index + 1}`}
                            fill
                            className="object-cover"
                          /></span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Hair Attributes Screen */}
                {screenType === "Hair Attributes" && (
                  <>
                  <div className="grid grid-cols-2 gap-3 p-4">
                    {visibleAttributeMetrics.map(({ key, value, percentage }) => (
                      <div key={key}                            className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20 bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257] "}`}>
                        <div className="flex justify-between items-center mb-1">
                          <div className={`text-sm ${gender==="Female"? "text-[#FFFFFFB3]" : "text-[#FFFFFFB3]"}`}>
                            {key === "type" ? "Type" : key.charAt(0).toUpperCase() + key.slice(1)}
                          </div>
                          <Info className="h-4 w-4 text-[#FFFFFFB3]" />
                        </div>
                        <div className="text-xl font-bold mb-2">{value}</div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressBarColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className=" w-full text-center italic left-0">
                  <p className="text-white font-semibold flex items-center justify-center bg-[#121212]">
                    Strand   <Image src={logomale} alt="Logo Male" className="ml-1 w-5"/>  AI
                 
                  </p>
                </div>
                  </>
                )}
                

                {/* Hair Health Screen */}
                {screenType === "Hair Health" && (
                  <div className="px-4 space-y-3 mt-2">
                    {/* Scalp Health - Main metric (only shown for males and if visible) */}
                    {gender === "Male" && healthMetrics.scalpHealth.visible ? (
                      <div className="bg-[#2C2D30] p-3 rounded-2xl drop-shadow-xs border  border-[#505257]">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-sm text-[#FFFFFFB3] font-medium">Hair Health</div>
                          <Info className="h-4 w-4 text-[#FFFFFFB3]" />
                        </div>
                        <div className="text-2xl font-bold mb-2">{healthMetrics.scalpHealth.value}</div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressBarColor(healthMetrics.scalpHealth.percentage, true)}`}
                            style={{ width: `${healthMetrics.scalpHealth.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : gender === "Female" && healthMetrics.scalpHealth.visible ? (
                      // For females, show a special header with pink accents
                      <div className="p-3 rounded-2xl drop-shadow-xs border border-pink-200/20 bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm text-[#FFFFFFB3] font-medium">Scalp Health</div>
                        <Info className="h-4 w-4 text-[#FFFFFFB3]" />
                      </div>
                      <div className="text-2xl font-bold mb-2">{healthMetrics.scalpHealth.value}</div>
                      <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getProgressBarColor(healthMetrics.scalpHealth.percentage, true)}`}
                          style={{ width: `${healthMetrics.scalpHealth.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    

                    
                    
                    
                    ) : null}

                    {/* Other health metrics in a grid */}
                    <div className="grid grid-cols-2 gap-3">
                      {visibleHealthMetrics
                        .filter((metric) => metric.key !== "scalpHealth")
                        .map(({ key, value, percentage }) => (
                          <div
                            key={key}
                            className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20 bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className={`text-sm ${gender === "Female" ? "text-[#FFFFFFB3]" : "text-[#FFFFFFB3]"}`}>
                                {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                              </div>
                              <Info className={`h-4 w-4 ${gender === "Female" ? "text-[#FFFFFFB3]" : "text-[#FFFFFFB3]"}`} />
                            </div>
                            <div className="text-xl font-bold mb-2">{value}</div>
                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getProgressBarColor(percentage, true)}`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Additional section for females */}
                    {/* {gender === "Female" && (
                      <div className="bg-gray-800 p-3 rounded-lg border border-pink-900/30">
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-sm text-pink-300">Recommended Treatment</div>
                          <Info className="h-4 w-4 text-pink-300" />
                        </div>
                        <div className="text-lg font-medium mb-2">Deep Conditioning Treatment</div>
                        <div className="text-sm text-[#FFFFFFB3]">
                          Based on your hair health analysis, we recommend a weekly deep conditioning treatment to
                          improve overall hair health.
                        </div>
                      </div>
                    )} */}
                                      <div className=" w-full text-center italic left-0">
                  <p className="text-white font-semibold flex items-center justify-center bg-[#121212]">
                    Strand   <Image src={logomale} alt="Logo Male" className="ml-1 w-5"/>  AI
                 
                  </p>
                </div>
                  </div>
                )}

                {/* Hair Loss Screen */}
             
        {/* Hair Loss Screen */}
        {screenType === "Recession Analysis" && (
          <div className="px-3 space-y-2 pt-2 h-full">
            {/* Hairloss Stage with Gauge - Reduced padding and margins */}
            {lossMetrics.hairlossStage.visible && (
              <div    className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20 bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257] " }`}>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-[#FFFFFFB3]">Hairloss Stage</div>
                  <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                </div>
                {lossMetrics.hairLossType.visible && (
                  <>
                    <div className="text-xs text-[#FFFFFFB3]">Hair Loss Type</div>
                    <div className="text-sm font-bold mb-1">{lossMetrics.hairLossType.value}</div>
                  </>
                )}

                <div className="relative h-6 mb-1">
                  {/* Gauge background */}
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className={`h-full w-full ${gender === "Female" 
                      ? "bg-gradient-to-r from-pink-300 via-pink-400 to-pink-600" 
                      : "bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"}`}>
                    </div>
                  </div>
                  
                  {/* Gauge needle */}
                  <div
                    className="absolute top-0 h-full flex items-center justify-center"
                    style={{
                      left: `${(lossMetrics.hairlossStage.stage - 1) * 25}%`,
                      transform: "translateX(-50%)",
                    }}>
                    <div className="h-8 w-1 bg-white"></div>
                  </div>
                  
                  {/* Stage text */}
                  <div className={`absolute bottom-0 right-0 ${gender === "Female" ? "bg-pink-900" : "bg-gray-800"} px-2 py-0.5 rounded-lg text-white font-bold text-xs`}>
                    {lossMetrics.hairlossStage.value}
                  </div>
                </div>
              </div>
            )}

            {/* Risk of Recession & Hair Loss - Reduced size */}
            <div className="grid grid-cols-2 gap-2">
              {lossMetrics.riskOfRecession.visible && (
                <div    className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-[#FFFFFFB3]">Recession Risk</div>
                    <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                  </div>
                  <div className="text-sm font-bold mb-1">{lossMetrics.riskOfRecession.value}</div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${gender === "Female" ? "bg-[#D8B5F4]" : "bg-[#764AF7]"}`}
                      style={{ width: `${lossMetrics.riskOfRecession.percentage}%` }}>
                    </div>
                  </div>
                </div>
              )}

              {lossMetrics.hairLoss.visible && (
                <div className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-[#FFFFFFB3]">Hair Loss</div>
                    <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                  </div>
                  <div className="text-sm font-bold mb-1">{lossMetrics.hairLoss.value}</div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${gender === "Female" ? "bg-[#D8B5F4]" : "bg-[#764AF7]"}`}
                      style={{ width: `${lossMetrics.hairLoss.percentage}%` }}>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bald by Age & Hair Thickness - Reduced size */}
            {lossMetrics.advancedMetricsVisible && (
              <div className="grid grid-cols-2 gap-2">
                <div  className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-[#FFFFFFB3]">Year Untill Bald</div>
                    <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                  </div>
                  <div className="text-sm font-bold">{lossMetrics.yearsUntilBald.targetAge} years</div>
                  <div className="text-xs text-[#FFFFFFB3] mb-1">
                    {lossMetrics.yearsUntilBald.confidence}% confidence
                  </div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${gender === "Female"
                        ? "bg-[#D8B5F4]"
                        : lossMetrics.yearsUntilBald.value > 10
                          ? "bg-green-500"
                          : "bg-orange-500"}`}
                      style={{ width: `${lossMetrics.yearsUntilBald.confidence}%` }}>
                    </div>
                  </div>
                </div>

                <div  className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-[#FFFFFFB3]">Hair Thickness</div>
                    <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                  </div>
                  <div className="text-sm font-bold mb-1">{lossMetrics.hairThickness.value}</div>
                  <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${gender === "Female"
                        ? "bg-[#D8B5F4]"
                        : lossMetrics.hairThickness.percentage > 70
                          ? "bg-green-500"
                          : lossMetrics.hairThickness.percentage > 40
                            ? "bg-orange-500"
                            : "bg-red-500"}`}
                      style={{ width: `${Math.min((lossMetrics.hairThickness.percentage / 120) * 100, 100)}%` }}>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scalp Hair Counts - More compact version */}
            {lossMetrics.scalpHairCounts.visible && (
              <div className={`bg-[#2C2D30] p-3 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-[#FFFFFFB3]">Scalp Hair Counts</div>
                  <Info className="h-3 w-3 text-[#FFFFFFB3]" />
                </div>
                <hr className="h-px mx-2 bg-gray-700 border-0 my-1" />
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div>
                    <div className="text-xs text-[#FFFFFFB3]">Frontal</div>
                    <div className="text-xs font-bold">
                      {lossMetrics.scalpHairCounts.frontal.value}
                      <span className="text-xs text-[#FFFFFFB3]">{lossMetrics.scalpHairCounts.frontal.unit}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#FFFFFFB3]">Occipital</div>
                    <div className="text-xs font-bold">
                      {lossMetrics.scalpHairCounts.occipital.value}
                      <span className="text-xs text-[#FFFFFFB3]">{lossMetrics.scalpHairCounts.occipital.unit}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-[#FFFFFFB3]">Vertex</div>
                    <div className="text-xs font-bold">
                      {lossMetrics.scalpHairCounts.vertex.value}
                      <span className="text-xs text-[#FFFFFFB3]">{lossMetrics.scalpHairCounts.vertex.unit}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
                              <div className=" w-full text-center italic left-0">
                  <p className="text-white font-semibold flex items-center justify-center bg-[#121212]">
                    Strand   <Image src={logomale} alt="Logo Male" className="ml-1 w-5"/>  AI
                 
                  </p>
                </div>

            {/* Action Buttons - Fixed position at bottom */}
            <div className="absolute bottom-4 w-full px-3">
              {/* Brand */}
              {/* {gender === 'Male' && ( */}
                <div className="w-full text-center italic mb-2">
                  <p className="text-blue-500 font-semibold flex items-center justify-center gap-1 bg-[#121212] text-xs">
                    Strand    <Image src={logomale} alt="Logo Male" className="w-4" /> AI
                 
                  </p>
                </div>
              {/* )} */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  className={`border ${gender === "Female" ? "border-[#D8B5F4] text-[#D8B5F4]" : "border-[#764AF7] text-[#764AF7]"} bg-transparent rounded-full py-1.5 flex items-center justify-center gap-1 text-xs font-medium`}
                  onClick={saveScreenshot}>
                  Save
                  <Download className="h-3 w-3" />
                </button>
                <button
                  onClick={shareScreenshot}
                  className={`${gender === "Female" ? "bg-[#D8B5F4]" : "bg-[#764AF7]"} rounded-full py-1.5 flex items-center justify-center gap-1 text-xs font-medium text-white`}>
                  Share
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
    

                {/* Hair Style Screen */}
                {screenType === "Hair Style" && (
                  <div className="px-4 space-y-3 mt-2 overflow-y-auto h-full mb-4">
                    {/* Face Shape */}
                  
                    {styleMetrics.faceShape.visible && (
                      <div
                        className={`bg-[#2C2D30] p-3 rounded-lg flex items-center ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35] " : "border  border-[#505257]"}`}
                      >
                        <div className="mr-3">
                          <div
                            className={`w-8 h-8 rounded-full ${gender === "Female" ? "bg-pink-900/50" : "bg-blue-900"} flex items-center justify-center`}
                          >
                            <span className="text-xs">👤</span>
                          </div>
                        </div>
                        <div>
                          <div className={`text-sm ${gender === "Female" ? "text-pink-300" : "text-[#FFFFFFB3]"}`}>
                            Face Shape
                          </div>
                          <div className="text-xl font-bold">{styleMetrics.faceShape.value}</div>
                        </div>
                        {images[0] ? (
                          <div className="ml-auto">
                            <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                              <Image src={images[0] || imagePla} alt="Face" fill className="object-cover" />
                            </div>
                          </div>
                        ):(
                          <div className="ml-auto">
                          <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                            <Image src={imagePla} alt="Face" fill className="object-cover" />
                          </div>
                        </div>
                        )}
                      </div>
                    )}

                    {/* Recommended Haircuts */}
                    {visibleRecommendedStyles.length > 0 && (
                      <div className="">
                        <div className={`text-lg font-bold ${gender === "Female" ? "text-pink-300" : ""}`}>
                          Recommended Haircuts
                        </div>
                        <div className="text-xs text-[#FFFFFFB3]">Tailored to your face shape & hair attributes</div>

                        <div className="grid grid-cols-2 gap-2">
  {visibleRecommendedStyles.map((style, index) => (
    
    <div
      key={index}
      className={`bg-[#2C2D30] rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}
    >
      <div className="aspect-square relative">
      <Image
  src={style.imageUrl && !style.imageUrl.includes("placeholder.svg") ? style.imageUrl : imagePla}
  alt={style.name}
  fill
  className="object-cover"
/>
      </div>
      <div className="p-2">
        <div
          className={`text-sm font-bold ${
            gender === "Female" ? "text-pink-300" : ""
          }`}
        >
          {style.name}
        </div>
        <div className="text-xs text-[#FFFFFFB3] line-clamp-3">
          {style.description}
        </div>
      </div>
    </div>
  ))}
</div>


<button
  className={`w-full ${
    gender === "Female"
      ? "bg-gradient-to-r from-pink-500 to-purple-500"
      : "bg-gradient-to-r from-indigo-600 to-purple-600"
  } rounded-xl py-3 mt-1 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all duration-300`}
>
  <span className="mr-2">Hairstyle Guide</span>
  {/* <span>→</span> */}
  <Image src={arrowRight} alt="Image" />
</button>

                      </div>
                    )}
                                      <div className=" w-full text-center italic left-0">
                  <p className="text-white font-semibold flex items-center justify-center bg-[#121212]">
                    Strand   <Image src={logomale} alt="Logo Male" className="ml-1 w-5"/>  AI
                 
                  </p>
                </div>
                  </div>
                )}

                {/* Action Plan Screen */}
                {screenType === "Action Plan" && (
  <div className="px-3  space-y-2 h-full relative">
    {/* Description - Reduced padding and smaller text */}
    <div  className={`p-2 bg-[#2C2D30]  rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}>
      <p className="text-xs text-gray-300 leading-tight line-clamp-3">{actionMetrics.description}</p>
    </div>

    {/* Frequency & Duration - Reduced size and spacing */}
    <div className="grid grid-cols-2 gap-2">
      {actionMetrics.frequency.visible && (
        <div
        className={`bg-[#2C2D30] p-2 rounded-2xl ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}
        >
          <div className={`text-xs ${gender === "Female" ? "text-pink-300" : "text-[#FFFFFFB3]"}`}>
            Frequency
          </div>
          <div className="text-sm font-bold">{actionMetrics.frequency.value}</div>
        </div>
      )}

      {actionMetrics.duration.visible && (
        <div
          className={`bg-[#2C2D31] p-2 rounded-lg ${gender === "Female" ? "border border-pink-900/30" : ""}`}
        >
          <div className={`text-xs ${gender === "Female" ? "text-pink-300" : "text-[#FFFFFFB3]"}`}>
            Duration
          </div>
          <div className="text-sm font-bold">{actionMetrics.duration.value}</div>
        </div>
      )}
      
    </div>

    {/* Main Image - Kept but with modest height reduction */}
    <div className="grid grid-cols-2 gap-2 h-28">
  {/* Main Image */}
  <div className=" bg-[#2C2D31] rounded-lg overflow-hidden relative">
    <Image
      src={actionMetrics.imageUrl ? actionMetrics.imageUrl : imagePla}
      alt={actionMetrics.title}
      fill
      className="object-cover"
    />
  </div>

  {/* Before & After Image */}
  {actionMetrics.beforeAfterImage.enabled && (
    
    <div className="bg-[#2C2D31] p-2 rounded-lg">
      <div className={`text-xs ${gender === "Female" ? "text-pink-300" : "text-[#FFFFFFB3]"} mb-1`}>
        Before & After
      </div>
      <div className="h-8/10 bg-[#2C2D31] rounded-lg overflow-hidden relative">
        <Image
          src={actionMetrics.beforeAfterImage.imageUrl || imagePla}
          alt="Before and after"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )}
</div>

    {/* Recommended Products - More compact but keeping all images */}
    {visibleRecommendedProducts.length > 0 && (
      <div className="space-y-1">
        <div className={`text-xs font-bold ${gender === "Female" ? "text-pink-300" : ""}`}>
          Recommended Products
        </div>

        <div className="grid grid-cols-1 gap-2">
          {visibleRecommendedProducts.slice(0, 2).map((product, index) => (
            <div
              key={index}
              className={`bg-[#2C2D30] p-1.5 rounded-2xl flex items-center ${gender === "Female" ? "border border-pink-200/20  bg-gradient-to-b from-[#2C2D30] via-[#2C2D30] to-[#3A2A35]" : "border  border-[#505257]"}`}
            >
              <div className="relative w-10 h-10 shrink-0 rounded overflow-hidden mr-1">
                <Image
                  src={product.imageUrl ? product.imageUrl : imagePla}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <div className={`text-xs font-bold truncate ${gender === "Female" ? "text-pink-300" : ""}`}>
                  {product.name}
                </div>
                <div className="text-xs text-[#FFFFFFB3] line-clamp-2">{product.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {/* Shop Now Button - Moved closer to recommended products */}
    {visibleRecommendedProducts.length > 0 && (
      <button
      className={`w-full ${
        gender === "Female"
          ? "bg-gradient-to-r from-pink-500 to-purple-500"
          : "bg-gradient-to-r from-indigo-600 to-purple-600"
      } rounded-full py-3 flex items-center justify-center text-white font-semibold text-sm shadow-lg hover:opacity-90 transition-all duration-300`}
    
      >
        <ShoppingBag className="mr-1 h-3 w-3" />
        <span>SHOP NOW</span>
      </button>
    )}
                      <div className=" w-full text-center italic left-0">
                  <p className="text-white font-semibold flex items-center justify-center bg-[#121212]">
                    Strand   <Image src={logomale} alt="Logo Male" className="ml-1 w-5"/>  AI
                 
                  </p>
                </div>
    
    {/* Action Buttons - Fixed position at bottom */}
    <div className="absolute bottom-4 w-full">
      {/* Brand Logo */}
      {/* {gender === 'Male' && ( */}
        <div className="w-full text-center italic mb-2">
          <p className="text-white font-semibold flex items-center justify-center gap-1 bg-[#121212] text-xs">
            Strand   <Image src={logomale} alt="Logo Male" className="w-4" /> AI
          
          </p>
        </div>
      {/* )} */}
      
      {/* Save/Share Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          className={`border ${gender === "Female" ? "border-[#D8B5F4] text-[#D8B5F4]" : "border-[#764AF7] text-[#764AF7]"} bg-transparent rounded-full py-1.5 flex items-center justify-center gap-1 text-xs font-medium`}
          onClick={saveScreenshot}>
          Save
          <Download className="h-3 w-3" />
        </button>
        <button
          onClick={shareScreenshot}
          className={`${gender === "Female" ? "bg-[#D8B5F4] text-black" : "bg-[#764AF7] text-white"} rounded-full py-1.5 flex items-center justify-center gap-1 text-xs font-medium`}>
          Share
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  </div>

)}

              

       
                {/* Action Buttons */}
                <div className="absolute bottom-0 w-full bg-[#121212]  px-8 shadow-[0_-2px_10px_rgba(0,0,0,0.5)]">
                         {/* Brand */}
                         {/* {gender==='Male' && ( */}
              
{/* )} */}
        <div className="grid grid-cols-2 gap-4">
          <button
            className={`border ${
              gender === "Female" ? "border-[#D8B5F4] text-[#D8B5F4]" : "border-[#764AF7] text-[#764AF7]"
            } bg-transparent rounded-full py-2 flex items-center justify-center gap-2 text-sm font-medium`}
            onClick={saveScreenshot}
          >
            Save
            <Download className=" h-[14px] w-[14px]" />
          </button>
          <button 
            onClick={shareScreenshot}
            className={`${
              gender === "Female" ? "bg-[#D8B5F4] text-black" : "bg-[#764AF7] text-white"
            }  rounded-full py-2 flex items-center justify-center gap-2 text-sm font-medium `}
          >
            Share
            <Send className=" h-[14px] w-[14px]" />
          </button>
        </div>

</div>
                </div>
              </div>

              {/* Home indicator */}
              <div className="absolute left-[-12px] top-20 w-[6px] h-8 bg-zinc-900 rounded-l-md shadow-md"></div>
        
       
        <div className="absolute left-[-12px] top-36 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
      
        <div className="absolute left-[-12px] top-52 w-[6px] h-12 bg-zinc-900 rounded-l-md shadow-md"></div>
        
       
        <div className="absolute right-[-12px] top-36 w-[6px] h-16 bg-zinc-900 rounded-r-md shadow-md"></div>
    </div>
        
          </div>
        </CardContent>
      </div>
    </div>
  )
}

