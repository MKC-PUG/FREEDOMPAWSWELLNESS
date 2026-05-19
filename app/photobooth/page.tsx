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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Dress up your dog like a hero!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Preview</h2>
            
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video border border-white/30 min-h-[500px] flex items-center justify-center">
              {/* Background */}
              <img 
                src={backgrounds[selectedBackground as keyof typeof backgrounds]} 
                alt="background" 
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dog Photo */}
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="dog" 
                  className="relative z-10 max-h-[85%] rounded-xl shadow-2xl"
                />
              )}

              {/* Wardrobe Overlays */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {activeItems.includes("cape") && <div className="absolute top-[25%] right-[15%] text-[220px]">🦸</div>}
                {activeItems.includes("hat") && <div className="absolute top-[8%] left-[42%] text-[130px]">🎩</div>}
                {activeItems.includes("glasses") && <div className="absolute top-[42%] left-[45%] text-[95px]">😎</div>}
                {activeItems.includes("bandana") && <div className="absolute bottom-[28%] left-[35%] text-[110px]">🧣</div>}
                {activeItems.includes("bow") && <div className="absolute bottom-[35%] right-[32%] text-[85px]">🎀</div>}
              </div>
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
              <h3 className="font-bold mb-4">🌄 Background</h3>
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
              <h3 className="font-bold mb-4">👕 Tap to Add / Remove</h3>
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
                onClick={() => alert("📸 Take a screenshot of the preview for now!\n\nFull download coming soon.")}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-6 rounded-3xl text-xl"
              >
                📥 Save Your Photo (Screenshot)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}