import { getAppSurface } from '@/lib/partner/surface';
import Navbar from './Navbar';
import PartnerNavbar from './PartnerNavbar';
import SiteFooter from './SiteFooter';
import PartnerFooter from './PartnerFooter';

export default async function AppChrome({ children }: { children: React.ReactNode }) {
  const surface = await getAppSurface();
  const partner = surface === 'partner';

  return (
    <>
      {partner ? <PartnerNavbar /> : <Navbar />}
      {children}
      {partner ? <PartnerFooter /> : <SiteFooter />}
    </>
  );
}
