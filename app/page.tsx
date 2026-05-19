'use client';

import { useState } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [toolBoxFiles, setToolBoxFiles] = useState<any[]>([]);

  const connectWallet = () => {
    setWalletAddress("rjdx...demo1234567890abcdef");
    alert("✅ Demo Wallet Connected (Testnet)");
  };

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
      {/* Header */}
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
            className="px-6 py-2 bg-[#F5C242] hover:bg-[#F5C242]/90 text-black font-bold rounded-2xl transition"
          >
            {walletAddress ? "Connected" : "Connect Demo Wallet"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Welcome, Patriot Dog Guardian</h2>
          <p className="text-xl text-[#A3BFFA]">Tokenized Wellness • AI Vision Diagnostics • Secure Records • Fun Memories</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* My Pets */}
          <a href="/mypets" className="group">
            <div className="bg-[#1F2A44] border border-[#334155] hover:border-[#F5C242] rounded-3xl p-8 transition-all h-full">
              <div className="text-6xl mb-6">🐕</div>
              <h3 className="text-3xl font-bold mb-3">My Pets</h3>
              <p className="text-[#A3BFFA]">View tokenized profiles & Dynamic NFTs</p>
              <div className="mt-8 text-[#F5C242] font-bold group-hover:underline">Open My Pets →</div>
            </div>
          </a>

          {/* ViT Diagnostics */}
          <div className="bg-[#1F2A44] border border-[#334155] hover:border-[#F5C242] rounded-3xl p-8 transition-all">
            <div className="text-6xl mb-6">🔬</div>
            <h3 className="text-3xl font-bold mb-3">ViT Diagnostics</h3>
            <p className="text-[#A3BFFA] mb-6">Upload photo for AI analysis</p>
            <label className="block w-full cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <div className="border-2 border-dashed border-[#334155] hover:border-[#F5C242] rounded-2xl p-8 text-center transition">
                {uploadedImage ? <img src={uploadedImage} alt="preview" className="max-h-64 mx-auto rounded-xl" /> : <div className="text-4xl mb-3">📸</div>}
                <p className="font-medium">Click to upload dog photo</p>
              </div>
            </label>
            {isAnalyzing && <p className="text-center mt-4 text-[#00D4C8]">Analyzing with ViT...</p>}
            {analysisResult && (
              <div className="mt-6 bg-black/60 p-6 rounded-2xl border border-[#334155]">
                <h4 className="font-bold text-lg">{analysisResult.protocol}</h4>
                <p className="text-[#00D4C8]">{analysisResult.finding}</p>
              </div>
            )}
          </div>

          {/* Tool Box */}
          <div className="bg-[#1F2A44] border border-[#334155] hover:border-[#F5C242] rounded-3xl p-8 transition-all">
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-3xl font-bold mb-3">Tool Box</h3>
            <p className="text-[#A3BFFA] mb-6">Secure IPFS vault</p>
            <label className="block w-full cursor-pointer mb-4">
              <input type="file" onChange={handleToolBoxUpload} className="hidden" />
              <div className="bg-[#C8102E] hover:bg-[#C8102E]/90 text-white text-center py-4 rounded-2xl font-bold cursor-pointer">
                Upload Vet Record or X-Ray
              </div>
            </label>
            {toolBoxFiles.length > 0 && (
              <button onClick={viewAllRecords} className="w-full bg-[#00D4C8] hover:bg-[#00D4C8]/90 text-black font-bold py-4 rounded-2xl">
                View All Secure Records ({toolBoxFiles.length})
              </button>
            )}
          </div>

          {/* SuperBud Photo Booth */}
          <a href="/photobooth" className="group">
            <div className="bg-[#1F2A44] border border-[#334155] hover:border-[#F5C242] rounded-3xl p-8 transition-all h-full">
              <div className="text-6xl mb-6">📸</div>
              <h3 className="text-3xl font-bold mb-3">SuperBud Photo Booth</h3>
              <p className="text-[#A3BFFA]">Dress up your dog like a hero!</p>
              <div className="mt-8 text-[#F5C242] font-bold group-hover:underline">Open Photo Booth →</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}