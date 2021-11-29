import { Grid, Text } from "@chakra-ui/layout";

export default function Footer() {
    return (
        <Grid
            as="footer"
            bgColor="gray.900"
            boxShadow="elevate.top"
            p="1rem"
            gridTemplateColumns="repeat(3, 1fr)"
        >
            <Text gridColumnStart={2} textAlign="center">
                Footer
            </Text>
            <Text textAlign="right">v{process.env.REACT_APP_VERSION}</Text>
        </Grid>
    );
}
