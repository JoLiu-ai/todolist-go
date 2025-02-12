import type { FC } from 'react';
import classNames from 'classnames';
import type { InputProps } from './types';
import './styles.css';

export const Input: FC<InputProps> = ({
  className,
  label,
  error,
  prefix,
  suffix,
  block = false,
  ...rest
}) => {
  const wrapperClasses = classNames(
    'input-wrapper',
    {
      'input-wrapper--block': block,
    },
    className
  );

  const inputClasses = classNames(
    'input',
    {
      'input--error': error,
      'input--with-prefix': prefix,
      'input--with-suffix': suffix,
    }
  );

  return (
    <div className={wrapperClasses}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input className={inputClasses} {...rest} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="input-error-text">{error}</span>}
    </div>
  );
};

export default Input; 