export default function Card({ children, className = "", elevation = 2 }) {
  const elevations = {
    0: "",
    1: "shadow-sm",
    2: "shadow-md",
    3: "shadow-lg",
    4: "shadow-xl",
    5: "shadow-2xl",
  };

  return (
    <div
      className={`bg-white rounded-lg ${elevations[elevation]} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardActions({ children, className = "" }) {
  return (
    <div
      className={`px-6 py-4 border-t border-gray-200 flex gap-2 justify-end ${className}`}
    >
      {children}
    </div>
  );
}
