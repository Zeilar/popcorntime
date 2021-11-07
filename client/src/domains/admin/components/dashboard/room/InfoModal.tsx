import { Box, Flex, Grid } from "@chakra-ui/layout";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/modal";
import { IRoom } from "domains/common/@types/room";
import ChatMessage from "domains/common/components/ChatMessage";
import Tab from "domains/common/components/styles/tab";
import { useState } from "react";
import * as Style from "./InfoModal.style";

interface IProps {
    isOpen: boolean;
    onClose(): void;
    room: IRoom;
}

type TabState = "details" | "messages" | "playlist";

export default function InfoModal({ isOpen, onClose, room }: IProps) {
    const [openTab, setOpenTab] = useState<TabState>("details");

    return (
        <Modal blockScrollOnMount isOpen={isOpen} onClose={onClose} size="2xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Room info</ModalHeader>
                <ModalBody>
                    <Box pb="0.75rem">
                        <Grid
                            gridTemplateColumns="repeat(3, 1fr)"
                            mb="1rem"
                            borderBottom="1px solid"
                            borderColor="gray.100"
                        >
                            <Tab.Button
                                active={openTab === "details"}
                                onClick={() => setOpenTab("details")}
                            >
                                Details
                            </Tab.Button>
                            <Tab.Button
                                active={openTab === "messages"}
                                onClick={() => setOpenTab("messages")}
                            >
                                Messages
                            </Tab.Button>
                            <Tab.Button
                                active={openTab === "playlist"}
                                onClick={() => setOpenTab("playlist")}
                            >
                                Playlist
                            </Tab.Button>
                        </Grid>
                        <Flex
                            className="custom-scrollbar"
                            flexDir="column"
                            maxH="60vh"
                            overflowY="auto"
                            pr="0.5rem"
                        >
                            {openTab === "details" && (
                                <Grid gridGap="1rem">
                                    <Style.Detail label="id" value={room.id} />
                                    <Style.Detail
                                        label="created at"
                                        value={new Date(
                                            room.created_at
                                        ).toLocaleString()}
                                    />
                                </Grid>
                            )}
                            {openTab === "messages" &&
                                room.messages.map((message) => (
                                    <ChatMessage
                                        message={message}
                                        key={message.id}
                                    />
                                ))}
                            {openTab === "playlist" && "Playlist here"}
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
