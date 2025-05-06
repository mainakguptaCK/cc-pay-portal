import React from 'react';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizes = {
    sm: {
      switch: 'w-9 h-5',
      dot: 'h-3 w-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      dot: 'h-4 w-4',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      dot: 'h-5 w-5',
      translate: 'translate-x-7',
    },
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`
          relative inline-flex flex-shrink-0 
          ${sizes[size].switch} 
          rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${checked ? 'bg-blue-900' : 'bg-gray-200'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={`
            ${checked ? sizes[size].translate : 'translate-x-0'} 
            pointer-events-none relative inline-block 
            ${sizes[size].dot} 
            transform rounded-full bg-white shadow-lg 
            transition duration-200 ease-in-out
          `}
        />
      </button>
      {label && (
        <span className={`ml-3 ${disabled ? 'text-gray-400' : 'text-gray-900'} text-sm font-medium`}>
          {label}
        </span>
      )}
    </div>
  );
};

export default Switch;