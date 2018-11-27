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
            project: {}
        };
    }

    async componentDidMount() {
        try {
            const project = await this.getProject();
            console.log(project);

            this.setState({
                isLoading: false,
                project
            });
        } catch (error) {
            console.log(error.response);
        }
    }

    getProject() {
        return API.get("projects", `/projects/${this.props.match.params.id}`, {
            headers: {
                Authorization: "Bearer " + this.props.user.auth.AccessToken
            }
        });
    }

    renderLoading() {
        return(<h1>Loading...</h1>);
    }

    renderProject(){
        return (
            <div>
                {this.state.project.projectManager === this.props.user.username ?
                    <Tabs id="project-tab">
                        <Tab eventKey={1} title="View">
                            <ProjectView project={this.state.project} />
                        </Tab>
                        <Tab eventKey={2} title="Settings">
                            <ProjectSettings project={this.state.project}
                                             hist={this.props.history}
                                             match={this.props.match}
                                             user={this.props.user} />
                        </Tab>
                    </Tabs> :
                    <ProjectView project={this.state.project}/>
                }
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