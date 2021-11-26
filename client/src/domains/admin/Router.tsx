import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box } from "@chakra-ui/layout";
import { Prompt } from "domains/common/components/modals";
import { WebsocketContext } from "domains/admin/contexts";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Dashboard from "./components/dashboard/Dashboard";

export default function Router() {
    const { adminLogin, adminSocket } = useContext(WebsocketContext);
    const [authenticated, setAuthenticated] = useState(adminSocket.connected);
    const loginDisclosure = useDisclosure();
    const [password, setPassword] = useState("");

    function submit(e: React.FormEvent) {
        e.preventDefault();
        attemptLogin();
    }

    function attemptLogin() {
        adminLogin(password);
    }

    useEffect(() => {
        adminSocket.on("connect_error", error => {
            toast.error(error.message);
        });
        adminSocket.on("connect", () => {
            setAuthenticated(true);
        });
        return () => {
            adminSocket.off("connect").off("connect_error");
        };
    }, [adminSocket]);

    if (!authenticated) {
        return (
            <Prompt
                header="Admin login"
                onClose={loginDisclosure.onClose}
                isOpen={true}
                noCancel={true}
                body={
                    <Box as="form" onSubmit={submit}>
                        <Input
                            autoFocus
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </Box>
                }
                onSubmit={attemptLogin}
            />
        );
    }

    return <Dashboard />;
}
