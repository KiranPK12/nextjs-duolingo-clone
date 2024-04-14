import { auth } from "@clerk/nextjs"

const allowedAdminIds = [
    "user_2dlKup4Hpy1eGU3DmZeD4642lf8",
]

export const isAdmin =  () => {
    const { userId } = auth()
    if (!userId) {
        return false;
    }
    return allowedAdminIds.indexOf(userId) !== -1

}