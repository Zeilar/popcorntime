import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
    const { push } = useHistory();

    return (
        <div>
            <button
                onClick={() => {
                    const test = uuidv4();
                    push(`/room/${test}`);
                }}
            >
                Go to room
            </button>
        </div>
    );
}
