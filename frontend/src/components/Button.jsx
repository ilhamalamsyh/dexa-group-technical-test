export default function Button({
  children,
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  disabled = false,
  type = "button",
  onClick,
  className = "",
}) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    contained: {
      primary:
        "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-md hover:shadow-lg disabled:bg-gray-300",
      secondary:
        "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md hover:shadow-lg disabled:bg-gray-300",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-md hover:shadow-lg disabled:bg-gray-300",
      error:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg disabled:bg-gray-300",
    },
    outlined: {
      primary:
        "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-gray-300 disabled:text-gray-300",
      secondary:
        "border-2 border-purple-600 text-purple-600 hover:bg-purple-50 focus:ring-purple-500 disabled:border-gray-300 disabled:text-gray-300",
      success:
        "border-2 border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:border-gray-300 disabled:text-gray-300",
      error:
        "border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 disabled:border-gray-300 disabled:text-gray-300",
    },
    text: {
      primary:
        "text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:text-gray-300",
      secondary:
        "text-purple-600 hover:bg-purple-50 focus:ring-purple-500 disabled:text-gray-300",
      success:
        "text-green-600 hover:bg-green-50 focus:ring-green-500 disabled:text-gray-300",
      error:
        "text-red-600 hover:bg-red-50 focus:ring-red-500 disabled:text-gray-300",
    },
  };

  const sizes = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled
    ? "cursor-not-allowed opacity-60"
    : "cursor-pointer";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant][color]} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  );
}
