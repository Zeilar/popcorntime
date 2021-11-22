import { Flex } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { useOnClickOutside } from "domains/common/hooks";

interface IProps {
    onClose(): void;
    isOpen: boolean;
}

export default function RoomInfo({ isOpen, onClose }: IProps) {
    const wrapper = useOnClickOutside<HTMLDivElement>(onClose);
    return (
        <Flex
            pos="absolute"
            right={0}
            top={0}
            h="100%"
            w="100%"
            ref={wrapper}
            bgColor="gray.800"
            zIndex={100}
        >
            <Button.Icon
                mdi="mdiClose"
                onClick={onClose}
                pos="absolute"
                right="0.5rem"
                top="0.5rem"
            />
            Menu
        </Flex>
    );
}
