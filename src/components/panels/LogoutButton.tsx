"use client";

import { Button } from "@/components/ui/Button";
import { logoutAction } from "@/actions/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button type="submit" variant="outline" size="sm">
        Logout
      </Button>
    </form>
  );
}
