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
            await Auth.currentSession();
            this.userHasAuthenticated(true);
            this.setCurrentUser();
        } catch (error) {
            if (error !== 'No current user') console.log(error);
        }

        this.setState({isAuthenticating: false,});
    };

    userHasAuthenticated = authenticated => {
        this.setState({isAuthenticated: authenticated});
    };

    setCurrentUser = async event => {
        let user = {};
        if (this.state.isAuthenticating) {
            try {
                user = await Auth.currentAuthenticatedUser();
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("User has not been collected")
        }
        console.log(user.valueOf());
        this.setState({user: user});
    }

    handleLogout = async event => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.setCurrentUser({});
        this.props.history.push("/");
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            //setCurrentUser: this.setCurrentUser,
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
