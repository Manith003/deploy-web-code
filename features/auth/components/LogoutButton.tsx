import {LogoutButtonProps} from "../types"
import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"


const LogoutButton = ({children}: LogoutButtonProps) => {
    const router = useRouter();

    const onLogout = async () => {
        await signOut();
        router.refresh();
    }

  return (
    <span onClick={onLogout} className="cursor-pointer">
        {children}
    </span>
  )
}

export default LogoutButton