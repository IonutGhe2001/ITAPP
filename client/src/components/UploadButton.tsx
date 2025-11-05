import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';

interface UploadButtonProps extends Omit<ButtonProps, 'onChange'> {
  accept?: string;
  multiple?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function UploadButton({
  accept,
  multiple,
  onChange,
  children,
  ...buttonProps
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <Button type="button" onClick={handleClick} {...buttonProps}>
        {children}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="hidden"
      />
    </>
  );
}
