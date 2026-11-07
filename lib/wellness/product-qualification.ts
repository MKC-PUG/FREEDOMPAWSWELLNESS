/** Member-facing product labels. Company tiers (Founding, Verified, Community) stay a separate deal. */

export type ProductQualification = 'listed' | 'verified';

export const MEMBER_PRODUCT_DISCLOSURE =
  'Freedom Paws may earn a commission if you use a partner link. The partner sells the product or provides the coverage or the consult. Freedom Paws does not. This is not veterinary treatment. Ask your own veterinarian about your dog.';

export const PRODUCT_QUALIFICATION_LABEL: Record<ProductQualification, string> = {
  listed: 'Listed',
  verified: 'Verified',
};

export const PRODUCT_QUALIFICATION_SUMMARY: Record<ProductQualification, string> = {
  listed:
    'The ingredient list is readable. This card says support only. A lab panel is requested. The source may still be unnamed.',
  verified:
    'Everything in Listed, plus a named source, a printed contaminant panel, and a manufacturing record. The brand page does not promise a cure, a longer life, or treatment of a disease.',
};

export function productQualification(value: ProductQualification | undefined): ProductQualification {
  return value === 'verified' ? 'verified' : 'listed';
}
