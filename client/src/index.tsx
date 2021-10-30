import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import { ToastContainer } from "react-toastify";
import App from "./components/App";
import { theme } from "./styles/theme";
import "react-toastify/dist/ReactToastify.min.css";
import { MeContextProvider } from "./contexts";

ReactDOM.render(
    <React.StrictMode>
        <ChakraProvider theme={theme}>
            <MeContextProvider>
                <App />
                <ToastContainer
                    theme="dark"
                    hideProgressBar={true}
                    limit={3}
                    autoClose={2500}
                    pauseOnFocusLoss={false}
                />
            </MeContextProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
