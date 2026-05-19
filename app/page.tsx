'use client';

import { useState } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState("✅ Demo Mode Active");
  const [toolBoxFiles, setToolBoxFiles] = useState<any[]>([]);
  const [vitImage, setVitImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const connectWallet = () => { /* keep your demo */ };

  const handleViTUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const imageUrl = URL.createObjectURL(file);
  setVitImage(imageUrl);
  setAnalysis("🔍 Real AI Analyzing...");

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/analyze', { method: 'POST', body: formData });
    const data = await res.json();
    setAnalysis(data.finding || "Analysis received.");
  } catch (err) {
    setAnalysis("AI service busy. Try again.");
  }
};

    const imageUrl = URL.createObjectURL(file);
    setVitImage(imageUrl);
    setAnalysis("");
    setIsAnalyzing(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setAnalysis(`✅ Real AI Analysis Complete!\n\n**Finding:** ${data.finding}\n**Recommended Protocol:** ${data.protocol}\n**Confidence:** ${data.confidence}`);
      } else {
        setAnalysis("AI service busy. Please try again.");
      }
    } catch (err) {
      setAnalysis("Error connecting to AI. Using fallback analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Tool Box remains the same...

  return (
    <div className="min-h-screen bg-[#0A1428] text-white font-sans">
      {/* Header + 4 cards grid with updated ViT card using the new handleViTUpload */}
      {/* ... keep the rest of your grid ... */}
    </div>
  );
}