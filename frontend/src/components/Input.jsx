export default function Input({
  label,
  error,
  helperText,
  fullWidth = false,
  className = "",
  ...props
}) {
  const widthClass = fullWidth ? "w-full" : "";
  const errorClass = error
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-blue-500";

  return (
    <div className={`${widthClass} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`block w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 ${errorClass} disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...props}
      />
      {(error || helperText) && (
        <p
          className={`mt-1 text-sm ${error ? "text-red-600" : "text-gray-500"}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
