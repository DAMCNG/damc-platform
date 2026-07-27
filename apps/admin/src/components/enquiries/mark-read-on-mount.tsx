"use client";

import * as React from "react";
import { markEnquiryRead } from "@/app/(dashboard)/enquiries/actions";

export function MarkReadOnMount({ id, alreadyRead }: { id: string; alreadyRead: boolean }) {
  React.useEffect(() => {
    if (!alreadyRead) markEnquiryRead(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return null;
}
