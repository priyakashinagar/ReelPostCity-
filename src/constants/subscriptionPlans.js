/**
 * Subscription plans and pricing
 */

export const SUBSCRIPTION_PLANS = {
  PREMIUM: {
    name: 'Premium',
    price: 99,
    duration: 'month',
    benefits: [
      'Longer post visibility (4 days)',
      'No ads',
      'Priority support',
      'Custom themes'
    ],
    color: 'from-blue-500 to-blue-700'
  },
  VIP: {
    name: 'VIP',
    price: 199,
    duration: 'month',
    benefits: [
      'Maximum post visibility (7 days)',
      'No ads',
      'Priority support',
      'Custom themes',
      'Featured posts',
      'Analytics dashboard'
    ],
    color: 'from-purple-500 to-pink-700'
  }
};

export const FREE_PLAN = {
  name: 'Free',
  price: 0,
  duration: 'forever',
  benefits: [
    'Post visibility (24 hours)',
    'Limited ad visibility',
    'Community support'
  ],
  color: 'from-gray-400 to-gray-600'
};
