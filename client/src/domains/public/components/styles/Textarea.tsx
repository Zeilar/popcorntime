import { Textarea as TA, TextareaProps } from "@chakra-ui/textarea";
import { RefObject } from "react";
import { theme } from "../../../../common/styles/theme";

interface IProps extends TextareaProps {
    forwardRef: RefObject<HTMLTextAreaElement>;
}

export default function Textarea({ forwardRef, children, ...props }: IProps) {
    return (
        <TA
            _focus={{
                boxShadow: `0 0 0 1px ${theme.colors.brand}`,
                borderColor: theme.colors.brand,
            }}
            {...props}
            ref={forwardRef}
        >
            {children}
        </TA>
    );
}
