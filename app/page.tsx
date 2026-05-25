'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white overflow-hidden relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/tn-lake-bg.jpg"
          alt="Tennessee Lake"
          fill
          className="object-cover opacity-40"
          priority
          quality={90}
          sizes="100vw"
        />
      </div>

      <div className="relative z-10">
        <nav className="bg-black/80 backdrop-blur-md border-b border-[#F5C242]/30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="https://framerusercontent.com/images/BZRD2eHCJvHq4La2GWisAfN3zM.jpg"
                alt="SuperBud"
                width={60}
                height={60}
                className="rounded-full border-2 border-[#F5C242]"
              />
              <div>
                <h1 className="text-2xl font-bold">Freedom Paws Wellness</h1>
                <p className="text-[#F5C242] text-sm -mt-1">Honor Buddy’s Legacy</p>
              </div>
            </div>
            <div className="flex gap-8 text-lg font-medium">
              <Link href="/" className="hover:text-[#F5C242]">Home</Link>
              <Link href="/diagnostics" className="hover:text-[#F5C242]">ViT Diagnostics</Link>
              <Link href="/mypets" className="hover:text-[#F5C242]">My Pets</Link>
              <Link href="/protocols" className="hover:text-[#F5C242]">Protocol Overview</Link>
            </div>
            <button
              type="button"
              className="bg-[#F5C242] hover:bg-white text-black px-6 py-3 rounded-2xl font-bold"
            >
              Connect Wallet
            </button>
          </div>
        </nav>

        <div className="h-[85vh] flex items-center justify-center text-center px-6">
          <div className="max-w-5xl mx-auto">
            <Image
              src="https://framerusercontent.com/images/BZRD2eHCJvHq4La2GWisAfN3zM.jpg"
              alt="SuperBud"
              width={280}
              height={280}
              className="mx-auto mb-8 rounded-full border-8 border-[#F5C242] shadow-2xl"
              priority
            />
            <h2 className="text-6xl md:text-7xl font-bold mb-6">
              Welcome To<br />Freedom Paws Wellness
            </h2>
            <p className="text-2xl text-[#F5C242] mb-12">
              Tokenized Holistic Wellness on XRPL • Inspired by Buddy’s Miracle
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/diagnostics" className="group">
            <div className="bg-[#1F2A44] p-8 rounded-3xl border border-[#F5C242]/30 hover:border-[#F5C242] h-full transition-all hover:scale-105">
              <div className="text-5xl mb-6">📸</div>
              <h3 className="text-2xl font-bold mb-3">ViT Diagnostics</h3>
              <p className="text-gray-300">AI photo + symptom analysis</p>
            </div>
          </Link>

          <Link href="/mypets" className="group">
            <div className="bg-[#1F2A44] p-8 rounded-3xl border border-[#F5C242]/30 hover:border-[#F5C242] h-full transition-all hover:scale-105">
              <div className="text-5xl mb-6">🐾</div>
              <h3 className="text-2xl font-bold mb-3">My Pets</h3>
              <p className="text-gray-300">Manage dogs & records</p>
            </div>
          </Link>

          <Link href="/protocols" className="group">
            <div className="bg-[#1F2A44] p-8 rounded-3xl border border-[#F5C242]/30 hover:border-[#F5C242] h-full transition-all hover:scale-105">
              <div className="text-5xl mb-6">🛡️</div>
              <h3 className="text-2xl font-bold mb-3">Protocol Overview</h3>
              <p className="text-gray-300">10 tokenized wellness protocols</p>
            </div>
          </Link>

          <div className="bg-[#1F2A44]/70 p-8 rounded-3xl border border-[#F5C242]/20 h-full opacity-75 cursor-not-allowed">
            <div className="text-5xl mb-6">📡</div>
            <h3 className="text-2xl font-bold mb-3">Monitor My Dog</h3>
            <p className="text-gray-400">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}
