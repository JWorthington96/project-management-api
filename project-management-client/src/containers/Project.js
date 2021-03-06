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
            siteUsers: [],
            project: {}
        };
    }

    async componentDidMount() {
        try {
            await this.props.checkTokens();
            const project = await this.getProject();
            const users = await API.get("projects", "/users/list", {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                }
            });
            //console.log(users.Users);

            this.setState({
                isLoading: false,
                siteUsers: users.Users,
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
                {this.state.project.projectManager === this.props.user.username || this.props.user.admin ?
                    <Tabs id="project-tab">
                        <Tab eventKey={1} title="View">
                            <ProjectView project={this.state.project} siteUsers={this.state.siteUsers} />
                        </Tab>
                        <Tab eventKey={2} title="Settings">
                            <ProjectSettings project={this.state.project}
                                             hist={this.props.history}
                                             match={this.props.match}
                                             user={this.props.user}
                                             siteUsers={this.state.siteUsers}
                                             checkTokens={this.props.checkTokens} />
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