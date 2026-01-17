export default function Alert({
  children,
  severity = "info",
  onClose,
  className = "",
}) {
  const severities = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${severities[severity]} ${className}`}
    >
      <span className="text-xl font-bold">{icons[severity]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button onClick={onClose} className="text-current hover:opacity-70">
          ✕
        </button>
      )}
    </div>
  );
}
