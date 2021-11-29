import { Box, Flex, Text } from "@chakra-ui/layout";
import env from "config/env";
import Button from "domains/common/components/styles/button";
import { RoomContext } from "domains/public/contexts";
import React, { useContext } from "react";

interface IRoomInfoProps {
    onClose(): void;
}

interface IRoomDetailProps {
    label: React.ReactNode;
    children: React.ReactNode;
}

function RoomDetail({ label, children }: IRoomDetailProps) {
    return (
        <Box mb="1rem">
            <Text
                mb="0.25rem"
                color="textMuted"
                textTransform="uppercase"
                fontSize="sm"
                fontWeight={600}
            >
                {label}
            </Text>
            {children}
        </Box>
    );
}

export default function RoomInfo({ onClose }: IRoomInfoProps) {
    const { sockets, room, getLeader } = useContext(RoomContext);
    const leader = getLeader();
    const isFull = sockets.length >= env.ROOM_MAX_SOCKETS;
    return (
        <Flex
            pos="absolute"
            right={0}
            top={0}
            h="100%"
            w="100%"
            flexDir="column"
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
                <Text
                    fontWeight={600}
                    textAlign="center"
                    fontSize="sm"
                    textTransform="uppercase"
                >
                    Details
                </Text>
                <Button.Icon mdi="mdiClose" onClick={onClose} />
            </Flex>
            <Flex p="0.5rem" flexDir="column">
                <RoomDetail label="id">{room?.id}</RoomDetail>
                <RoomDetail label="name">{room?.name}</RoomDetail>
                {leader && (
                    <RoomDetail label="leader">
                        <Text color={`${leader.color}.600`} fontWeight={700}>
                            {leader.username}
                        </Text>
                    </RoomDetail>
                )}
                <RoomDetail
                    label={
                        <>
                            <Text as="span">Users </Text>
                            <Text
                                as="span"
                                color={isFull ? "danger" : undefined}
                            >
                                {`${sockets.length} / ${env.ROOM_MAX_SOCKETS}`}
                            </Text>
                        </>
                    }
                >
                    {sockets.map(socket => (
                        <Text
                            color={`${socket.color}.600`}
                            fontWeight={700}
                            key={socket.id}
                        >
                            {socket.username}
                        </Text>
                    ))}
                </RoomDetail>
            </Flex>
        </Flex>
    );
}
