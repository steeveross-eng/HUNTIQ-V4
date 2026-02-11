/**
 * BionicCard - BIONIC TACTICAL Design System
 * HUD-style glassmorphism card component
 */

import React from 'react';
import { cn } from '@/lib/utils';

const cardVariants = {
  // Default - Glassmorphism
  default: cn(
    'bg-black/60 backdrop-blur-xl',
    'border border-white/10',
    'shadow-2xl'
  ),
  
  // Solid - No transparency
  solid: cn(
    'bg-[#121212]',
    'border border-[#262626]',
    'shadow-lg'
  ),
  
  // Outlined - More prominent border
  outlined: cn(
    'bg-black/40 backdrop-blur-md',
    'border-2 border-white/20'
  ),
  
  // Highlighted - Gold accent
  highlighted: cn(
    'bg-black/60 backdrop-blur-xl',
    'border border-[#F5A623]/30',
    'shadow-[0_0_20px_rgba(245,166,35,0.1)]'
  ),
  
  // Interactive - Hover effects
  interactive: cn(
    'bg-black/60 backdrop-blur-xl',
    'border border-white/10',
    'shadow-2xl',
    'hover:border-[#F5A623]/30 hover:shadow-[0_0_20px_rgba(245,166,35,0.1)]',
    'transition-all duration-300 cursor-pointer'
  ),
};

export const BionicCard = React.forwardRef(({
  children,
  variant = 'default',
  className,
  noPadding = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-md',
        cardVariants[variant],
        !noPadding && 'p-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

BionicCard.displayName = 'BionicCard';

export const BionicCardHeader = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-b border-white/10 pb-3 mb-4',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

BionicCardHeader.displayName = 'BionicCardHeader';

export const BionicCardTitle = React.forwardRef(({
  children,
  className,
  as: Component = 'h3',
  ...props
}, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        'text-white font-semibold uppercase tracking-wide text-sm',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});

BionicCardTitle.displayName = 'BionicCardTitle';

export const BionicCardContent = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('text-gray-300', className)}
      {...props}
    >
      {children}
    </div>
  );
});

BionicCardContent.displayName = 'BionicCardContent';

export const BionicCardFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'border-t border-white/10 pt-3 mt-4',
        'flex items-center justify-end gap-2',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

BionicCardFooter.displayName = 'BionicCardFooter';

export default BionicCard;
