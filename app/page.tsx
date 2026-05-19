'use client';

import { useState } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState("✅ Demo Mode Active");

  const connectWallet = () => {
    const demoAddress = "rDemoXummWallet1234567890TestnetXRPL";
    setWalletAddress(demoAddress);
    setStatus("✅ Demo Wallet Connected");
    alert(`✅ Demo Wallet Connected!\n\n${demoAddress}`);
  };

  // Tool Box
  const [toolBoxFiles, setToolBoxFiles] = useState<any[]>([]);

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
    alert(`✅ Securely uploaded to Tool Box!\n\nFile: ${file.name}`);
  };

  const viewAllRecords = () => {
    if (toolBoxFiles.length === 0) {
      alert("Tool Box is empty. Upload veterinary records or X-rays.");
      return;
    }
    let msg = "🔐 Secure Records in Tool Box:\n\n";
    toolBoxFiles.forEach((f, i) => msg += `${i+1}. ${f.name} (${f.date})\n`);
    alert(msg);
  };

  // ViT Upload
  const handleViTUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    alert(`📸 Photo received: ${file.name}\n\nAI Analysis starting...\n\n(Full GPT-4o analysis will return here soon)`);
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
          
          {/* My Pets - Working */}
          <a href="/mypets" className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition group">
            <div className="text-6xl mb-6">🐕</div>
            <h3 className="text-2xl font-bold mb-3">My Pets</h3>
            <p className="text-gray-400">View your 10 tokenized wellness protocols</p>
          </a>

          {/* ViT Diagnostics */}
          <div className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition">
            <div className="text-6xl mb-6">📸</div>
            <h3 className="text-2xl font-bold mb-3">ViT Diagnostics</h3>
            <p className="text-gray-400 mb-6">AI-powered health analysis from photos</p>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleViTUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#F5C242] file:text-black hover:file:bg-yellow-300"
            />
          </div>

          {/* Tool Box */}
          <div className="bg-[#1F2A44] hover:bg-[#2A3A5A] p-8 rounded-3xl border border-[#334155] transition">
            <div className="text-6xl mb-6">🔐</div>
            <h3 className="text-2xl font-bold mb-3">Tool Box</h3>
            <p className="text-gray-400 mb-6">Secure IPFS vault for records</p>
            <input 
              type="file" 
              onChange={handleToolBoxUpload}
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-green-600 file:text-white"
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
            <p className="text-gray-400">Dress up your dog with capes & backgrounds</p>
          </a>
        </div>
      </div>
    </div>
  );
}