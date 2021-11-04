import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminRouter from "../domains/admin/Router";
import { MeContextProvider } from "../domains/public/contexts";
import PublicRouter from "../domains/public/Router";

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/admin">
                    <AdminRouter />
                </Route>
                <Route path="/">
                    <MeContextProvider>
                        <PublicRouter />
                    </MeContextProvider>
                </Route>
                <Route>404</Route>
            </Switch>
        </BrowserRouter>
    );
}
