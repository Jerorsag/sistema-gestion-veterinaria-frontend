import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Slot } from '@radix-ui/react-slot'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode
  endIcon?: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
  asChild?: boolean
}

export const Button = ({
  children,
  className,
  startIcon,
  endIcon,
  variant = 'primary',
  fullWidth,
  asChild,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-gray-950 hover:bg-primary/90 focus-visible:outline-primary',
    secondary: 'bg-surface-200 text-white border border-white/10 hover:border-white/30 focus-visible:outline-white',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-white',
  }

  const Component = asChild ? Slot : 'button'
  const componentProps = asChild ? props : { type: props.type ?? 'button', ...props }

  return (
    <Component className={clsx(baseStyles, variants[variant], fullWidth && 'w-full', className)} {...componentProps}>
      {startIcon && <span className="text-base">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="text-base">{endIcon}</span>}
    </Component>
  )
}

