import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function MessageAvatar({ user }: { user: boolean }) {
    return (
        <Avatar>
            <AvatarImage
                src={user ? "/AD_favicon.png" : "/buddy_avatar.png"}
                alt={user ? "User Avatar" : "Bot Avatar"}
            />
            <AvatarFallback>{user ? "AD" : "BB"}</AvatarFallback>
        </Avatar>
    );
}
