import { useState } from "react";
import { toast } from "sonner";
import { authService } from "../../services/authService";
import type { ApiErrorResponse } from "../../types/api";
import { InputField } from "../ui/InputField";
import { Loading } from "../ui/Loading";
import { SubmitButton } from "../ui/SubmitButton";
import { TextInput } from "../ui/TextInput";

export function SignUpForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData(e.currentTarget);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      const email = formData.get("email") as string;
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const { message } = await authService.register(
        email,
        password,
        firstName,
        lastName,
      );
      toast.success(message);
    } catch (error) {
      toast.error(
        (error as ApiErrorResponse).message ||
          "Failed to register. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <form
      className="flex flex-col bg-stone-50 shadow-lg border-2 border-zinc-100 rounded-lg"
      onSubmit={(e) => void handleSubmit(e)}
    >
      <div className="flex flex-col mx-4 md:mx-8">
        <InputField
          labelClassName="mt-4.5 md:mt-9 mx-2 md:mx-4"
          label="First Name"
          htmlFor="firstName"
        >
          <TextInput
            id="firstName"
            name="firstName"
            autoFocus
            type="text"
            placeholder="First Name"
            required
          />
        </InputField>
        <InputField label="Last Name" htmlFor="lastName">
          <TextInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
          />
        </InputField>
        <InputField label="Email" htmlFor="email">
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            required
          />
        </InputField>
        <InputField label="Password" htmlFor="password">
          <TextInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            required
          />
        </InputField>
        <InputField label="Confirm Password" htmlFor="confirmPassword">
          <TextInput
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </InputField>
        <SubmitButton text="Signup" />
      </div>
    </form>
  );
}
