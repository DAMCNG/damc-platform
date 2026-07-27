"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function ToastListener() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const message = searchParams.get("toast");
    const type = searchParams.get("toastType");
    if (!message) return;

    if (type === "error") toast.error(message);
    else toast.success(message);

    const params = new URLSearchParams(searchParams);
    params.delete("toast");
    params.delete("toastType");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return null;
}
