import type { FC } from 'react';
import classNames from 'classnames';
import type { ButtonProps } from './types';
import './styles.css';

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'medium',
  loading = false,
  block = false,
  icon,
  disabled,
  ...rest
}) => {
  const classes = classNames(
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--loading': loading,
      'button--block': block,
    },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && <span className="button__spinner" />}
      {icon && <span className="button__icon">{icon}</span>}
      {children}
    </button>
  );
};

export default Button; 