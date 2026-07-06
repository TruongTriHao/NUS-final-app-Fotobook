import { useState } from "react";
import { AlbumContent } from "../main/AlbumContent";
import { PhotoContent } from "../main/PhotoContent";
import { TabButton } from "./TabButton";

export function Tabs({ type }: { type: "feeds" | "discover" }) {
  const [activeTab, setActiveTab] = useState("PHOTO");

  return (
    <>
      <div className="flex justify-center m-3.5">
        <TabButton
          label="PHOTO"
          active={activeTab === "PHOTO"}
          onClick={() => {
            setActiveTab("PHOTO");
          }}
        />
        <TabButton
          label="ALBUM"
          active={activeTab === "ALBUM"}
          onClick={() => {
            setActiveTab("ALBUM");
          }}
        />
      </div>
      {activeTab === "PHOTO" ? (
        <PhotoContent type={type} />
      ) : (
        <AlbumContent type={type} />
      )}
    </>
  );
}
