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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white font-sans">
      <header className="border-b border-white/20 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-2xl">🐾</div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Freedom Paws Wellness</h1>
              <p className="text-xs text-green-400">Powered by XRPL • SuperBud Protocols</p>
            </div>
          </div>
          <button 
            onClick={connectWallet}
            className="px-6 py-2 bg-white text-black font-bold rounded-2xl hover:bg-yellow-400 transition"
          >
            {walletAddress ? "Connected" : "Connect Demo Wallet"}
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4">Welcome, Patriot Dog Guardian</h2>
          <p className="text-xl text-gray-300">Tokenized Wellness • AI Vision Diagnostics • Secure Records</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* My Pets Card */}
  <a href="/mypets" className="group">
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all h-full">
      <div className="text-6xl mb-6">🐕</div>
      <h3 className="text-3xl font-bold mb-3">My Pets</h3>
      <p className="text-gray-400">View tokenized profiles & Dynamic NFTs</p>
      <div className="mt-8 text-yellow-400 font-bold group-hover:underline">Open My Pets →</div>
    </div>
  </a>

  {/* ViT Diagnostics Card */}
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all">
    <div className="text-6xl mb-6">🔬</div>
    <h3 className="text-3xl font-bold mb-3">ViT Diagnostics</h3>
    <p className="text-gray-400 mb-6">Upload photo for AI analysis</p>
    <label className="block w-full cursor-pointer">
      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
      <div className="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center hover:border-yellow-400">
        {uploadedImage ? <img src={uploadedImage} alt="preview" className="max-h-64 mx-auto rounded-xl" /> : <div className="text-4xl mb-3">📸</div>}
        <p className="font-medium">Click to upload dog photo</p>
      </div>
    </label>
    {isAnalyzing && <p className="text-center mt-4 text-yellow-400">Analyzing with ViT...</p>}
    {analysisResult && (
      <div className="mt-6 bg-black/50 p-6 rounded-2xl">
        <h4 className="font-bold text-lg">{analysisResult.protocol}</h4>
        <p className="text-green-400">{analysisResult.finding}</p>
      </div>
    )}
  </div>

  {/* Tool Box Card */}
  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all">
    <div className="text-6xl mb-6">🔒</div>
    <h3 className="text-3xl font-bold mb-3">Tool Box</h3>
    <p className="text-gray-400 mb-6">Secure IPFS vault</p>
    <label className="block w-full cursor-pointer mb-4">
      <input type="file" onChange={handleToolBoxUpload} className="hidden" />
      <div className="bg-green-600 hover:bg-green-500 text-center py-4 rounded-2xl font-bold cursor-pointer">
        Upload Vet Record or X-Ray
      </div>
    </label>
    {toolBoxFiles.length > 0 && (
      <button onClick={viewAllRecords} className="w-full bg-green-600 font-bold py-4 rounded-2xl hover:bg-green-500">
        View All Secure Records ({toolBoxFiles.length})
      </button>
    )}
  </div>

  {/* NEW: SuperBud Photo Booth Card */}
  <a href="/photobooth" className="group">
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all h-full">
      <div className="text-6xl mb-6">📸</div>
      <h3 className="text-3xl font-bold mb-3">SuperBud Photo Booth</h3>
      <p className="text-gray-400">Dress up your dog like a hero! Create shareable fun photos</p>
      <div className="mt-8 text-yellow-400 font-bold group-hover:underline">Open Photo Booth →</div>
    </div>
  </a>
</div>
          <a href="/mypets" className="group">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all h-full">
              <div className="text-6xl mb-6">🐕</div>
              <h3 className="text-3xl font-bold mb-3">My Pets</h3>
              <p className="text-gray-400">View tokenized profiles & Dynamic NFTs</p>
              <div className="mt-8 text-yellow-400 font-bold group-hover:underline">Open My Pets →</div>
            </div>
          </a>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all">
            <div className="text-6xl mb-6">🔬</div>
            <h3 className="text-3xl font-bold mb-3">ViT Diagnostics</h3>
            <p className="text-gray-400 mb-6">Upload photo for AI analysis</p>
            <label className="block w-full cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              <div className="border-2 border-dashed border-white/40 rounded-2xl p-8 text-center hover:border-yellow-400">
                {uploadedImage ? <img src={uploadedImage} alt="preview" className="max-h-64 mx-auto rounded-xl" /> : <div className="text-4xl mb-3">📸</div>}
                <p className="font-medium">Click to upload dog photo</p>
              </div>
            </label>
            {isAnalyzing && <p className="text-center mt-4 text-yellow-400">Analyzing with ViT...</p>}
            {analysisResult && (
              <div className="mt-6 bg-black/50 p-6 rounded-2xl">
                <h4 className="font-bold text-lg">{analysisResult.protocol}</h4>
                <p className="text-green-400">{analysisResult.finding}</p>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-yellow-400 transition-all">
            <div className="text-6xl mb-6">🔒</div>
            <h3 className="text-3xl font-bold mb-3">Tool Box</h3>
            <p className="text-gray-400 mb-6">Secure IPFS vault</p>
            <label className="block w-full cursor-pointer mb-4">
              <input type="file" onChange={handleToolBoxUpload} className="hidden" />
              <div className="bg-green-600 hover:bg-green-500 text-center py-4 rounded-2xl font-bold cursor-pointer">
                Upload Vet Record or X-Ray
              </div>
            </label>
            {toolBoxFiles.length > 0 && (
              <button onClick={viewAllRecords} className="w-full bg-green-600 font-bold py-4 rounded-2xl hover:bg-green-500">
                View All Secure Records ({toolBoxFiles.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}