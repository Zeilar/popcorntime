import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import App from "./boot/App";
import theme from "./domains/common/theme";
import "./boot";

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <App />
        <ToastContainer
            style={{ whiteSpace: "pre-wrap" }}
            toastStyle={{
                backgroundColor: "var(--chakra-colors-gray-600)",
                boxShadow: "var(--chakra-shadows-lg)",
            }}
            theme="dark"
            hideProgressBar={true}
            limit={3}
            autoClose={2500}
            pauseOnFocusLoss={false}
        />
    </ChakraProvider>,
    document.getElementById("root")
);
