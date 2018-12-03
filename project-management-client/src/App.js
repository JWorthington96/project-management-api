import React, {Component, Fragment} from 'react';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Routes from "./Routes";
import './App.css';
import {API} from "aws-amplify";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            user: null
        };
        this.setCurrentUser = this.setCurrentUser.bind(this);
        this.checkTokens = this.checkTokens.bind(this);
    };

    async componentDidMount() {
        try {
            // this will be used to get the current user from a saved session
            const user = JSON.parse(localStorage.getItem("ProjectManagerSession"));
            console.log(user);
            if (user === null) {
                console.log("User is null");
                // no stored user means user has not logged in/authenticated
                this.userHasAuthenticated(false);
                this.setState({isAuthenticating: false});
                return;
            }

            this.setCurrentUser(user);
            await this.checkTokens();
            this.userHasAuthenticated(true);
        } catch (error) {
            console.error(error);
        }

        this.setState({isAuthenticating: false});
    };

    // function to check if the given users tokens have expired, and if so refresh them and change the current user
    async checkTokens () {
        console.log("called check tokens");

        const serverTime = Math.floor(new Date()/1000) - this.state.user.auth.ClockDrift;
        if (serverTime > this.state.user.auth.Expiration) {
            try {
                const refreshUser = this.state.user;
                const auth = (await API.get("projects", "/users/refresh", {
                    queryStringParameters: {
                        RefreshToken: refreshUser.auth.RefreshToken
                    }
                })).body;
                console.log(auth);

                refreshUser.auth.AccessToken = auth.AccessToken;
                refreshUser.auth.IdToken = auth.IdToken;
                refreshUser.auth.IssuedAt = auth.IssuedAt;
                refreshUser.auth.Expiration = auth.Expiration;
                refreshUser.auth.ClockDrift = Math.floor(new Date()/1000) - auth.IssuedAt;

                console.log("Refreshed Access and Id tokens");
                await this.setState(refreshUser);
            } catch (error) {
                console.log(error.response);
            }
        }
        return;
    };

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    };

    setCurrentUser = user => {
        this.setState({user: user});
    };

    handleLogout = async event => {
        event.preventDefault();
        try {
            await this.checkTokens();
            await API.post("projects", "/logout", {
                headers: {
                    Authorization: "Bearer " + this.state.user.auth.AccessToken
                }
            });
            localStorage.removeItem("ProjectManagerSession");
            this.userHasAuthenticated(false);
            this.setCurrentUser(null);
            this.props.history.push("/");
        } catch (error) {
            console.error(error.response);
        }
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            setCurrentUser: this.setCurrentUser,
            userHasAuthenticated: this.userHasAuthenticated,
            checkTokens: this.checkTokens
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/"><h2>Project Manager</h2></Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated && this.state.user !== null ?
                                <Fragment>
                                    <LinkContainer to="/users">
                                        <NavItem>Users</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/account">
                                        <NavItem>{this.state.user.username}</NavItem>
                                    </LinkContainer>
                                    <NavItem onClick={this.handleLogout}>Logout</NavItem>
                                </Fragment>
                                : <Fragment>
                                    <LinkContainer to="/login">
                                        <NavItem>Login</NavItem>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <NavItem>Register</NavItem>
                                    </LinkContainer>
                                </Fragment>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Routes childProps={childProps}/>
            </div>
        );
    }
}

export default withRouter(App);
