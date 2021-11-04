import { useState, useEffect } from "react";
import { IRoom } from "../../../common/@types/room";

interface IProps {
    rooms: IRoom[];
}

export default function Rooms({ rooms }: IProps) {
    return <div>{JSON.stringify(rooms, null, 4)}</div>;
}
