/** CRM defaults per AI Marketing Automation Master Plan §4 */

const CRM_COLUMNS = [
  'Fit_Score',
  'Status',
  'Approved',
  'Sequence_Stage',
  'Last_Contact',
  'Next_Action',
  'Compartment',
  'Primary_Inbox',
  'UTM_Campaign',
  'AI_Draft_Link',
];

export { CRM_COLUMNS };

export function compartmentForCategory(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('adoption network')) return 'Adoption';
  if (c.includes('shelter') || c.includes('rescue')) return 'Shelter';
  if (c.includes('insurance')) return 'Insurance';
  if (c.includes('veteran')) return 'Veteran';
  if (c.includes('nutrition') || c.includes('whole food')) return 'Affiliate';
  if (c.includes('chew') || c.includes('toy')) return 'Affiliate';
  if (c.includes('telehealth')) return 'Telehealth';
  if (c.includes('media') || c.includes('influencer')) return 'Press';
  if (c.includes('grant') || c.includes('foundation')) return 'Grants';
  if (c.includes('retail')) return 'Retail';
  if (c.includes('internal') || c.includes('freedom paws')) return 'Internal';
  return 'General';
}

export function inboxForCategory(category) {
  const c = (category || '').toLowerCase();
  if (c.includes('adoption network') || c.includes('shelter') || c.includes('rescue')) {
    return 'shelter@freedompawsinc.com';
  }
  if (
    c.includes('insurance') ||
    c.includes('nutrition') ||
    c.includes('chew') ||
    c.includes('toy') ||
    c.includes('veteran') ||
    c.includes('telehealth')
  ) {
    return 'partners@freedompawsinc.com';
  }
  return 'info@freedompawsinc.com';
}

export function utmForCategory(category) {
  return compartmentForCategory(category)
    .toLowerCase()
    .replace(/\s+/g, '_');
}

export function defaultCrmRow(row) {
  const category = row.Category || '';
  const priority = row.Priority || '';
  const org = row.Organization || '';
  const isTnLivePilot =
    category === 'Adoption Network TN Pilot' &&
    /\(LIVE\)/i.test(org) &&
    Number(row.Rank) >= 1 &&
    Number(row.Rank) <= 6;

  return {
    Fit_Score: isTnLivePilot ? '5' : '',
    Status: 'New',
    Approved: '',
    Sequence_Stage: '0',
    Last_Contact: '',
    Next_Action: isTnLivePilot
      ? 'Phase 0: review outbox draft — do not send until Approved=YES + activation'
      : '',
    Compartment: compartmentForCategory(category),
    Primary_Inbox: inboxForCategory(category),
    UTM_Campaign: utmForCategory(category),
    AI_Draft_Link: '',
  };
}
