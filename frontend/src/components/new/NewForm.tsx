import type { Album } from "../../types/Album";
import type { Photo } from "../../types/Photo";
import { DeleteButton } from "../ui/DeleteButton";
import { InputField } from "../ui/InputField";
import { SaveButton } from "../ui/SaveButton";
import { TextInput } from "../ui/TextInput";
import { DropdownChoice } from "./DropdownChoice";

export function NewForm({
  type,
  initial = null,
  children,
  editMode = false,
}: {
  type: "photo" | "album";
  initial?: Photo | Album | null;
  children?: React.ReactNode;
  editMode?: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <div className="grid grid-cols-2">
        <div className="flex flex-col">
          <InputField
            label="Title"
            htmlFor="title"
            outerClassName="my-1.25 md:my-2.5"
            labelClassName="my-1 md:my-2"
          >
            <TextInput
              id="title"
              name="title"
              type="text"
              autoFocus
              placeholder={`${type === "photo" ? "Photo" : "Album"} Title`}
              className="px-1.25 md:px-2.5 py-1 md:py-2"
              defaultValue={initial?.title}
              required
            />
          </InputField>
          <InputField
            label="Sharing mode"
            htmlFor="sharingMode"
            outerClassName="my-1.25 md:my-2.5"
            labelClassName="my-1 md:my-2"
          >
            <DropdownChoice initial={initial?.mode} />
          </InputField>
        </div>
        <InputField
          label="Description"
          htmlFor="description"
          outerClassName="my-1.25 md:my-2.5"
          labelClassName="my-1 md:my-2"
        >
          <textarea
            id="description"
            name="description"
            placeholder={`${type === "photo" ? "Photo" : "Album"} Description`}
            className="px-1.25 md:px-2.5 py-1 md:py-2 mx-2 md:mx-4 border-2 border-neutral-200 rounded-sm text-xs md:text-base"
            rows={5}
            defaultValue={initial?.description}
            required
          />
        </InputField>
      </div>
      {children}
      <SaveButton className="self-start" />
      {editMode && <DeleteButton />}
    </form>
  );
}
