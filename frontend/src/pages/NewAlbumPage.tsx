import { NewForm } from "../components/new/NewForm";
import { NewTitle } from "../components/ui/NewTitle";

export function NewAlbumPage() {
  return (
    <>
      <NewTitle>New Album</NewTitle>
      <NewForm type="albums" />
    </>
  );
}
