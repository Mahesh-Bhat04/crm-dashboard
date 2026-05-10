import { SignUp } from '@clerk/react';

export function SignUpPage() {
  return <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />;
}
