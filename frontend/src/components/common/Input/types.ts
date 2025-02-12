import type { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  block?: boolean;
  className?: string;
} 