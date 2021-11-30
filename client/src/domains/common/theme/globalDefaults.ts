import { withDefaultVariant } from "@chakra-ui/react";

export const globalDefaults = [
    withDefaultVariant({
        variant: "outline",
        components: ["Input", "Textarea", "Select", "Checkbox"],
    }),
];
