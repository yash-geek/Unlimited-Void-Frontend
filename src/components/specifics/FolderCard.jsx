import React from "react"
import { FcOpenedFolder as FolderIcon } from "react-icons/fc"
import OptionsMenu from "./OptionsMenu"

const FolderCard = ({ folder, onDelete, onRestore, actions = [], onOpen }) => {
  return (
    <div
      className="p-4 bg-gray-200 rounded flex flex-col items-center relative cursor-pointer hover:bg-gray-300"
      onClick={onOpen}   // ✅ navigation works again
    >
      <OptionsMenu
        isFile={false}
        onDelete={onDelete}
        onRestore={onRestore}
        actions={actions}
      />
      <FolderIcon className="text-5xl sm:text-7xl mb-2" />
      <span>{folder.name}</span>
    </div>
  )
}

export default FolderCard
