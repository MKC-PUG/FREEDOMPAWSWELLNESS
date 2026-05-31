import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteUpload } from '@/lib/upload-store';

export async function POST() {
  const jar = await cookies();
  const id = jar.get('fp-upload-id')?.value;

  if (id) {
    await deleteUpload(id);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('fp-upload-id', '', { path: '/', maxAge: 0 });
  response.cookies.set('fp-upload-key', '', { path: '/', maxAge: 0 });
  return response;
}
