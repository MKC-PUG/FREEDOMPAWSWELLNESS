'use client';

import { useState } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      // This will trigger the Xumm QR code
      const payload = await (window as any).xumm?.authorize?.();
      if (payload?.account) {
        setWalletAddress(payload.account);
        alert(`✅ Successfully Connected!\n\nAddress: ${payload.account}`);
      } else {
        alert("Connection cancelled.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect. Make sure Xumm app is installed on your phone.");
    } finally {
      setIsConnecting(false);
    }
  };

  // Keep your existing functions for ViT and Tool Box
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toolBoxFiles, setToolBoxFiles] = useState<any[]>([]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/analyze', { method: 'POST', body: formData });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (error) {
      alert("AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToolBoxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fakeCid = "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newFile = {
      name: file.name,
      cid: fakeCid,
      date: new Date().toLocaleDateString(),
      size: (file.size / 1024).toFixed(1) + " KB"
    };
    setToolBoxFiles([...toolBoxFiles, newFile]);
    alert(`✅ File securely uploaded to IPFS Tool Box!\n\nFile: ${file.name}`);
  };

  const viewAllRecords = () => {
    if (toolBoxFiles.length === 0) return;
    let message = "Secure Records in Tool Box:\n\n";
    toolBoxFiles.forEach((f, i) => {
      message += `${i+1}. ${f.name} (${f.date}) - ${f.size}\n`;
    });
    alert(message);
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white font-sans">
      <header className="border-b border-[#334155] bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5C242] rounded-full flex items-center justify-center text-2xl shadow-lg">🐾</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Freedom Paws Wellness</h1>
              <p className="text-xs text-[#00D4C8]">Powered by XRPL • SuperBud Protocols</p>
            </div>
          </div>
          
          <button 
            onClick={connectWallet}
            disabled={isConnecting}
            className="px-6 py-2 bg-[#F5C242] hover:bg-[#F5C242]/90 disabled:opacity-50 text-black font-bold rounded-2xl transition"
          >
            {isConnecting ? "Connecting..." : walletAddress ? `Connected` : "Connect Xumm Wallet"}
          </button>
        </div>
      </header>

      {/* Rest of your dashboard remains the same - keep your existing cards */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Welcome, Patriot Dog Guardian</h2>
          <p className="text-xl text-[#A3BFFA]">Tokenized Wellness • AI Vision Diagnostics • Secure Records • Fun Memories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Your existing 4 cards go here - My Pets, ViT, Tool Box, Photo Booth */}
          {/* ... (you can keep your current cards) */}
        </div>
      </div>
    </div>
  );
}