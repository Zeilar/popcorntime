import { Alert, AlertIcon, AlertProps } from "@chakra-ui/alert";

interface IProps extends AlertProps {
    children: React.ReactNode;
}

export function ErrorAlert({ children, ...props }: IProps) {
    return (
        <Alert
            variant="left-accent"
            status="error"
            bgColor="rgba(255, 0, 0, 0.2)"
            borderLeftColor="red.500"
            {...props}
        >
            <AlertIcon color="red.500" />
            {children}
        </Alert>
    );
}
