import { SignIn } from '@clerk/react';

export function SignInPage() {
  return <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />;
}
