import { useState } from "react"
import { useInviteUserToFileMutation } from "../../redux/api/api"
import toast from "react-hot-toast"

const ShareButton = ({ fileId, onCloseMenu }) => {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("viewer")
  const [inviteUser, { isLoading }] = useInviteUserToFileMutation()

  const handleInvite = async () => {
    if (!email) return toast.error("Please enter an email")

    try {
      await inviteUser({ fileId, email, role }).unwrap()
      toast.success(`Invited ${email} as ${role}`)
      setEmail("")
      onCloseMenu?.() // close OptionsMenu after success
    } catch (err) {
      toast.error(err?.data?.message || "Invite failed")
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      />
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="viewer">Viewer</option>
        <option value="editor">Editor</option>
      </select>
      <button
        onClick={handleInvite}
        disabled={isLoading}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
      >
        {isLoading ? "Inviting..." : "Invite"}
      </button>
    </div>
  )
}

export default ShareButton
