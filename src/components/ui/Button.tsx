import { Children, cloneElement, isValidElement } from 'react'
import type { ButtonHTMLAttributes, ReactNode, ReactElement } from 'react'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

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
  const { type, ...restProps } = props
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60'

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-gray-950 hover:bg-primary/90 focus-visible:outline-primary',
    secondary: 'bg-surface-200 text-white border border-white/10 hover:border-white/30 focus-visible:outline-white',
    ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/5 focus-visible:outline-white',
    danger: 'bg-red-500 text-white hover:bg-red-600 focus-visible:outline-red-500',
  }

  const content = (
    <>
      {startIcon && <span className="text-base">{startIcon}</span>}
      <span>{children}</span>
      {endIcon && <span className="text-base">{endIcon}</span>}
    </>
  )

  if (asChild) {
    const onlyChild = Children.only(children) as ReactElement | null
    if (!onlyChild || !isValidElement(onlyChild)) {
      throw new Error('Button with asChild expects a single React element as its child.')
    }

    const child = onlyChild as ReactElement<{ className?: string; children?: ReactNode }>

    return cloneElement(child, {
      ...(restProps as Record<string, unknown>),
      className: clsx(baseStyles, variants[variant], fullWidth && 'w-full', child.props.className, className),
      children: (
        <>
          {startIcon && <span className="text-base">{startIcon}</span>}
          <span>{child.props.children ?? null}</span>
          {endIcon && <span className="text-base">{endIcon}</span>}
        </>
      ),
    })
  }

  return (
    <button
      type={type ?? 'button'}
      className={clsx(baseStyles, variants[variant], fullWidth && 'w-full', className)}
      {...restProps}
    >
      {content}
    </button>
  )
}

