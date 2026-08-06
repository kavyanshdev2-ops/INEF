import React from 'react';
import { motion } from 'motion/react';
import { premiumEase } from '../../lib/motion';

type GlassButtonVariant = 'primary' | 'secondary' | 'ghost';
type GlassButtonSize = 'sm' | 'md';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: GlassButtonVariant;
  size?: GlassButtonSize;
};

export function GlassButton({
  className = '',
  variant = 'secondary',
  size = 'md',
  type = 'button',
  disabled,
  ...props
}: Props) {
  const sizeClasses =
    size === 'sm'
      ? 'px-5 py-2.5 text-[10px]'
      : 'px-7 py-3.5 text-[11px]';

  const variantClasses =
    variant === 'primary'
      ? 'text-zinc-950 border-white/65 bg-white/55 shadow-[0_18px_45px_rgba(0,0,0,0.16)]'
      : variant === 'ghost'
        ? 'text-zinc-900 border-black/10 bg-white/0 hover:bg-white/30'
        : 'text-zinc-900 border-black/10 bg-white/45 shadow-[0_16px_40px_rgba(0,0,0,0.10)]';

  return (
    <motion.button
      type={type}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.55, ease: premiumEase }}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-full border backdrop-blur-2xl overflow-hidden select-none font-mono uppercase tracking-[0.26em] transition-colors duration-500 motion-reduce:transform-none motion-reduce:transition-none ${sizeClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
          variant === 'primary'
            ? 'bg-[radial-gradient(120px_circle_at_30%_20%,rgba(215,180,106,0.55),transparent_60%),radial-gradient(220px_circle_at_70%_80%,rgba(255,255,255,0.55),transparent_65%)]'
            : 'bg-[radial-gradient(140px_circle_at_30%_20%,rgba(215,180,106,0.18),transparent_60%),radial-gradient(220px_circle_at_70%_80%,rgba(255,255,255,0.45),transparent_65%)]'
        }`}
      />
      <span
        aria-hidden="true"
        className={`absolute -left-[60%] top-0 h-full w-[70%] -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-900 ${
          variant === 'primary'
            ? 'bg-gradient-to-r from-transparent via-white/75 to-transparent'
            : 'bg-gradient-to-r from-transparent via-white/55 to-transparent'
        }`}
      />
      <span className="relative z-10">{props.children}</span>
    </motion.button>
  );
}

