'use client';

import { useState } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState("✅ Demo Mode Active");
  const [toolBoxFiles, setToolBoxFiles] = useState<any[]>([]);
  const [vitImage, setVitImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");

  const connectWallet = () => {
    const demoAddress = "rDemoXummWallet1234567890TestnetXRPL";
    setWalletAddress(demoAddress);
    setStatus("✅ Demo Wallet Connected");
    alert(`✅ Demo Wallet Connected!\n\nAddress:\n${demoAddress}`);
  };

  // ViT Diagnostics - FIXED with immediate preview
  const handleViTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setVitImage(imageUrl);           // This forces preview
    setAnalysis("🔍 Analyzing with AI...");

    // Simulated AI response
    setTimeout(() => {
      setAnalysis(`✅ AI Analysis Complete!\n\n**Recommended Protocol:**\n• Allergy Shield (if skin issues)\n• Buddy's Gut Balance (if digestive signs)\n\nFull real GPT-4o coming next.`);
    }, 1200);
  };

  // Tool Box
  const handleToolBoxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fakeCid = "Qm" + Math.random().toString(36).substring(2, 20);
    const newFile = { 
      name: file.name, 
      cid: fakeCid, 
      date: new Date().toLocaleDateString(),
      size: (file.size / 1024).toFixed(1) + " KB" 
    };
    setToolBoxFiles([...toolBoxFiles, newFile]);
    alert(`✅ Uploaded to Secure Tool Box!\n\nFile: ${file.name}`);
  };

  const viewAllRecords = () => {
    if (toolBoxFiles.length === 0) {
      alert("Tool Box is empty. Upload records first.");
      return;
    }
    let msg = "🔐 Secure Records in Tool Box:\n\n";
    toolBoxFiles.forEach((f, i) => msg += `${i+1}. ${f.name} (${f.date})\n`);
    alert(msg);
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white font-sans">
      <header className="border-b border-[#334155] bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F5C242] rounded-full flex items-center justify-center text-2xl">🐾</div>
            <h1 className="text-2xl font-bold">Freedom Paws Wellness</h1>
          </div>

          <button 
            onClick={connectWallet}
            className="px-8 py-3 bg-[#F5C242] hover:bg-yellow-300 text-black font-bold rounded-2xl transition"
          >
            {walletAddress ? `✅ Connected` : "Connect Xumm Wallet"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-3">Welcome, Patriot Dog Guardian</h2>
          <p className="text-xl text-[#00D4C8]">Status: {status}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* My Pets */}
          <a href="/mypets" className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition group">
            <div className="text-6xl mb-6">🐕</div>
            <h3 className="text-2xl font-bold mb-3">My Pets</h3>
            <p className="text-gray-400">View your 10 tokenized protocols</p>
          </a>

          {/* ViT Diagnostics - Now with Preview */}
          <div className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition">
            <div className="text-6xl mb-6">📸</div>
            <h3 className="text-2xl font-bold mb-3">ViT Diagnostics</h3>
            <p className="text-gray-400 mb-4">Upload photo for AI analysis</p>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleViTUpload}
              className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-[#F5C242] file:text-black cursor-pointer"
            />

            {vitImage && (
              <div className="mt-6 border border-[#334155] rounded-2xl overflow-hidden">
                <img src={vitImage} alt="Dog preview" className="w-full h-auto" />
              </div>
            )}

            {analysis && (
              <div className="mt-4 p-4 bg-black/50 rounded-2xl text-sm whitespace-pre-line">
                {analysis}
              </div>
            )}
          </div>

          {/* Tool Box */}
          <div className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition">
            <div className="text-6xl mb-6">🔐</div>
            <h3 className="text-2xl font-bold mb-3">Tool Box</h3>
            <p className="text-gray-400 mb-4">Secure IPFS vault</p>
            
            <input 
              type="file" 
              onChange={handleToolBoxUpload}
              className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:bg-green-600 file:text-white cursor-pointer"
            />
            <button 
              onClick={viewAllRecords}
              className="mt-4 w-full bg-green-600 hover:bg-green-500 py-3 rounded-2xl font-bold"
            >
              View Records ({toolBoxFiles.length})
            </button>
          </div>

          {/* Photo Booth */}
          <a href="/photobooth" className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition group">
            <div className="text-6xl mb-6">🎨</div>
            <h3 className="text-2xl font-bold mb-3">SuperBud Photo Booth</h3>
            <p className="text-gray-400">Dress up your dog with fun items</p>
          </a>
        </div>
      </div>
    </div>
  );
}