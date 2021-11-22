import { Flex, Text } from "@chakra-ui/layout";
import Button from "domains/common/components/styles/button";
import { useOnClickOutside } from "domains/common/hooks";
import { RoomContext } from "domains/public/contexts";
import { useContext } from "react";

interface IProps {
    onClose(): void;
}

export default function RoomInfo({ onClose }: IProps) {
    const { sockets } = useContext(RoomContext);
    const wrapper = useOnClickOutside<HTMLDivElement>(onClose);
    console.log(sockets);
    return (
        <Flex
            pos="absolute"
            right={0}
            top={0}
            h="100%"
            w="100%"
            flexDir="column"
            ref={wrapper}
            bgColor="gray.600"
            zIndex={100}
        >
            <Flex
                p="0.5rem"
                justifyContent="space-between"
                alignItems="center"
                boxShadow="elevate.bottom"
            >
                <Button.Icon />
                <Text fontWeight={600} textAlign="center">
                    Details
                </Text>
                <Button.Icon mdi="mdiClose" onClick={onClose} />
            </Flex>
            <Flex p="0.5rem" flexDir="column">
                <Text as="h4" mb="0.25rem">
                    Users
                </Text>
                {sockets.map(socket => (
                    <Text
                        color={`${socket.color}.600`}
                        fontWeight={700}
                        key={socket.id}
                    >
                        {socket.username}
                    </Text>
                ))}
            </Flex>
        </Flex>
    );
}
