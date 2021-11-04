import { BrowserRouter, Route, Switch } from "react-router-dom";
import Admin from "./domains/admin/App";
import Public from "./domains/public/App";

export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/admin">
                    <Admin />
                </Route>
                <Route path="/">
                    <Public />
                </Route>
                <Route>404</Route>
            </Switch>
        </BrowserRouter>
    );
}
