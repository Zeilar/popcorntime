import { Grid, Text } from "@chakra-ui/layout";

export default function Footer() {
    return (
        <Grid
            as="footer"
            bgColor="gray.800"
            boxShadow="elevate.top"
            alignItems="center"
            p="1rem"
            gridTemplateColumns="repeat(3, 1fr)"
            zIndex={200}
        >
            <Text gridColumnStart={2} textAlign="center">
                Contact me at{" "}
                <a href="mailto:philip@angelin.dev">philip@angelin.dev</a>
            </Text>
            <Text textAlign="right">v{process.env.REACT_APP_VERSION}</Text>
        </Grid>
    );
}
