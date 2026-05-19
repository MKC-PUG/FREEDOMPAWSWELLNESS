'use client';

import { useState, useRef, useEffect } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      setSelectedItems(["cape"]); // Default cape
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

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = 800;
      canvas.height = 600;

      // Draw selected background
      const bg = new Image();
      bg.src = backgrounds[selectedBackground as keyof typeof backgrounds];
      bg.onload = () => {
        ctx.drawImage(bg, 0, 0, 800, 600);

        // Draw dog photo (centered, slightly larger)
        const ratio = Math.min(620 / img.width, 480 / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        const x = (800 - newWidth) / 2;
        const y = (600 - newHeight) / 2 + 40;

        ctx.drawImage(img, x, y, newWidth, newHeight);

        // Add wardrobe overlays with better positioning
        ctx.font = "bold 120px Arial";
        ctx.textAlign = "center";

        if (selectedItems.includes("cape")) ctx.fillText("🦸", x + newWidth * 0.75, y + newHeight * 0.45);
        if (selectedItems.includes("hat")) ctx.fillText("🎩", x + newWidth * 0.5, y + 60);
        if (selectedItems.includes("bandana")) ctx.fillText("🧣", x + newWidth * 0.4, y + newHeight * 0.75);
        if (selectedItems.includes("glasses")) ctx.fillText("😎", x + newWidth * 0.55, y + newHeight * 0.45);
        if (selectedItems.includes("bow")) ctx.fillText("🎀", x + newWidth * 0.65, y + newHeight * 0.65);
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
          {/* Preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview</h2>
            <div className="bg-black rounded-3xl overflow-hidden aspect-video flex items-center justify-center border border-white/20">
              {uploadedImage ? (
                <canvas ref={canvasRef} className="max-w-full rounded-3xl" />
              ) : (
                <div className="text-center p-12">
                  <div className="text-7xl mb-6">📸</div>
                  <p className="text-2xl">Upload your dog's photo to begin</p>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/40 rounded-3xl p-10 text-center transition">
                📸 Click to Upload Dog Photo
              </div>
            </label>

            {/* Backgrounds */}
            <div>
              <h3 className="font-bold mb-4">🌄 Backgrounds</h3>
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

            {/* Wardrobe */}
            <div>
              <h3 className="font-bold mb-4">👕 Wardrobe</h3>
              <div className="grid grid-cols-2 gap-3">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-4 rounded-2xl border text-left transition ${selectedItems.includes(item.id) ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
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
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-3xl text-xl transition"
              >
                📥 Download Final Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}