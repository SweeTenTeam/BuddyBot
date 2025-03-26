"use client"

import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"

export default function Header() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const src = !mounted ? "/buddyLight.png" : (theme === "dark" || resolvedTheme === "dark") ? "/buddyDark.png" : "/buddyLight.png";

    return (
        <header className="flex justify-center items-center h-20 min-h-20">
            {mounted && (
                <img
                    id="logo"
                    className={`w-80 ${imageLoaded ? 'block' : 'hidden'}`}
                    src={src}
                    alt="Buddy Logo"
                    onLoad={() => setImageLoaded(true)}
                    suppressHydrationWarning
                />
            )}
        </header>
    );
}
