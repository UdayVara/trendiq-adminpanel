import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-primary to-primary/70 text-white border-transparent',

        secondary:
          'bg-gradient-to-r from-gray-700 to-gray-500 text-white border-transparent',

        destructive:
          'bg-gradient-to-r from-red-700 to-red-500 text-white border-transparent',

        outline:
          'bg-gradient-to-r from-muted to-muted/70 text-foreground border border-muted',

        success:
          'bg-gradient-to-r from-green-700 to-green-500 text-white border-transparent',

        warning:
          'bg-gradient-to-r from-yellow-600 to-yellow-400 text-black border-transparent',

        info:
          'bg-gradient-to-r from-blue-700 to-blue-500 text-white border-transparent',

        primary:
          'bg-gradient-to-r from-indigo-700 to-indigo-500 text-white border-transparent'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
);





export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
