'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BackLink from '@/app/components/BackLink';
import { tokenShopItems } from '@/app/token-shop/shop-items';
import { fileToPetThumb } from '@/lib/mypets/photo-thumb';
import {
  createPetProfile,
  deletePetProfile,
  readPetProfiles,
  updatePetProfile,
} from '@/lib/mypets/storage';
import type { PetFormInput, PetProfile } from '@/lib/mypets/types';
import { readUnlockedProtocols } from '@/lib/shop/unlocks';
import { tokenShopHref } from '@/lib/site-urls';

const EMPTY_FORM: PetFormInput = {
  name: '',
  breed: '',
  age: '',
  notes: '',
  photoThumb: null,
};

export default function MyPetsClient() {
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PetFormInput>(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(() => {
    setPets(readPetProfiles());
    setUnlocked(readUnlockedProtocols());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (pet: PetProfile) => {
    setEditingId(pet.id);
    setForm({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      notes: pet.notes,
      photoThumb: pet.photoThumb,
    });
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handlePhotoPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const thumb = await fileToPetThumb(file);
      if (thumb) setForm((f) => ({ ...f, photoThumb: thumb }));
    } catch {
      setFormError('Could not load that photo — try another image.');
    }
  };

  const saveForm = () => {
    if (!form.name.trim()) {
      setFormError('Pet name is required.');
      return;
    }
    if (editingId) {
      updatePetProfile(editingId, form);
    } else {
      createPetProfile(form);
    }
    closeForm();
    refresh();
  };

  const removePet = (id: string) => {
    if (!window.confirm('Remove this pet profile from this device?')) return;
    deletePetProfile(id);
    refresh();
  };

  const unlockedItems = tokenShopItems.filter((item) => unlocked.includes(item.slug));

  return (
    <div className="min-h-screen bg-[#0A1428] text-white p-6 sm:p-8 pb-20">
      <div className="max-w-5xl mx-auto">
        <BackLink />
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl">🐾</span>
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold">My Pets</h1>
              <p className="text-[#F5C242] text-sm sm:text-lg mt-1">
                Your pet profiles, protocols &amp; wellness vault
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="bg-[#F5C242] hover:bg-white active:bg-amber-300 text-black font-bold px-6 py-3 min-h-[48px] rounded-2xl text-sm transition touch-manipulation"
          >
            + Add Pet
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            { href: '/diagnostics', label: 'ViT Scan', emoji: '📸' },
            { href: '/photobooth', label: 'Photo Booth', emoji: '✨' },
            { href: '/token-shop', label: 'Token Shop', emoji: '🪙' },
            { href: '/protocols', label: 'Protocols', emoji: '📋' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-[#1F2A44] px-3 py-4 text-center hover:border-[#F5C242]/40 transition-colors touch-manipulation"
            >
              <span className="text-2xl block">{link.emoji}</span>
              <span className="text-xs font-bold mt-1 block">{link.label}</span>
            </Link>
          ))}
        </div>

        {pets.length === 0 ? (
          <div className="bg-[#1F2A44] rounded-3xl p-10 sm:p-16 text-center border border-white/10">
            <div className="text-7xl mb-6">🐕</div>
            <h2 className="text-2xl sm:text-4xl font-bold mb-3">No pets added yet</h2>
            <p className="text-gray-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Add your first pet to track wellness notes, unlocked protocols, and photos — saved on
              this device.
            </p>
            <button
              type="button"
              onClick={openAdd}
              className="bg-[#F5C242] hover:bg-white text-black font-bold px-10 py-4 min-h-[52px] rounded-2xl text-lg transition touch-manipulation"
            >
              + Add New Pet
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="rounded-3xl border border-white/10 bg-[#1F2A44] p-5 flex gap-4"
              >
                <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-[#0A1428] flex items-center justify-center text-3xl">
                  {pet.photoThumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pet.photoThumb} alt={pet.name} className="w-full h-full object-cover" />
                  ) : (
                    '🐾'
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold truncate">{pet.name}</h2>
                  <p className="text-sm text-white/60 mt-0.5">
                    {[pet.breed, pet.age].filter(Boolean).join(' · ') || 'Profile started'}
                  </p>
                  {pet.notes && (
                    <p className="text-xs text-white/50 mt-2 line-clamp-2 leading-relaxed">{pet.notes}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      type="button"
                      onClick={() => openEdit(pet)}
                      className="text-xs font-bold text-amber-400 touch-manipulation"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removePet(pet.id)}
                      className="text-xs font-bold text-red-400/90 touch-manipulation"
                    >
                      Remove
                    </button>
                    <Link
                      href="/diagnostics"
                      className="text-xs font-bold text-white/70 touch-manipulation"
                    >
                      Run ViT →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-[#16223C] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#F5C242]">Protocols unlocked (this device)</h2>
          <p className="text-xs text-white/50 mt-1 mb-4">
            Purchases from Token Shop unlock lifetime access here and in the shop.
          </p>
          {unlockedItems.length === 0 ? (
            <p className="text-sm text-white/60">
              No protocols unlocked yet.{' '}
              <Link href="/token-shop" className="text-amber-400 font-bold">
                Visit Token Shop →
              </Link>
            </p>
          ) : (
            <ul className="space-y-2">
              {unlockedItems.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={tokenShopHref(item.slug)}
                    className="flex items-center justify-between rounded-xl border border-green-500/30 bg-green-950/20 px-4 py-3 text-sm touch-manipulation"
                  >
                    <span className="font-semibold text-green-300">✓ {item.cardTitle}</span>
                    <span className="text-xs text-white/45">View →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-3xl border border-dashed border-white/15 bg-[#0F1E38]/50 p-6">
          <h2 className="text-lg font-bold text-white/80">Dynamic NFT gallery</h2>
          <p className="text-sm text-white/50 mt-2 leading-relaxed">
            Your XRPL protocol tokens will appear here after wallet connect ships. Purchased access
            is already active on this device via Token Shop.
          </p>
          <Link
            href="/token-shop"
            className="inline-block mt-4 text-sm font-bold text-amber-400 touch-manipulation"
          >
            Token Shop →
          </Link>
        </section>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-black/70 touch-manipulation"
            onClick={closeForm}
          />
          <div className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#1F2A44] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-center">
              {editingId ? 'Edit pet' : 'Add pet'}
            </h3>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-xs font-bold text-white/60">Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm"
                  placeholder="Buddy"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-white/60">Breed</span>
                <input
                  value={form.breed}
                  onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm"
                  placeholder="Pug, mixed, cat…"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-white/60">Age</span>
                <input
                  value={form.age}
                  onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm"
                  placeholder="3 years, senior…"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-white/60">Wellness notes</span>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-[#0A1428] px-4 py-3 text-sm resize-none"
                  placeholder="Vet, supplements, sensitivities…"
                />
              </label>
              <div>
                <span className="text-xs font-bold text-white/60">Photo (optional)</span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#0A1428] flex items-center justify-center text-xl">
                    {form.photoThumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.photoThumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      '📷'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="text-xs font-bold text-amber-400 touch-manipulation"
                  >
                    Choose photo
                  </button>
                  {form.photoThumb && (
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, photoThumb: null }))}
                      className="text-xs text-white/45 touch-manipulation"
                    >
                      Remove
                    </button>
                  )}
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => void handlePhotoPick(e)}
                  />
                </div>
              </div>
              {formError && <p className="text-sm text-red-400">{formError}</p>}
              <button
                type="button"
                onClick={saveForm}
                className="w-full min-h-[48px] rounded-full bg-[#F5C242] text-black font-bold text-sm touch-manipulation"
              >
                {editingId ? 'Save changes' : 'Add pet'}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="w-full min-h-[44px] text-sm text-white/50 touch-manipulation"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
