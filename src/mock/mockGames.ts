import type { Game } from '../types';

export const mockGames: Game[] = [
  {
    id: 'game-001',
    name: 'Call of Duty Mobile',
    shortName: 'CODM',
    image: '/games/COD.png',
    redemptionInstructions:
      '1. Open CODM and tap your profile icon.\n2. Go to Settings > Account > Redeem Code.\n3. Enter the code provided in your order confirmation.\n4. Tap "Confirm" to receive your CP instantly.',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    bundles: [
      { id: 'b-001', name: '80 CP', sellingPrice: 500, costPrice: 380 },
      { id: 'b-002', name: '400 CP', sellingPrice: 2200, costPrice: 1700 },
      { id: 'b-003', name: '880 CP', sellingPrice: 4500, costPrice: 3500 },
      { id: 'b-004', name: '2000 CP', sellingPrice: 9500, costPrice: 7500 },
      { id: 'b-005', name: '5000 CP', sellingPrice: 22000, costPrice: 17500 },
    ],
  },
  {
    id: 'game-002',
    name: 'Free Fire',
    shortName: 'FF',
    image: '/games/FreeFire.png',
    redemptionInstructions:
      '1. Open Free Fire and tap your profile icon.\n2. Go to "Top Up" section.\n3. Enter your Player ID and select the diamond package.\n4. Complete the payment using Paystack.\n5. Diamonds will be credited within 5 minutes.',
    status: 'active',
    createdAt: '2024-01-20T09:00:00Z',
    bundles: [
      { id: 'b-006', name: '100 Diamonds', sellingPrice: 600, costPrice: 450 },
      { id: 'b-007', name: '310 Diamonds', sellingPrice: 1800, costPrice: 1350 },
      { id: 'b-008', name: '520 Diamonds', sellingPrice: 3000, costPrice: 2300 },
      { id: 'b-009', name: '1060 Diamonds', sellingPrice: 6000, costPrice: 4600 },
      { id: 'b-010', name: '2180 Diamonds', sellingPrice: 11500, costPrice: 8800 },
    ],
  },
  {
    id: 'game-003',
    name: 'PUBG Mobile',
    shortName: 'PUBG',
    image: '/games/PUBG.png',
    redemptionInstructions:
      '1. Open PUBG Mobile and navigate to "UC" shop.\n2. Tap "Recharge".\n3. Select the UC package and proceed.\n4. Enter your Player ID when prompted.\n5. Complete payment — UC is credited instantly.',
    status: 'active',
    createdAt: '2024-02-01T11:00:00Z',
    bundles: [
      { id: 'b-011', name: '60 UC', sellingPrice: 450, costPrice: 340 },
      { id: 'b-012', name: '325 UC', sellingPrice: 2200, costPrice: 1700 },
      { id: 'b-013', name: '660 UC', sellingPrice: 4200, costPrice: 3200 },
      { id: 'b-014', name: '1800 UC', sellingPrice: 11000, costPrice: 8500 },
      { id: 'b-015', name: '3850 UC', sellingPrice: 22000, costPrice: 17000 },
    ],
  },
  {
    id: 'game-004',
    name: 'Mobile Legends',
    shortName: 'MLBB',
    image: '/games/MobileLegends.png',
    redemptionInstructions:
      '1. Open Mobile Legends: Bang Bang.\n2. Tap your avatar in the top-left corner.\n3. Go to "Diamonds" and tap "Buy Now".\n4. Enter your Player ID and Zone ID.\n5. Select the diamond pack and pay with Paystack.',
    status: 'active',
    createdAt: '2024-02-10T14:00:00Z',
    bundles: [
      { id: 'b-016', name: '86 Diamonds', sellingPrice: 600, costPrice: 450 },
      { id: 'b-017', name: '172 Diamonds', sellingPrice: 1150, costPrice: 880 },
      { id: 'b-018', name: '430 Diamonds', sellingPrice: 2800, costPrice: 2150 },
      { id: 'b-019', name: '1000 Diamonds', sellingPrice: 6500, costPrice: 5000 },
      { id: 'b-020', name: '2150 Diamonds', sellingPrice: 13000, costPrice: 10000 },
    ],
  },
  {
    id: 'game-005',
    name: 'Clash of Clans',
    shortName: 'COC',
    image: '/games/ClashOfClans.png',
    redemptionInstructions:
      '1. Open Clash of Clans.\n2. Tap the Gem icon in the top right.\n3. Select "Get More Gems".\n4. Enter your Player Tag when prompted.\n5. Payment via Paystack — gems added within 10 minutes.',
    status: 'inactive',
    createdAt: '2024-03-05T08:00:00Z',
    bundles: [
      { id: 'b-021', name: '80 Gems', sellingPrice: 700, costPrice: 530 },
      { id: 'b-022', name: '500 Gems', sellingPrice: 4000, costPrice: 3100 },
      { id: 'b-023', name: '1200 Gems', sellingPrice: 9000, costPrice: 7000 },
      { id: 'b-024', name: '2500 Gems', sellingPrice: 18000, costPrice: 14000 },
    ],
  },
  {
    id: 'game-006',
    name: 'Genshin Impact',
    shortName: 'GI',
    image: '/games/GenshinImpact.png',
    redemptionInstructions:
      '1. Log in to the Genshin Impact top-up center.\n2. Enter your UID and select server.\n3. Choose your Genesis Crystal pack.\n4. Complete payment — crystals credited within 1 hour.',
    status: 'active',
    createdAt: '2024-03-20T12:00:00Z',
    bundles: [
      { id: 'b-025', name: '60 Genesis Crystals', sellingPrice: 700, costPrice: 530 },
      { id: 'b-026', name: '300 Genesis Crystals', sellingPrice: 3300, costPrice: 2550 },
      { id: 'b-027', name: '980 Genesis Crystals', sellingPrice: 10500, costPrice: 8100 },
      { id: 'b-028', name: '1980 Genesis Crystals', sellingPrice: 20000, costPrice: 15500 },
    ],
  },
];
