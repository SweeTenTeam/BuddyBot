import { Target } from "@/adapters/Target";
import { ReactNode } from "react";

export interface ChatProviderProps {
    children: ReactNode;
    adapter: Target;
}