'use client';

import { useState, useEffect } from 'react';
import { Xumm } from 'xumm';

let xummInstance: Xumm | null = null;

export default function FreedomPawsDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [status, setStatus] = useState("Loading...");

  // Initialize Xumm
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_XUMM_API_KEY;
    if (key) {
      try {
        xummInstance = new Xumm(key);
        setStatus("✅ Xumm SDK Ready - Click Connect");
        console.log("🔑 Xumm initialized successfully");
      } catch (e) {
        setStatus("❌ SDK Init Failed");
        console.error(e);
      }
    } else {
      setStatus("❌ API Key Missing in Vercel");
    }
  }, []);

  const connectWallet = async () => {
    if (!xummInstance) {
      alert("Xumm not ready. Check Vercel Environment Variables.");
      return;
    }

    setIsConnecting(true);
    setStatus("Opening Xumm...");

    try {
      const payload = await xummInstance.authorize();
      if (payload?.account) {
        setWalletAddress(payload.account);
        setStatus("✅ Connected!");
        alert(`✅ Wallet Connected!\n\n${payload.account}`);
      } else {
        setStatus("❌ Connection Cancelled");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Connection Error");
      alert("Connection failed.\n\n1. Open Xumm app on phone\n2. Same WiFi\n3. Try again");
    } finally {
      setIsConnecting(false);
    }
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
            disabled={isConnecting}
            className="px-8 py-3 bg-[#F5C242] text-black font-bold rounded-2xl hover:bg-yellow-300 disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Xumm Wallet"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-xl mb-6">Status: <span className="font-mono text-[#00D4C8]">{status}</span></p>
        <p className="text-sm text-gray-400">If you see this Status box, the new code is live.</p>
      </div>

      {/* Add your other cards below if you want, but keep this for testing */}
    </div>
  );
}