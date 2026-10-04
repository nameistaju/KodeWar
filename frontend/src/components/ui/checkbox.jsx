import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef(({ className, checked, onChange, id, ...props }, ref) => {
  return (
    <label
      htmlFor={id}
      className={cn(
        'relative inline-flex items-center justify-center h-4 w-4 shrink-0 rounded-sm border border-zinc-700 bg-zinc-950 transition-colors cursor-pointer',
        checked && 'bg-zinc-50 border-zinc-50 text-zinc-900',
        className
      )}
    >
      <input
        type="checkbox"
        id={id}
        ref={ref}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      {checked && <Check className="h-3 w-3 stroke-[3]" />}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
