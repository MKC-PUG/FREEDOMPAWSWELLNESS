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
    <div className="min-h-screen bg-[#0A1428] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-[#A3BFFA] mb-10">Dress up your dog like a hero!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview */}
          <div className="bg-[#1F2A44] border border-[#334155] rounded-3xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview</h2>
            
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video border border-[#334155]">
              {uploadedImage && (
                <img 
                  src={uploadedImage} 
                  alt="dog" 
                  className="absolute inset-0 w-full h-full object-contain z-10"
                />
              )}
              <img 
                src={backgrounds[selectedBackground as keyof typeof backgrounds]} 
                alt="bg" 
                className="absolute inset-0 w-full h-full object-cover opacity-40 z-0" 
              />

              {/* Wardrobe Items */}
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
              <div className="bg-[#1F2A44] hover:bg-[#334155] border-2 border-dashed border-[#334155] rounded-3xl p-12 text-center transition text-xl">
                📸 Click to Upload Dog Photo
              </div>
            </label>

            <div>
              <h3 className="font-bold mb-4 text-lg">🌄 Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(backgrounds).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-4 rounded-2xl border ${selectedBackground === bg ? 'border-[#F5C242] bg-[#F5C242]/20' : 'border-[#334155] hover:border-white'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-lg">👕 Tap to Add / Remove</h3>
              <div className="grid grid-cols-2 gap-4">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-6 rounded-2xl border text-left transition-all ${activeItems.includes(item.id) ? 'border-[#F5C242] bg-[#F5C242]/20' : 'border-[#334155] hover:border-white'}`}
                  >
                    <span className="text-5xl block mb-3">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {uploadedImage && (
              <button
                onClick={() => alert("📸 Take a screenshot for now!\n\nFull download coming soon.")}
                className="w-full bg-[#F5C242] hover:bg-[#F5C242]/90 text-black font-bold py-6 rounded-3xl text-xl"
              >
                📥 Save Your Creation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}