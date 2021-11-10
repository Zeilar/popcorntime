import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { ISocket } from "domains/common/@types/socket";
import MdiIcon from "domains/common/components/MdiIcon";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);
    const prompt = useDisclosure();

    function destroy() {
        adminSocket.emit("socket:destroy", socket.id);
    }

    function kickFromRoom() {
        adminSocket.emit("room:kick", socket.id);
    }

    return (
        <Flex
            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
            align="center"
            p="0.5rem"
            rounded="base"
            overflow="hidden"
        >
            <Prompt
                header="Destroy socket"
                body="Are you sure? This cannot be undone!"
                isOpen={prompt.isOpen}
                onClose={prompt.onClose}
                onSubmit={destroy}
            />
            <Text
                overflow="hidden"
                flexGrow={1}
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                mr="0.5rem"
            >
                {socket.username}
            </Text>
            <Menu>
                <MenuButton pointerEvents="none">
                    <Button.Icon icon="mdiDotsVertical" pointerEvents="all" />
                </MenuButton>
                <MenuList>
                    <MenuItem
                        icon={<DeleteIcon color="red.600" />}
                        onClick={prompt.onOpen}
                    >
                        Destroy
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
