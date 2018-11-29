import React from "react";
import {Route, Switch} from "react-router-dom";
import Home from "./containers/Home";
import Login from "./containers/Login";
import Register from "./containers/Register";
import RegisterConfirm from "./containers/RegisterConfirm"
import Account from "./containers/Account";
import NewProject from "./containers/NewProject";
import Project from "./containers/Project";
import Users from "./containers/Users";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Home} props={childProps} />
        <AppliedRoute path="/login" exact component={Login} props={childProps} />
        <AppliedRoute path="/register" exact component={Register} props={childProps} />
        <AppliedRoute path="/register/confirm" exact component={RegisterConfirm} props={childProps} />
        <AppliedRoute path="/account" exact component={Account} props={childProps} />
        <AppliedRoute path="/projects/new" exact component={NewProject} props={childProps} />
        <AppliedRoute path="/projects/:id" exact component={Project} props={childProps} />
        <AppliedRoute path="/users" exact component={Users} props={childProps} />
        <Route component={NotFound} />
    </Switch>