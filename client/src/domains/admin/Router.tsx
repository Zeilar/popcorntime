import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Prompt } from "domains/common/components/modals";
import { WebsocketContext } from "domains/common/contexts";
import { useContext, useEffect, useState } from "react";
import Dashboard from "./components/dashboard/Dashboard";

export default function Router() {
    const [authenticated, setAuthenticated] = useState(false);
    const loginDisclosure = useDisclosure();
    const { adminLogin, adminSocket } = useContext(WebsocketContext);
    const [password, setPassword] = useState("");

    function attemptLogin() {
        adminLogin(password);
    }

    useEffect(() => {
        adminSocket.on("connect", () => {
            setAuthenticated(true);
        });
        return () => {
            adminSocket.off("connect");
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
