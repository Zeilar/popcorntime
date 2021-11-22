import { Flex } from "@chakra-ui/layout";
import BrandLogo from "domains/common/components/styles/BrandLogo";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <Flex
            as="nav"
            justifyContent="center"
            boxShadow="elevate.bottom"
            bgColor="gray.800"
            zIndex={100}
        >
            <Link to="/">
                <BrandLogo />
            </Link>
        </Flex>
    );
}
