import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchInputProps = ComponentPropsWithoutRef<'input'>;

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { className, ...props },
  ref
) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
      <Input ref={ref} className={cn('pl-9', className)} {...props} />
    </div>
  );
});