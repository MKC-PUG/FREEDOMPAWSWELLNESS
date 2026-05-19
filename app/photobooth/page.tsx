'use client';

import { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  const backgrounds = [
    { name: "Lake", url: "https://picsum.photos/id/1015/1200/800" },
    { name: "Patriotic", url: "https://picsum.photos/id/1016/1200/800" },
    { name: "Superhero", url: "https://picsum.photos/id/133/1200/800" },
    { name: "Forest", url: "https://picsum.photos/id/1018/1200/800" },
  ];

  const wardrobe = [
    { emoji: "🦸", name: "SuperBud Cape" },
    { emoji: "🎩", name: "Patriotic Hat" },
    { emoji: "😎", name: "Cool Shades" },
    { emoji: "🧣", name: "Bandana" },
    { emoji: "🎀", name: "Bow" },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  // Initialize Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvas.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#111',
    });

    return () => {
      fabricCanvas.current?.dispose();
    };
  }, []);

  // Load Background + Dog Photo
  useEffect(() => {
    if (!fabricCanvas.current || !uploadedImage) return;

    const canvas = fabricCanvas.current;
    canvas.clear();

    // Add Background
    fabric.Image.fromURL(backgrounds[0].url, (img) => {
      img.scaleToWidth(800);
      canvas.add(img);
      canvas.sendToBack(img);
    });

    // Add Dog Photo
    fabric.Image.fromURL(uploadedImage, (img) => {
      img.scaleToWidth(500);
      img.set({ left: 150, top: 100 });
      canvas.add(img);
    });
  }, [uploadedImage]);

  const addItem = (emoji: string) => {
    if (!fabricCanvas.current) return;

    const text = new fabric.Text(emoji, {
      fontSize: 120,
      left: 300 + Math.random() * 100,
      top: 200 + Math.random() * 100,
      selectable: true,
    });

    fabricCanvas.current.add(text);
  };

  const download = () => {
    if (!fabricCanvas.current) return;
    const link = document.createElement('a');
    link.download = 'superbud-dog-photo.png';
    link.href = fabricCanvas.current.toDataURL({ format: 'png', quality: 1 });
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Professional drag & drop editor</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Canvas Preview */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Canvas Editor</h2>
            <canvas ref={canvasRef} className="border border-white/30 rounded-2xl mx-auto" />
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <label className="block cursor-pointer">
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div className="bg-white/10 hover:bg-white/20 border-2 border-dashed border-white/40 rounded-3xl p-12 text-center transition text-xl">
                📸 Upload Dog Photo
              </div>
            </label>

            <div>
              <h3 className="font-bold mb-4">Tap to Add Item</h3>
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
                onClick={download}
                className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-6 rounded-3xl text-xl"
              >
                📥 Download High Quality Photo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}