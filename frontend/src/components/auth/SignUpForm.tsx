import { InputField } from "../ui/InputField";
import { SubmitButton } from "../ui/SubmitButton";
import { TextInput } from "../ui/TextInput";

export function SignUpForm() {
  return (
    <form
      className="flex flex-col bg-stone-50 shadow-lg border-2 border-zinc-100 rounded-lg"
      onSubmit={(e) => {
        e.preventDefault();
      }}
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
