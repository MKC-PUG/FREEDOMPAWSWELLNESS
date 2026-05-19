'use client';

import { useState } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [items, setItems] = useState<Array<{id: number, emoji: string, x: number, y: number}>>([]);

  const backgrounds = {
    lake: "https://picsum.photos/id/1015/1200/800",
    patriotic: "https://picsum.photos/id/1016/1200/800",
    superhero: "https://picsum.photos/id/133/1200/800",
    forest: "https://picsum.photos/id/1018/1200/800",
  };

  const wardrobe = [
    { emoji: "🦸", name: "SuperBud Cape" },
    { emoji: "🎩", name: "Patriotic Hat" },
    { emoji: "😎", name: "Cool Shades" },
    { emoji: "🧣", name: "Freedom Bandana" },
    { emoji: "🎀", name: "Celebration Bow" },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setItems([]); // Clear previous items
    }
  };

  const addItem = (emoji: string) => {
    const newItem = {
      id: Date.now(),
      emoji,
      x: 45,
      y: 40,
    };
    setItems([...items, newItem]);
  };

  const updatePosition = (id: number, x: number, y: number) => {
    setItems(items.map(item => item.id === id ? { ...item, x, y } : item));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Drag items onto your dog to create magic!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview Area */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview - Drag to Position</h2>
            
            <div className="relative bg-black rounded-3xl overflow-hidden aspect-video border-2 border-white/30" style={{
              backgroundImage: uploadedImage ? `url(${uploadedImage})` : `url(${backgrounds[selectedBackground as keyof typeof backgrounds]})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="absolute text-8xl cursor-move select-none drop-shadow-2xl"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                  draggable
                  onDragEnd={(e) => {
                    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
                    if (rect) {
                      const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
                      const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
                      updatePosition(item.id, x, y);
                    }
                  }}
                  onDoubleClick={() => removeItem(item.id)}
                >
                  {item.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/40 rounded-3xl p-12 text-center transition text-xl">
                📸 Upload Your Dog's Photo
              </div>
            </label>

            <div>
              <h3 className="font-bold mb-4">🌄 Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(backgrounds).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-4 rounded-2xl border ${selectedBackground === bg ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">👕 Tap to Add Item (then drag on photo)</h3>
              <div className="grid grid-cols-3 gap-4">
                {wardrobe.map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => addItem(item.emoji)}
                    className="p-8 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition text-6xl hover:scale-110"
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            {uploadedImage && (
              <button
                onClick={() => alert("🎉 Take a screenshot (Cmd + Shift + 4) for now!\n\nAdvanced download coming soon.")}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-6 rounded-3xl text-xl"
              >
                📥 Save Your Creation (Screenshot)
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}