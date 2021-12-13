import { Grid, Text } from "@chakra-ui/layout";
import * as Popover from "@chakra-ui/popover";
import { colors } from "data/colors";
import Button from "domains/common/components/styles/button";
import { useContext } from "react";
import { MeContext } from "../contexts";

interface IProps {
    children: React.ReactNode;
}

export default function SocketSettings({ children }: IProps) {
    const { me } = useContext(MeContext);

    if (!me) {
        return null;
    }

    return (
        <Popover.Popover placement="bottom" closeOnBlur={false}>
            {({ onClose }) => (
                <>
                    <Popover.PopoverTrigger>{children}</Popover.PopoverTrigger>
                    <Popover.PopoverContent mr="1rem">
                        <Button.Icon
                            right="0.5rem"
                            top="0.5rem"
                            pos="absolute"
                            mdi="mdiClose"
                            onClick={onClose}
                        />
                        <Popover.PopoverHeader>Settings</Popover.PopoverHeader>
                        <Popover.PopoverBody>
                            <Text mb="0.5rem">Color</Text>
                            <Grid
                                gridGap="0.5rem"
                                gridTemplateColumns={`repeat(${colors.length}, 1fr)`}
                            >
                                {colors.map((color, i) => (
                                    <Button.Color key={i} color={color} />
                                ))}
                            </Grid>
                        </Popover.PopoverBody>
                    </Popover.PopoverContent>
                </>
            )}
        </Popover.Popover>
    );
}
