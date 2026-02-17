const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-bold rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border-2 border-blue-600',
    secondary: 'bg-dark-200 text-dark-900 hover:bg-dark-300 focus:ring-dark-500',
    success: 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800 border-2 border-green-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 border-2 border-red-600',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 active:bg-black border-2 border-gray-800',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800 border-2 border-orange-600',
    outline: 'bg-white text-blue-700 border-2 border-blue-600 hover:bg-blue-50 active:bg-blue-100',
    ghost: 'text-primary hover:bg-primary-50 focus:ring-primary-500 shadow-none',
  };
  
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
