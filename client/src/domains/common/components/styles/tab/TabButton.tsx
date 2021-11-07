import { ButtonProps } from "@chakra-ui/button";
import { ReactNode } from "react";
import Button from "../button";

interface IProps extends ButtonProps {
    active: boolean;
    children: ReactNode;
}

export default function TabButton({ active, children, ...props }: IProps) {
    const activeStyling: ButtonProps = active
        ? {
              color: "brand.light",
              pos: "relative",
              _after: {
                  content: `""`,
                  pos: "absolute",
                  bottom: 0,
                  left: 0,
                  height: "2px",
                  width: "100%",
                  bgColor: "brand.light",
              },
          }
        : {};
    return (
        <Button.Unstyled
            h="auto"
            textTransform="uppercase"
            p="1rem"
            {...activeStyling}
            {...props}
        >
            {children}
        </Button.Unstyled>
    );
}
