import { SignUpForm } from "../components/auth/SignUpForm";
import { SocialLogin } from "../components/auth/SocialLogin";
import { Title } from "../components/ui/Title";

export function SignUpPage() {
  return (
    <>
      <Title>Fotobook Signup</Title>
      <SocialLogin />
      <SignUpForm />
    </>
  );
}
