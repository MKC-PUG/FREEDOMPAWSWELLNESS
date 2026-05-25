'use client';

import { useState } from 'react';

export default function ViTDiagnostics() {
  const [image, setImage] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const analyzeImage = async () => {
    if (!symptoms.trim()) {
      setError("Please describe symptoms");
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('symptoms', symptoms);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (err) {
      setError("Connection error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setSymptoms('');
    setImage(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-2">ViT Diagnostics</h1>
        <p className="text-center text-[#F5C242] mb-12">Upload photo + symptoms for AI protocol recommendation</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo Upload */}
          <div className="bg-[#1F2A44] rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-4">1. Upload Photo</h3>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="photo" />
            <label htmlFor="photo" className="cursor-pointer block border-2 border-dashed border-[#F5C242]/50 rounded-3xl p-8 text-center hover:border-[#F5C242] transition-all">
              {image ? (
                <img src={image} alt="Dog" className="max-h-80 mx-auto rounded-2xl shadow-lg" />
              ) : (
                <div className="py-16">
                  <span className="text-7xl block mb-4">📸</span>
                  <p className="text-lg">Choose File</p>
                </div>
              )}
            </label>
          </div>

          {/* Symptoms + Results */}
          <div className="bg-[#1F2A44] rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-semibold mb-4">2. Describe Symptoms</h3>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. painful joints, constipation, red eyes, fatigue..."
              className="w-full h-40 bg-[#0A1428] border border-[#F5C242]/30 rounded-2xl p-6 text-white resize-y focus:outline-none focus:border-[#F5C242]"
            />

            <button
              onClick={analyzeImage}
              disabled={loading}
              className="mt-6 bg-[#F5C242] hover:bg-[#F5C242]/90 disabled:opacity-50 text-black font-bold py-4 rounded-2xl text-xl transition"
            >
              {loading ? "Analyzing..." : "Get AI Recommendation"}
            </button>

            {/* Results */}
            {result && (
              <div className="mt-8 space-y-6">
                {result.primary && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-2xl p-6">
                    <h4 className="text-green-400 text-sm font-medium">PRIMARY RECOMMENDATION</h4>
                    <p className="text-3xl font-bold mt-2">{result.primary.protocol}</p>
                    <p className="text-green-400 mt-1">Confidence: {result.primary.confidence}</p>
                  </div>
                )}

                {result.secondary && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-2xl p-6">
                    <h4 className="text-blue-400 text-sm font-medium">SECONDARY CONSIDERATION</h4>
                    <p className="text-3xl font-bold mt-2">{result.secondary.protocol}</p>
                    <p className="text-blue-400 mt-1">Confidence: {result.secondary.confidence}</p>
                  </div>
                )}

                <button
                  onClick={resetAnalysis}
                  className="w-full border border-[#F5C242] hover:bg-[#F5C242]/10 text-[#F5C242] font-medium py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  🔄 Try Another Analysis
                </button>
              </div>
            )}

            {error && <p className="text-red-400 mt-6 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}