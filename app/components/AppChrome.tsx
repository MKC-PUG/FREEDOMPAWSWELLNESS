import { getAppSurface } from '@/lib/partner/surface';
import Navbar from './Navbar';
import PartnerNavbar from './PartnerNavbar';
import OpsNavbar from './OpsNavbar';
import SiteFooter from './SiteFooter';
import PartnerFooter from './PartnerFooter';

export default async function AppChrome({ children }: { children: React.ReactNode }) {
  const surface = await getAppSurface();
  const partner = surface === 'partner';
  const ops = surface === 'ops';

  return (
    <>
      {ops ? <OpsNavbar /> : partner ? <PartnerNavbar /> : <Navbar />}
      {children}
      {ops ? null : partner ? <PartnerFooter /> : <SiteFooter />}
    </>
  );
}
