'use client';

import BackLink from '@/app/components/BackLink';

export default function MyPetsPage() {
  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <BackLink />
        <div className="flex items-center gap-4 mb-8">
          <span className="text-5xl">🐾</span>
          <h1 className="text-5xl font-bold">My Pets</h1>
        </div>
        
        <p className="text-[#F5C242] text-xl mb-12">Manage your dogs, wellness records, and tokenized Dynamic NFTs</p>

        <div className="bg-[#1F2A44] rounded-3xl p-16 text-center">
          <div className="text-8xl mb-8">🐕</div>
          <h2 className="text-4xl font-bold mb-4">No Pets Added Yet</h2>
          <p className="text-gray-400 max-w-md mx-auto mb-10">
            Add your first dog to start tracking wellness protocols, upload records, and mint Dynamic NFTs on XRPL.
          </p>
          <button
            type="button"
            className="bg-[#F5C242] hover:bg-white active:bg-amber-300 text-black font-bold px-10 py-4 min-h-[52px] rounded-2xl text-lg transition touch-manipulation"
          >
            + Add New Pet
          </button>
        </div>

        <p className="text-center text-gray-500 mt-16 text-sm">
          This page will be expanded with full pet profiles, health history, NFT gallery, and protocol tracking.
        </p>
      </div>
    </div>
  );
}