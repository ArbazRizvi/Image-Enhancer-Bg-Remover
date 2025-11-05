
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  iconClass: string;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  children,
  iconClass,
  className = 'bg-blue-600 hover:bg-blue-700'
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-3 rounded-lg font-semibold text-white transition-all duration-300 ease-in-out flex items-center justify-center gap-2
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
      `}
    >
      <i className={iconClass}></i>
      {children}
    </button>
  );
};
