import { AuthTitle } from "../components/auth/AuthTitle";
import { SignUpForm } from "../components/auth/SignUpForm";
import { SocialLogin } from "../components/auth/SocialLogin";

export function SignUpPage() {
  return (
    <>
      <AuthTitle>Fotobook Signup</AuthTitle>
      <SocialLogin />
      <SignUpForm />
    </>
  );
}
