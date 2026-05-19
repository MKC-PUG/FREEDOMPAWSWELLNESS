'use client';

import { useState } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [selectedItems, setSelectedItems] = useState<string[]>(["cape"]);

  const backgrounds = {
    lake: "https://picsum.photos/id/1015/800/600",
    patriotic: "https://picsum.photos/id/1016/800/600",
    superhero: "https://picsum.photos/id/133/800/600",
    forest: "https://picsum.photos/id/1018/800/600",
  };

  const wardrobe = [
    { id: "cape", name: "SuperBud Cape", emoji: "🦸" },
    { id: "hat", name: "Patriotic Hat", emoji: "🎩" },
    { id: "bandana", name: "Freedom Bandana", emoji: "🧣" },
    { id: "glasses", name: "Cool Shades", emoji: "😎" },
    { id: "bow", name: "Celebration Bow", emoji: "🎀" },
  ];

  const toggleItem = (itemId: string) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  const downloadPhoto = () => {
    const link = document.createElement('a');
    link.download = 'superbud-dog-photo.png';
    link.href = document.getElementById('preview-area')?.querySelector('img')?.src || '';
    if (link.href) link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Dress up your dog like a hero!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview Area */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview</h2>
            
            <div id="preview-area" className="relative bg-black rounded-3xl overflow-hidden aspect-video flex items-center justify-center border border-white/30">
              {uploadedImage ? (
                <>
                  <img 
                    src={backgrounds[selectedBackground as keyof typeof backgrounds]} 
                    alt="background" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <img 
                    src={uploadedImage} 
                    alt="dog" 
                    className="relative z-10 max-h-[85%] rounded-xl shadow-2xl"
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {selectedItems.includes("cape") && <div className="text-[180px] absolute -top-12 right-12">🦸</div>}
                    {selectedItems.includes("hat") && <div className="text-[90px] absolute -top-8 left-1/2 -translate-x-1/2">🎩</div>}
                    {selectedItems.includes("glasses") && <div className="text-[80px] absolute top-[38%] left-1/2 -translate-x-1/2">😎</div>}
                    {selectedItems.includes("bandana") && <div className="text-[100px] absolute bottom-8 left-1/3">🧣</div>}
                    {selectedItems.includes("bow") && <div className="text-[70px] absolute bottom-12 right-1/3">🎀</div>}
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-6">📸</div>
                  <p className="text-2xl">Upload your dog's photo</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/40 rounded-3xl p-12 text-center transition text-xl">
                📸 Click to Upload Dog Photo
              </div>
            </label>

            {/* Backgrounds */}
            <div>
              <h3 className="font-bold mb-4 text-lg">🌄 Choose Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(backgrounds).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-4 rounded-2xl border text-sm font-medium ${selectedBackground === bg ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Wardrobe */}
            <div>
              <h3 className="font-bold mb-4 text-lg">👕 SuperBud Wardrobe</h3>
              <div className="grid grid-cols-2 gap-3">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-5 rounded-2xl border text-left transition-all ${selectedItems.includes(item.id) ? 'border-yellow-400 bg-yellow-400/20 scale-105' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <span className="text-4xl block mb-2">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {uploadedImage && (
              <button
                onClick={downloadPhoto}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-6 rounded-3xl text-xl transition flex items-center justify-center gap-3"
              >
                📥 Download Your SuperBud Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}