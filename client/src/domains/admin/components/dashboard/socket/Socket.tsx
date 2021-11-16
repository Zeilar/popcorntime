import { useDisclosure } from "@chakra-ui/hooks";
import { DeleteIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { Flex, FlexProps, Text } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { RoomContext } from "domains/admin/contexts";
import { ISocket } from "domains/common/@types/socket";
import { Prompt } from "domains/common/components/modals";
import Button from "domains/common/components/styles/button";
import { WebsocketContext } from "domains/common/contexts";
import { motion } from "framer-motion";
import { useContext } from "react";

interface IProps {
    socket: ISocket;
}

export default function Socket({ socket }: IProps) {
    const { adminSocket } = useContext(WebsocketContext);
    const { rooms } = useContext(RoomContext);
    const destroyPrompt = useDisclosure();
    const kickPrompt = useDisclosure();

    const hasRoom = rooms.some(room => room.sockets.includes(socket.id));

    const noRoomMenuItemProps: any = !hasRoom
        ? {
              opacity: 0.25,
              pointerEvents: "none",
          }
        : {
              onClick: kickPrompt.onOpen,
          };

    function destroy() {
        adminSocket.emit("socket:destroy", socket.id);
    }

    function kickFromRoom() {
        adminSocket.emit("room:kick", socket.id);
    }

    const Motion = motion<FlexProps>(Flex);

    return (
        <Motion
            bgGradient={`linear(to-r, ${socket.color}.700, ${socket.color}.900)`}
            align="center"
            p="0.5rem"
            rounded="base"
            overflow="hidden"
            exit={{ opacity: 0 }}
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
                        icon={<NotAllowedIcon color="danger" />}
                        {...noRoomMenuItemProps}
                    >
                        Kick from room
                    </MenuItem>
                </MenuList>
            </Menu>
        </Motion>
    );
}
