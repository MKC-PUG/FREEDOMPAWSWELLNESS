const DEFAULT_PARTNER_HOST = 'shelter.freedompawsinc.com';

/** Hostnames that render the partner shell (no consumer shop/wellness nav). */
export function partnerHostnames(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_PARTNER_HOST?.trim();
  const hosts = [DEFAULT_PARTNER_HOST, 'shelter.localhost'];
  if (fromEnv) hosts.push(fromEnv.replace(/^https?:\/\//, '').replace(/\/$/, ''));
  return hosts;
}

export function normalizeHostname(host: string): string {
  return host.split(':')[0]?.toLowerCase() ?? '';
}

export function isPartnerHostname(host: string | null | undefined): boolean {
  if (!host) return false;
  const h = normalizeHostname(host);
  return partnerHostnames().some((p) => normalizeHostname(p) === h);
}
