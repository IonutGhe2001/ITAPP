import clsx from "clsx";

interface AvatarProps {
  src?: string | null;
  name: string;
  className?: string;
}

export default function Avatar({ src, name, className }: AvatarProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        className={clsx("rounded-full object-cover", className)}
      />
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-full bg-primary text-primary-foreground",
        className
      )}
    >
      <span className="font-semibold">{initials}</span>
    </div>
  );
}