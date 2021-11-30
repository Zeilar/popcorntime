import { withDefaultVariant } from "@chakra-ui/react";

export const withDefaults = [
    withDefaultVariant({
        variant: "outline",
        components: ["Input", "Textarea", "Select", "Checkbox"],
    }),
];
