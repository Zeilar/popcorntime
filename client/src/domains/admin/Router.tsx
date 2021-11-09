import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Prompt } from "domains/common/components/modals";
import { SocketContext } from "domains/common/contexts";
import { useContext, useEffect, useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";

export default function Router() {
    const [authenticated, setAuthenticated] = useState(false);
    const loginDisclosure = useDisclosure();
    const { adminLogin, adminSocket } = useContext(SocketContext);
    const [password, setPassword] = useState("");

    function attemptLogin() {
        adminLogin(password);
    }

    useEffect(() => {
        const _adminSocket = adminSocket.current;
        _adminSocket.on("connect", () => {
            setAuthenticated(true);
        });
        return () => {
            _adminSocket.off("connect");
        };
    }, [adminSocket]);

    if (!authenticated) {
        return (
            <Prompt
                header="Admin login"
                onClose={loginDisclosure.onClose}
                isOpen={true}
                body={
                    <Box>
                        <Input
                            variant="flushed"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Box>
                }
                onSubmit={attemptLogin}
            />
        );
    }

    return <Dashboard />;
}
