import React, {Component} from "react";
import {PageHeader, ButtonToolbar, Button, Glyphicon, ListGroup, ListGroupItem} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {API} from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            projects: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) return;

        try {
            const projects = await this.projects();
            this.setState({projects});
        } catch (error) {
            console.log(error);
        }

        this.setState({isLoading: false});
    }

    projects() {
        return API.get("projects", "/projects", {});
    }

    addProject = event => {
        event.preventDefault();
        this.props.history.push("/projects/new");
    }

    handleProjectClick = event => {
        event.preventDefault();
        this.props.push(event.currentTarget.getAttribute("href"));
    }
    
    renderProjectsList(projects){
        return projects.map( (project) =>
                <LinkContainer key={project.projectId} to={`/projects/${project.projectId}`}>
                    <ListGroupItem header={project.title}>
                        {"Created: " + new Date(project.createdAt).toLocaleString()}
                        <p>Project manager: {project.projectManager}</p>
                    </ListGroupItem>
                </LinkContainer>
        );
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
                <ButtonToolbar className="toolbar">
                    <Button onClick={this.addProject}>
                        <Glyphicon glyph="plus" />
                    </Button>
                </ButtonToolbar>
                <ListGroup className="projects-list">
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