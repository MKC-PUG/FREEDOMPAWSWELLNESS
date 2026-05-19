'use client';

import { useState, useRef, useEffect } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [selectedItems, setSelectedItems] = useState<string[]>(["cape"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgrounds = {
    lake: "https://picsum.photos/id/1015/800/600",   // Lake scene
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
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'superbud-dog-photo.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Improved Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 600;

      // Draw background
      const bgImg = new Image();
      bgImg.src = backgrounds[selectedBackground as keyof typeof backgrounds];
      bgImg.onload = () => {
        ctx.drawImage(bgImg, 0, 0, 800, 600);

        // Draw dog photo (centered)
        const ratio = Math.min(800 / img.width, 500 / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const x = (800 - newWidth) / 2;
        const y = (600 - newHeight) / 2 + 30;
        ctx.drawImage(img, x, y, newWidth, newHeight);

        // Add wardrobe items
        ctx.font = "bold 140px Arial";
        ctx.textAlign = "center";

        if (selectedItems.includes("cape")) ctx.fillText("🦸", 580, y + 120);
        if (selectedItems.includes("hat")) ctx.fillText("🎩", 420, y - 40);
        if (selectedItems.includes("bandana")) ctx.fillText("🧣", 380, y + 180);
        if (selectedItems.includes("glasses")) ctx.fillText("😎", 480, y + 80);
        if (selectedItems.includes("bow")) ctx.fillText("🎀", 520, y + 160);
      };
    };
    img.src = uploadedImage;
  }, [uploadedImage, selectedBackground, selectedItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Turn your dog into a hero!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview Area */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview</h2>
            <div className="bg-black rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              {uploadedImage ? (
                <canvas ref={canvasRef} className="max-w-full rounded-2xl" />
              ) : (
                <div className="text-center">
                  <div className="text-7xl mb-4">📸</div>
                  <p className="text-xl">Upload a photo to start</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            {/* Upload */}
            <div>
              <label className="block w-full cursor-pointer">
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <div className="bg-white/10 hover:bg-white/20 border border-white/30 rounded-3xl p-8 text-center transition">
                  📸 Click to Upload Dog Photo
                </div>
              </label>
            </div>

            {/* Backgrounds */}
            <div>
              <h3 className="font-bold mb-4">Backgrounds</h3>
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
              <h3 className="font-bold mb-4">Wardrobe</h3>
              <div className="grid grid-cols-2 gap-3">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-4 rounded-2xl border text-left transition ${selectedItems.includes(item.id) ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <span className="text-3xl block mb-1">{item.emoji}</span>
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download */}
            {uploadedImage && (
              <button
                onClick={downloadPhoto}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-3xl text-xl transition flex items-center justify-center gap-3"
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
