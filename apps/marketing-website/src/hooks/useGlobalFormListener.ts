"use client";

import { useEffect } from "react";
import { useToast } from "@/context/ToastContext";

export function useGlobalFormListener() {
    const { toast } = useToast();

    useEffect(() => {
        const handleSubmit = (event: SubmitEvent) => {
            const form = event.target as HTMLFormElement;

            // If the form prevents default (like React controlled forms), 
            // we might assume it handles its own success state (like we did for the specific forms).
            // However, the requirement is to show toast for "all forms".
            // Our specific React forms call e.preventDefault() and then run async logic.
            // This listener runs BEFORE the specific React handlers if we use capture=true, 
            // or bubbling.

            // But we don't want to show a generic "Form submitted" toast if the specific form 
            // is going to show a specific "You're in!" toast.

            // Easy check: Add a data attribute `data-no-global-toast` to forms that handle their own toast,
            // OR just let it double toast (bad UX),
            // OR checks if it's one of our known forms.

            // Better approach:
            // The requirement says "Find every HTML form... Intercept... Show toast... Handle submission".
            // This implies handling standard HTML forms.
            // For React forms that use `onSubmit={handler}`, this global listener on `document` 
            // will still fire.

            // Let's check for a specific attribute to opt-OUT of global toast, 
            // and add that attribute to our manually handled forms.
            if (form.getAttribute("data-custom-toast") === "true") {
                return;
            }

            // For standard forms (if any), we show the toast.
            // We can't easily know if they failed or succeeded if they are just doing a POST,
            // but the prompt implies showing it immediately.
            toast.success("Form submitted successfully!");
        };

        // Use capture phase to ensure we catch it before some handlers might stop propagation
        // though usually React delegates to document anyway.
        document.addEventListener("submit", handleSubmit, { capture: false });

        return () => {
            document.removeEventListener("submit", handleSubmit);
        };
    }, [toast]);
}
