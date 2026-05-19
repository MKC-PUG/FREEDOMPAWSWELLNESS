'use client';

import { useState, useEffect } from 'react';

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    setStatus("✅ Demo Mode Active - Xumm coming soon");
  }, []);

  const connectWallet = () => {
    // Demo connection
    const demoAddress = "rDemoXummWallet1234567890TestnetXRPL";
    setWalletAddress(demoAddress);
    setStatus("✅ Demo Wallet Connected");
    alert(`✅ Demo Wallet Connected!\n\nAddress:\n${demoAddress}\n\n(Real Xumm will be added after build is stable)`);
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
            className="px-8 py-3 bg-[#F5C242] text-black font-bold rounded-2xl hover:bg-yellow-300 transition"
          >
            {walletAddress ? `✅ Connected` : "Connect Xumm Wallet"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-2xl mb-6">Status: <span className="text-[#00D4C8] font-mono">{status}</span></p>
        <p className="text-sm text-gray-400">Xumm integration will be added once build is stable</p>
      </div>

      {/* Add your 4 cards (My Pets, ViT, Tool Box, Photo Booth) below here later */}
    </div>
  );
}