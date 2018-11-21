import React, {Component, Fragment} from 'react';
import {Navbar, Nav, NavItem} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import Routes from "./Routes";
import './App.css';
import {Auth} from "aws-amplify";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            isAuthenticating: true,
            user: {}
        };
        this.setCurrentUser = this.setCurrentUser.bind(this);
    };

    async componentDidMount() {
        try {
            const user = await Auth.currentSession();
            // this will be used to get the current user from a saved session
            await this.setCurrentUser(user);
            this.userHasAuthenticated(true);
        } catch (error) {
            if (error !== 'No current user') console.log(error);
        }

        this.setState({isAuthenticating: false,});
    };

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    };

    changeCurrentUser = user => {
        this.setState({user: user});
    }

    setCurrentUser = async event => {
        let user = await Auth.currentAuthenticatedUser();
        console.log(user.valueOf());
        this.changeCurrentUser(user);
    }

    handleLogout = async event => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.changeCurrentUser({});
        this.props.history.push("/");
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            user: this.state.user,
            changeCurrentUser: this.changeCurrentUser,
            userHasAuthenticated: this.userHasAuthenticated
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
                            {this.state.isAuthenticated ?
                                <Fragment>
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
