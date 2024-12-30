import React, { Fragment, type ReactNode } from 'react';
import Link from 'next/link';

interface IProps extends Omit<React.HTMLProps<HTMLButtonElement>, 'size'> {
  title?: string;
  isLoading?: boolean;
  href?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
  variant?: 'outline' | 'contained' | 'text';
  size?: 'sm' | 'lg';
  color?: 'orange';
  children?: ReactNode;
  borderRadius?: 'lg' | 'xxl';
}

export function Button(props: IProps) {
  const {
    title,
    className,
    isLoading,
    href,
    onClick,
    variant = 'contained',
    size = 'lg',
    children,
    color,
    borderRadius,
    ...restProps
  } = props;

  const fullClassName = `app_ui_button ${className} br-${borderRadius || ''}`;

  if (href) {
    return (
      <Link className={`${fullClassName} btn-success  ${variant} ${size} ${color}`} href={href}>
        {title || children}
      </Link>
    );
  }

  const spinner = (
    <div
      className="inline-block h-6 w-6 animate-spin rounded-full border-[3px] border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  if (isLoading) {
    return (
      <button
        disabled={isLoading}
        type="submit"
        className={`${fullClassName} btn-success w-full ${variant} ${size} ${color}`}
        {...restProps}
      >
        {spinner}
      </button>
    );
  }

  return (
    <Fragment>
      <button
        type={onClick ? 'button' : 'submit'}
        onClick={onClick}
        className={`${fullClassName} btn-success w-full ${variant} ${size} ${color}`}
        {...restProps}
      >
        {title || children}
      </button>

      <span />
    </Fragment>
  );
}
