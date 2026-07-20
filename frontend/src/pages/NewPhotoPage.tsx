import { NewForm } from "../components/new/NewForm";
import { NewTitle } from "../components/ui/NewTitle";
import { PhotoInput } from "../components/ui/PhotoInput";

export function NewPhotoPage() {
  return (
    <>
      <NewTitle>New Photo</NewTitle>
      <NewForm type="photo">
        <PhotoInput name="photo" />
      </NewForm>
    </>
  );
}
