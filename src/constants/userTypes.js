/**
 * User type constants
 */

export const USER_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  VIP: 'vip'
};

export const USER_BADGES = {
  [USER_TYPES.PREMIUM]: '💎',
  [USER_TYPES.VIP]: '👑'
};

export const USER_LABELS = {
  [USER_TYPES.FREE]: 'Free',
  [USER_TYPES.PREMIUM]: 'Premium',
  [USER_TYPES.VIP]: 'VIP'
};

// Post expiry times (in milliseconds)
export const POST_EXPIRY_TIMES = {
  [USER_TYPES.FREE]: 24 * 60 * 60 * 1000,      // 24 hours
  [USER_TYPES.PREMIUM]: 4 * 24 * 60 * 60 * 1000, // 4 days
  [USER_TYPES.VIP]: 7 * 24 * 60 * 60 * 1000     // 7 days
};
