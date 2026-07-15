import type { User } from "../../types/User";
import { InputField } from "../ui/InputField";
import { PhotoInput } from "../ui/PhotoInput";
import { SaveButton } from "../ui/SaveButton";
import { TextInput } from "../ui/TextInput";
import { Title } from "../ui/Title";

export function EditProfileAdminForm({ initial }: { initial: User }) {
  return (
    <form
      className="flex flex-col items-center my-5 md:my-10"
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <PhotoInput initial={initial.avatarUrl} name="avatar" />
      <div className="flex flex-col items-center my-2.5 md:my-5">
        <Title className="text-xs md:text-base">Basic Information</Title>
        <InputField
          label="First Name"
          htmlFor="firstName"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <TextInput
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First Name"
            autoFocus
            required
            defaultValue={initial.firstName}
            className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
          />
        </InputField>
        <InputField
          label="Last Name"
          htmlFor="lastName"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <TextInput
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last Name"
            required
            defaultValue={initial.lastName}
            className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
          />
        </InputField>
        <InputField
          label="Email"
          htmlFor="email"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <TextInput
            id="email"
            name="email"
            type="email"
            placeholder="someone@example.com"
            required
            defaultValue={initial.email}
            className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
          />
        </InputField>
        <InputField
          label="Password"
          htmlFor="password"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <TextInput
            id="password"
            name="password"
            type="password"
            required
            className="mx-0.75 md:mx-1.5 p-1.25 md:p-2.5"
          />
        </InputField>
        <InputField
          label="Active?"
          htmlFor="active"
          outerClassName="grid grid-cols-[80px_1fr] md:grid-cols-[120px_1fr] items-center"
          labelClassName="mx-0.75 md:mx-1.5 text-right"
        >
          <div className="flex items-center mx-0.75 md:mx-1.5 min-w-37.5 md:min-w-54.5">
            <input
              id="active"
              name="active"
              type="checkbox"
              defaultChecked={initial.isActive}
              className="w-3 md:w-4 h-3 md:h-4"
            />
          </div>
        </InputField>
        <SaveButton />
      </div>
    </form>
  );
}
