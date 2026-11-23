import { ButtonLink } from "@/components/ui/button";
import { SignOutButton } from "@/features/auth/components/sign-out-button";

/** Header buttons for every admin page. Lives here because it joins ui and the auth feature. */
export function AdminHeaderActions() {
  return (
    <>
      <ButtonLink href="/" variant="secondary" size="sm">
        Customer view
      </ButtonLink>
      <SignOutButton />
    </>
  );
}
