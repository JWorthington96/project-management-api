import React, {Component} from "react";
import {PageHeader, ListGroup} from "react-bootstrap";
import "./Home.css";

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            projects: []
        };
    }
    
    renderProjectsList(projects){
        return null;
    }

    renderLander() {
        return (
            <div className="Home">
                <div className="lander">
                    <h1>Project Manager</h1>
                    <p>A project management app</p>
                </div>
            </div>
        );
    }

    renderProjects() {
        return (
            <div className="projects">
                <PageHeader>Your Projects</PageHeader>
                <ListGroup>
                    {!this.state.isLoading && this.renderProjectsList(this.state.projects)}
                </ListGroup>
            </div>
        );
    }

    render() {
        return (
            <div className="Home">
                {this.props.isAuthenticated ? this.renderProjects() : this.renderLander()}
            </div>
        );
    }
}