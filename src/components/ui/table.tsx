import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full max-w-full overflow-x-auto">
      <table
        className={cn(
          "w-full min-w-full border-collapse text-left text-sm",
          /* Mobile: switch to card layout */
          "max-md:block max-md:space-y-3",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export function Thead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        /* Hide headers on mobile; labels come from data-label on Td */
        "max-md:hidden",
        className,
      )}
      {...props}
    />
  );
}

export function Tbody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("max-md:block", className)}
      {...props}
    />
  );
}

export function Tr({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        /* Desktop: normal row; Mobile: card */
        "max-md:block max-md:rounded-2xl max-md:border max-md:border-white/10 max-md:bg-white/5 max-md:p-4 transition-colors hover:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "border-b border-white/10 bg-white/5 px-4 py-3.5 font-semibold text-on-surface-variant uppercase tracking-wider text-[11px]",
        className,
      )}
      {...props}
    />
  );
}

export function Td({
  label,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { label?: string }) {
  return (
    <td
      className={cn(
        "border-b border-white/5 px-4 py-3 align-middle",
        /* Mobile: stack as label + value */
        "max-md:flex max-md:min-w-0 max-md:gap-2 max-md:border-b-0 max-md:px-0 max-md:py-1.5",
        className,
      )}
      {...props}
    >
      {label ? (
        <span className="hidden max-md:inline-block max-md:min-w-[7rem] max-md:shrink-0 max-md:font-semibold max-md:text-on-surface-variant max-md:text-xs max-md:uppercase max-md:tracking-wider">
          {label}
        </span>
      ) : null}
      <span className="contents min-w-0 max-md:inline">{props.children}</span>
    </td>
  );
}
