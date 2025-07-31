interface ProfileInputProps {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileInput({ label, value, onChange }: ProfileInputProps) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <input
        type="text"
        value={value || ""}
        onChange={onChange}
        className="text-base font-medium text-foreground w-full bg-transparent border-b border-border focus:outline-none focus:border-primary"
      />
    </div>
  );
}