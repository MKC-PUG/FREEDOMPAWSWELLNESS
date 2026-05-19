'use client';

import { useState, useRef } from 'react';

export default function SuperBudPhotoBooth() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string>("lake");
  const [items, setItems] = useState<any[]>([
    { id: 1, type: "cape", emoji: "🦸", x: 55, y: 35 },
  ]);

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

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedImage(URL.createObjectURL(file));
  };

  const addItem = (emoji: string) => {
    const newItem = {
      id: Date.now(),
      type: emoji,
      emoji: emoji,
      x: 45 + Math.random() * 20,
      y: 30 + Math.random() * 20,
    };
    setItems([...items, newItem]);
  };

  const updateItemPosition = (id: number, x: number, y: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, x, y } : item
    ));
  };

  const downloadPhoto = () => {
    const preview = document.getElementById('preview');
    if (!preview) return;
    
    const link = document.createElement('a');
    link.download = 'superbud-dog-photo.png';
    link.href = (preview as HTMLDivElement).style.backgroundImage 
      ? (preview as HTMLDivElement).style.backgroundImage.replace(/url\(['"](.+)['"]\)/, '$1')
      : '';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-black to-red-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">🦸 SuperBud Photo Booth</h1>
        <p className="text-center text-xl text-gray-300 mb-10">Drag items onto your dog!</p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Preview Area */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-center">Live Preview - Drag Items</h2>
            
            <div 
              id="preview"
              className="relative bg-black rounded-3xl overflow-hidden aspect-video border border-white/30"
              style={{
                backgroundImage: uploadedImage ? `url(${uploadedImage})` : `url(${backgrounds[selectedBackground as keyof typeof backgrounds]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {items.map((item) => (
               