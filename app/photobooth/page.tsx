'use client';

import { useState, useRef, useEffect } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [selectedItems, setSelectedItems] = useState<string[]>(["cape"]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const backgrounds = {
    lake: "https://ipfs.io/ipfs/bafybeigsubrahu7ya7vj7cwkxlj7miilgmslorydkbe7gynm7lo6opgus4", // Lake background
    patriotic: "https://picsum.photos/id/1015/800/600",
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

  // Draw composite image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Add background if needed (simple overlay for now)
      if (selectedBackground !== "lake") {
        const bg = new Image();
        bg.src = backgrounds[selectedBackground as keyof typeof backgrounds];
        bg.onload = () => {
          ctx.globalAlpha = 0.4;
          ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
          ctx.globalAlpha = 1.0;
        };
      }

      // Add SuperBud Cape (simple overlay simulation)
      if (selectedItems.includes("cape")) {
        ctx.font = "bold 120px Arial";
        ctx.fillText("🦸", canvas.width * 0.6, canvas.height * 0.4);
      }
    };
    img.src = uploadedImage;
  }, [uploadedImage, selectedBackground, selectedItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Dress up your dog like a hero!</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload & Preview */}
          <div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-6">Upload Your Dog's Photo</h2>
              <label className="block w-full cursor-pointer">
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                <div className="border-2 border-dashed border-white/40 rounded-2xl p-12 text-center hover:border-yellow-400 transition">
                  {uploadedImage ? (
                    <img src={uploadedImage} alt="preview" className="max-h-96 mx-auto rounded-xl" />
                  ) : (
                    <div>
                      <div className="text-6xl mb-4">📸</div>
                      <p className="text-lg font-medium">Click to upload or take a photo</p>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Backgrounds */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Choose Background</h3>
              <div className="grid grid-cols-4 gap-3">
                {Object.keys(backgrounds).map((bg) => (
                  <button
                    key={bg}
                    onClick={() => setSelectedBackground(bg)}
                    className={`p-3 rounded-xl border ${selectedBackground === bg ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20'}`}
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            {/* Wardrobe */}
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">SuperBud Wardrobe</h3>
              <div className="grid grid-cols-2 gap-3">
                {wardrobe.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-4 rounded-2xl border text-left transition ${selectedItems.includes(item.id) ? 'border-yellow-400 bg-yellow-400/20' : 'border-white/20 hover:border-white/40'}`}
                  >
                    <span className="text-3xl block mb-1">{item.emoji}</span>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Download */}
            {uploadedImage && (
              <button
                onClick={downloadPhoto}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-5 rounded-3xl text-xl transition"
              >
                📥 Download SuperBud Photo
              </button>
            )}
          </div>
        </div>

        {/* Hidden Canvas for Rendering */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}