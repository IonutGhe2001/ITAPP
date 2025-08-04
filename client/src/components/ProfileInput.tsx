interface ProfileInputProps {
  label: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileInput({ label, value, onChange }: ProfileInputProps) {
  return (
    <div>
      <p className="text-muted-foreground text-sm">{label}</p>
      <input
        type="text"
        value={value || ''}
        onChange={onChange}
        className="text-foreground border-border focus:border-primary w-full border-b bg-transparent text-base font-medium focus:outline-none"
      />
    </div>
  );
}
