import * as React from "react"
// import { Slot } from "@radix-ui/react-slot"
// import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Note: I am simulating a shadcn-like button but keeping it simple without installing the full library for now
// I need class-variance-authority and @radix-ui/react-slot if I want full parity, but for now I will stick to simple props or install CVA.
// Wait, I didn't install class-variance-authority or radix-ui/react-slot.
// Error prevention: I will build a simpler button first without CVA/Slot to avoid extra installs unless I add them.
// The user asked for "standard shadcn/ui" isn't strictly required, but "modern" and "reusable".
// I will implement a flexible Button component using standard props.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link" | "primary" | "secondary";
    size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

        const variants = {
            default: "bg-primary text-white shadow hover:bg-primary/90",
            primary: "bg-primary text-white shadow hover:bg-primary/90",
            secondary: "bg-secondary text-white shadow-sm hover:bg-secondary/80",
            outline: "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground border-neutral-200",
            ghost: "hover:bg-neutral-100 hover:text-neutral-900",
            link: "text-primary underline-offset-4 hover:underline",
        }

        const sizes = {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
        }

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
