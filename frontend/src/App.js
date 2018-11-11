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
            sAuthenticated: false,
            isAuthenticating: true
        };
    };

    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        } catch (error) {
            if (error != 'No current user') alert(error);
        }

        this.setState({isAuthenticating: false});
    };

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    };

    handleLogout = async e => {
        await Auth.signOut();
        this.userHasAuthenticated(false);
        this.props.history.push("/");
    };

    render() {
        const childProps = {
            isAuthenticated: this.state.isAuthenticated,
            userHasAuthenticated: this.userHasAuthenticated
        };

        return (
            !this.state.isAuthenticating &&
            <div className="App">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Project Manager</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle/>
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            {this.state.isAuthenticated ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
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
