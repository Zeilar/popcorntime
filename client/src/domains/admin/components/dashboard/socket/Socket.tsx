import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { ISocket } from "domains/common/@types/socket";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { useContext } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);
    const destroyPrompt = useDisclosure();
    const kickPrompt = useDisclosure();

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
                isOpen={destroyPrompt.isOpen}
                onClose={destroyPrompt.onClose}
                onSubmit={destroy}
            />
            <Prompt
                header="Kick socket from room"
                body="Are you sure?"
                isOpen={kickPrompt.isOpen}
                onClose={kickPrompt.onClose}
                onSubmit={kickFromRoom}
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
                    <Button.Icon
                        as="div"
                        icon="mdiDotsVertical"
                        pointerEvents="all"
                    />
                </MenuButton>
                <MenuList>
                    <MenuItem
                        icon={<DeleteIcon color="danger" />}
                        onClick={destroyPrompt.onOpen}
                    >
                        Destroy
                    </MenuItem>
                    <MenuItem
                        icon={<DeleteIcon color="danger" />}
                        onClick={kickPrompt.onOpen}
                    >
                        Kick from room
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
