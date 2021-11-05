import { Textarea as TA, TextareaProps } from "@chakra-ui/textarea";
import { useTheme } from "@chakra-ui/react";
import { RefObject } from "react";

interface IProps extends TextareaProps {
    forwardRef: RefObject<HTMLTextAreaElement>;
}

export default function Textarea({ forwardRef, children, ...props }: IProps) {
    const theme = useTheme();
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
