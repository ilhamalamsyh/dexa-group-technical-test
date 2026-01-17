export default function Badge({
  children,
  color = "primary",
  variant = "filled",
  className = "",
}) {
  const variants = {
    filled: {
      primary: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-cyan-100 text-cyan-800",
      default: "bg-gray-100 text-gray-800",
    },
    outlined: {
      primary: "border border-blue-600 text-blue-600",
      success: "border border-green-600 text-green-600",
      warning: "border border-yellow-600 text-yellow-600",
      error: "border border-red-600 text-red-600",
      info: "border border-cyan-600 text-cyan-600",
      default: "border border-gray-600 text-gray-600",
    },
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant][color]} ${className}`}
    >
      {children}
    </span>
  );
}
