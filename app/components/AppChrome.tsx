import { getAppSurface } from '@/lib/partner/surface';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerUser } from '@/lib/supabase/server';
import Navbar from './Navbar';
import PartnerNavbar from './PartnerNavbar';
import OpsNavbar from './OpsNavbar';
import VitProNavbar from './VitProNavbar';
import SiteFooter from './SiteFooter';
import PartnerFooter from './PartnerFooter';

export default async function AppChrome({ children }: { children: React.ReactNode }) {
  const surface = await getAppSurface();
  const partner = surface === 'partner';
  const ops = surface === 'ops';
  const vitpro = surface === 'vitpro';

  let partnerUserEmail: string | null = null;
  if (partner && isSupabaseConfigured()) {
    const user = await getServerUser();
    partnerUserEmail = user?.email ?? null;
  }

  return (
    <>
      {vitpro ? (
        <VitProNavbar />
      ) : ops ? (
        <OpsNavbar />
      ) : partner ? (
        <PartnerNavbar userEmail={partnerUserEmail} />
      ) : (
        <Navbar />
      )}
      {children}
      {ops || vitpro ? null : partner ? <PartnerFooter /> : <SiteFooter />}
    </>
  );
}
