"use client";

import { useParams } from "next/navigation"; // Correct import for dynamic route params
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ScreenshotPage() {
  const params = useParams(); // Correct way to get dynamic route params
  const id = params?.id as string; // Ensure id is treated as a string
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    console.log("id: ", id);
    if (!id) return;

    const fetchScreenshot = async () => {
      const { data, error } = await supabase
        .from("screenshots")
        .select("url")
        .eq("id", id)
        .single();

      console.log("data:", data);
      if (error || !data) {
        console.error("Screenshot not found", error);
        return;
      }

      setImageUrl(data.url);
    };

    fetchScreenshot();
  }, [id]);

  if (!imageUrl) return <p>Loading screenshot...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Shared Screenshot</h1>
      <Image
  src={imageUrl}
  alt="Shared Screenshot"
  width={100}
height={200}

style={{ height: "100%" }} 
  className="rounded-lg shadow-lg "
/>

    </div>
  );
}
