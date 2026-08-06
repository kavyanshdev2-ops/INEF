import React from 'react';
import { motion } from 'motion/react';
import { premiumEase } from '../../lib/motion';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
};

export function GlassIconButton({ className = '', active, disabled, ...props }: Props) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1, scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.55, ease: premiumEase }}
      className={`group relative inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur-2xl overflow-hidden transition-colors duration-500 motion-reduce:transform-none motion-reduce:transition-none ${
        active
          ? 'bg-white/60 border-white/70 text-zinc-950 shadow-[0_14px_38px_rgba(0,0,0,0.14)]'
          : 'bg-white/40 border-black/10 text-zinc-700 hover:text-zinc-950 hover:bg-white/55 shadow-[0_14px_38px_rgba(0,0,0,0.10)]'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[60%] top-0 h-full w-[70%] -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:translate-x-[220%] transition-all duration-900 bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
      <span className="relative z-10">{props.children}</span>
    </motion.button>
  );
}

