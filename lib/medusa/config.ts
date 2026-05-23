export const DEFAULT_MEDUSA_COLLECTION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_MEDUSA_COLLECTION_ID ??
  "pcol_01KS92H03MXWZK6F8WWX19Y6P9";

export const DEFAULT_MEDUSA_REGION_ID =
  process.env.NEXT_PUBLIC_DEFAULT_MEDUSA_REGION_ID ??
  "reg_01KS3AAANYPSRKF8C5S7J2D4K9";

export function getMedusaStorefrontConfig() {
  return {
    baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL,
    publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    defaultCollectionId: DEFAULT_MEDUSA_COLLECTION_ID,
    defaultRegionId: DEFAULT_MEDUSA_REGION_ID,
  };
}
