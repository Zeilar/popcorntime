import { AbsoluteCenter, Box } from "@chakra-ui/layout";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import Button from "domains/common/components/styles/button";
import { Link } from "react-router-dom";

export function Home() {
    return (
        <Box h="100vh">
            <AbsoluteCenter
                fill="brand"
                display="flex"
                flexDir="column"
                alignItems="center"
            >
                <BrandLogo />
                <Button.Primary>
                    <Link to="/room/new">Create new room</Link>
                </Button.Primary>
            </AbsoluteCenter>
        </Box>
    );
}
