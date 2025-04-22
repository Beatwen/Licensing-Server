export const mockLicenses = [
  {
    id: "1",
    key: "RF-GO-PRO-2024",
    status: "active",
    type: "pro",
    activatedAt: "2024-01-15T10:00:00Z",
    expiresAt: "2025-01-15T10:00:00Z"
  },
  {
    id: "2",
    key: "RF-GO-BASIC-2024",
    status: "inactive",
    type: "basic",
    activatedAt: null,
    expiresAt: null
  },
  {
    id: "3",
    key: "RF-GO-TRIAL-2023",
    status: "expired",
    type: "trial",
    activatedAt: "2023-06-01T10:00:00Z",
    expiresAt: "2023-12-31T23:59:59Z"
  }
];

export const mockUser = {
  id: "user-1",
  email: "demo@rf-go.com",
  name: "Demo User",
  createdAt: "2024-01-01T00:00:00Z"
};

export const mockPricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    description: 'Perfect for small events',
    features: [
      'Up to 10 devices',
      'Basic frequency coordination',
      'Email support'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 299,
    description: 'For professional sound engineers',
    features: [
      'Unlimited devices',
      'Advanced frequency coordination',
      'Priority support',
      'Custom frequency ranges',
      'Offline mode'
    ]
  }
];