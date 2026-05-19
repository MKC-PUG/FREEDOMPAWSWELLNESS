'use client';

import { useState } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [activeItems, setActiveItems] = useState<string[]>(["cape"]);

  const backgrounds = {
    lake: "https://picsum.photos/id/1015/1200/800",
    patriotic: "https://picsum.photos/id/1016/1200/800",
    superhero: "https://picsum.photos/id/133/1200/800",
    forest: "https://picsum.photos/id/1018/1200/800",
  };

  const wardrobe = [
    { id: "cape", name: "SuperBud Cape", emoji: "🦸" },
    { id: "hat", name: "Patriotic Hat", emoji: "🎩" },
    { id: "glasses", name: "Cool Shades", emoji: "😎" },
    { id: "bandana", name: "Freedom Bandana", emoji: "🧣" },
    { id: "bow", name: "Celebration Bow", emoji: "🎀" },
  ];

  const toggleItem = (id: string) => {
    if (activeItems.includes(id)) {
      setActiveItems(activeItems.filter(item => item !== id));
    } else {
      setActiveItems([...activeItems, id]);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const downloadPhoto = () => {
    alert("📥 Download feature coming in next update!\n\nFor now, take a screenshot of the preview.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Dress up your dog like a hero!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Preview</h2>
            
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video border border-white/30 flex items-center justify-center">
              {uploadedImage ? (
                <img src={uploadedImage} alt="dog" className="max-h-full object-contain relative z-10" />
              ) : (
                <div className="text-center">
                  <div className="text-8xl mb-6">📸</div>
                  <p className="text-2xl">Upload your dog's photo</p>
                </div>
              )}

              {/* Background Overlay */}
              {uploadedImage && (
                <img 
                  src={backgrounds[selectedBackground as keyof typeof backgrounds]} 
                  alt="bg" 
                  className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" 
                />
              )}

              {/* Wardrobe Items */}
              {activeItems.includes("cape") && <div className="absolute top-1/3 right-1/4 text-[180px] z-20">🦸</div>}
              {activeItems.includes("hat") && <div className="absolute top-12 left-1/2 -translate-x-1/2 text-[110px] z-20">🎩</div>}
              {activeItems.includes("glasses") && <div className="absolute top-[42%] left-1/2 -translate-x-1/2 text-[90px] z-20">😎</div>}
              {activeItems.includes("bandana") && <div className="absolute bottom-1/4 left-1/3 text-[100px] z-20">🧣</div>}
              {activeItems.includes("bow") && <div className="absolute bottom-1/3 right-1/3 text-[80px] z-20">🎀</div>}
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
              <h3 className="font-bold mb-4">Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(backgrounds).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-4 rounded-2xl border text-sm ${selectedBackground === bg ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Wardrobe */}
            <div>
              <h3 className="font-bold mb-4">Tap to Add / Remove Items</h3>
              <div className="grid grid-cols-2 gap-4">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-6 rounded-2xl border text-left transition-all ${activeItems.includes(item.id) ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <span className="text-5xl block mb-3">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {uploadedImage && (
              <button
                onClick={downloadPhoto}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-6 rounded-3xl text-xl"
              >
                📥 Download Photo (Screenshot for now)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}