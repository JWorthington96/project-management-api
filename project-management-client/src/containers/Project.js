import React, {Component} from "react";
import {Tab, Tabs} from "react-bootstrap";
import ProjectSettings from "./ProjectSettings";
import ProjectView from "./ProjectView";
import {API} from "aws-amplify";
import "./Project.css";

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            project: null,
            title: "",
            description: "",
            projectManager: "",
            roles: [],
            users: []
        };
    }

    async componentDidMount() {
        try {
            const project = await this.getProject();
            const {title, description, projectManager, roles, users} = project;

            this.setState({
                isLoading: false,
                project,
                title,
                projectManager,
                description,
                roles,
                users
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    getProject() {
        return API.get("projects", `/projects/${this.props.match.params.id}`, {queryStringParameters: {
                identityId: this.props.user.identityId
            }
        });
    }

    renderLoading() {
        return(<h1>Loading...</h1>);
    }

    renderProject(){
        return (
            <div>
                <Tabs id="project-tab">
                    <Tab eventKey={1} title="View">
                        <ProjectView />
                    </Tab>
                    <Tab eventKey={2} title="Settings">
                        <ProjectSettings />
                    </Tab>
                </Tabs>
            </div>
        );
    }

    render() {
        return(
            <div className="Project">
                {this.state.isLoading ? this.renderLoading() : this.renderProject()}
            </div>

        );
    }
}