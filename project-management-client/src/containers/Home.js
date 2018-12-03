import React, {Component} from "react";
import {PageHeader, ButtonToolbar, Button, Glyphicon, ListGroup, ListGroupItem, Tabs, Tab} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {API} from "aws-amplify";
import "./Home.css";

export default class Home extends Component {
    constructor(props){
        super(props);
        this.state = {
            isLoading: true,
            projects: [],
            allProjects: []
        };
    }

    async componentDidMount() {
        if (!this.props.isAuthenticated) return;

        try {
            await this.props.checkTokens();
            console.log(this.props.user);

            let allProjects = [];
            if (this.props.user.admin) {
                allProjects = await API.get("projects", "/projects/all", {
                    headers: {
                        Authorization: "Bearer " + this.props.user.auth.AccessToken
                    }
                });
            }
            const projects = await API.get("projects", "/projects", {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                },
                queryStringParameters: {
                    username: this.props.user.username
                }
            });
            console.log(projects);
            this.setState({
                projects: projects,
                allProjects: allProjects
            });
        } catch (error) {
            console.error(error.response);
        }

        this.setState({isLoading: false});
    }

    addProject = event => {
        event.preventDefault();
        this.props.history.push("/projects/new");
    };

    handleProjectClick = event => {
        event.preventDefault();
        this.props.push(event.currentTarget.getAttribute("href"));
    };
    
    renderProjectsList(projects){
        return projects.map( (project) =>
                <LinkContainer key={project.projectId} to={`/projects/${project.projectId}`}>
                    <ListGroupItem header={project.title}>
                        {"Created: " + new Date(project.createdAt).toLocaleString()} <br/>
                        Project manager: {project.projectManager}
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

    renderAllProjects() {
        return (
            <div className="all-projects">
                <PageHeader>All Projects</PageHeader>
                <ListGroup className="projects-list">
                    {!this.state.isLoading && this.renderProjectsList(this.state.allProjects)}
                </ListGroup>
            </div>
        );
    }

    // if the user is not authenticated it will render the lander, else if the user is an admin it will render
    // "Your Projects" and "All Projects" as separate tabs, otherwise it will just render "Your Projects"
    render() {
        return (
            <div className="Home">
                {!this.props.isAuthenticated ? this.renderLander() :
                    this.props.user.admin ?
                <Tabs activeKey={this.state.activeKey}
                      onSelect={this.handleSelect}
                      id="tabs" >
                    <Tab eventKey={1} title="Your projects">
                        {this.renderProjects()}
                    </Tab>
                    <Tab eventKey={2} title="All projects">
                        {this.renderAllProjects()}
                    </Tab>
                </Tabs> :
                        this.renderProjects()}
            </div>
        );
    }
}