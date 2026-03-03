import type { RealWorldAsset } from "@/types/rwa";

/**
 * Sample RWA listings used for development / demo purposes.
 * Replace with live on-chain data via the DecentralChain API in production.
 */
export const MOCK_ASSETS: RealWorldAsset[] = [
  {
    assetId: "RWA_001_MIAMI_HOTEL",
    title: "Luxury Hotel Suite – Miami Beach",
    description:
      "Fractional ownership of a 5-star hotel suite on Collins Avenue, generating year-round rental yield.",
    physicalLocation: "Miami Beach, FL, USA",
    totalValuation: 2_500_000,
    fractionalTokenPrice: 25,
    totalFractions: 100_000,
    fractionsSold: 64_200,
    legalDocumentIpfsHash: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    currentYieldAPY: 8.4,
    category: "hospitality",
    imageUrl:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    issuerAddress: "3P_ISSUER_MIAMI_HOTEL",
    listedAt: "2025-11-15T10:00:00Z",
    isActive: true,
  },
  {
    assetId: "RWA_002_LONDON_OFFICE",
    title: "Grade-A Office Tower – Canary Wharf",
    description:
      "Prime commercial real estate in London's financial district. Long-term lease with blue-chip tenants.",
    physicalLocation: "London, United Kingdom",
    totalValuation: 12_000_000,
    fractionalTokenPrice: 120,
    totalFractions: 100_000,
    fractionsSold: 31_700,
    legalDocumentIpfsHash: "QmTzQ1JRkWErjk39mryYw286Lw2cVgzqFlwRsuKFAbBaaP",
    currentYieldAPY: 6.2,
    category: "real-estate",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    issuerAddress: "3P_ISSUER_LONDON_OFFICE",
    listedAt: "2025-12-01T08:30:00Z",
    isActive: true,
  },
  {
    assetId: "RWA_003_SOLAR_FARM",
    title: "Solar Farm – Nevada Desert",
    description:
      "50 MW photovoltaic installation selling power under a 20-year PPA. Eco-certified.",
    physicalLocation: "Clark County, NV, USA",
    totalValuation: 4_800_000,
    fractionalTokenPrice: 48,
    totalFractions: 100_000,
    fractionsSold: 82_500,
    legalDocumentIpfsHash: "QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLEoXEi12jYy",
    currentYieldAPY: 11.3,
    category: "infrastructure",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
    issuerAddress: "3P_ISSUER_SOLAR_FARM",
    listedAt: "2026-01-10T14:00:00Z",
    isActive: true,
  },
  {
    assetId: "RWA_004_VINEYARD",
    title: "Premium Vineyard – Napa Valley",
    description:
      "Award-winning winery with 120 acres under vine. Revenue from direct-to-consumer and wholesale channels.",
    physicalLocation: "Napa Valley, CA, USA",
    totalValuation: 7_200_000,
    fractionalTokenPrice: 72,
    totalFractions: 100_000,
    fractionsSold: 15_400,
    legalDocumentIpfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    currentYieldAPY: 5.8,
    category: "agriculture",
    imageUrl:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&q=80",
    issuerAddress: "3P_ISSUER_VINEYARD",
    listedAt: "2026-02-05T09:00:00Z",
    isActive: true,
  },
  {
    assetId: "RWA_005_ART_COLLECTION",
    title: "Blue-Chip Art Collection",
    description:
      "Curated portfolio of 12 contemporary artworks stored in a Geneva freeport. Appraised annually.",
    physicalLocation: "Geneva, Switzerland",
    totalValuation: 3_600_000,
    fractionalTokenPrice: 36,
    totalFractions: 100_000,
    fractionsSold: 47_800,
    legalDocumentIpfsHash: "QmUNLLsPACCz1vVBztTYR4t5n1fJZg6P6kGVVVB3TQRMjd",
    currentYieldAPY: 4.1,
    category: "art",
    imageUrl:
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    issuerAddress: "3P_ISSUER_ART",
    listedAt: "2026-02-20T12:00:00Z",
    isActive: true,
  },
];
