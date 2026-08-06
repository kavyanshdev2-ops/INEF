export const premiumEase = [0.16, 1, 0.3, 1] as const;

export const premiumTransition = {
  duration: 0.6,
  ease: premiumEase
} as const;

export const premiumSpring = {
  type: 'spring',
  stiffness: 260,
  damping: 26
} as const;

