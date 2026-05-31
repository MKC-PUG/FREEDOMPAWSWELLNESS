import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ADMIN_SESSION_COOKIE, isAdminConfigured, verifyAdminSessionToken } from '@/lib/admin-auth';

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminConfigured()) {
    return (
      <div className="min-h-screen bg-[#0A1428] text-white flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Admin not configured</h1>
          <p className="text-white/60 text-sm">
            Set <code className="text-[#F5C242]">ADMIN_PASSWORD</code> in{' '}
            <code className="text-[#F5C242]">.env.local</code> and restart the server.
          </p>
        </div>
      </div>
    );
  }

  const jar = await cookies();
  const session = jar.get(ADMIN_SESSION_COOKIE)?.value;

  if (!verifyAdminSessionToken(session)) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
