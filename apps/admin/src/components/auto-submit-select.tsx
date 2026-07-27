"use client";

import type { ReactNode } from "react";

export function AutoSubmitSelect({
  name,
  defaultValue,
  children,
  className,
}: {
  name: string;
  defaultValue: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className={className}
    >
      {children}
    </select>
  );
}
