import React, {Component} from "react";
import {Checkbox, ControlLabel, Form, FormGroup, FormControl, ListGroup, ListGroupItem} from "react-bootstrap";
import DynamicDeveloperForm from "../components/DynamicDeveloperForm";
import LoadingButton from "../components/LoadingButton";
import {API} from "aws-amplify";
import "./NewProject.css";

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            isSubmitting: false,
            confirmDevelopers: true,
            siteUsers: [],
            title: "",
            description: "",
            developers: []
        };

        this.setDevelopers = this.setDevelopers.bind(this);
        this.confirmDevelopers = this.confirmDevelopers.bind(this);
    }

    async componentDidMount() {
        try {
            const users = await API.get("projects", "/users/list", {
                headers: {
                    Authorization: "Bearer " + this.props.user.auth.AccessToken
                }
            });

            let siteUsers = [];
            users.Users.map( (user) => {
                siteUsers.push(user.Username);
            });
            this.setState({siteUsers: siteUsers});
            console.log(this.state.siteUsers);
        } catch (error) {
            console.error(error.response);
        }
        this.setState({isLoading: false});
    };

    validateForm(){
        return this.state.title.length !==0 && this.state.description.length !== 0
            && this.state.projectManager.length !== 0 && this.state.confirmDevelopers;
    };

    setDevelopers(developers) {
        this.setState({developers: developers});
    };

    confirmDevelopers = boolean => {
        this.setState({confirmDevelopers: boolean});
    };

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    };

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isSubmitting: true});

        let users = [];
        for (let i = 0; i < this.state.developers.length; i++){
            users.push(this.state.developers[i]);
        }
        users.push(this.state.projectManager);

        try {
            const project = await this.createProject({
                title: this.state.title,
                projectManager: this.props.user.username,
                description: this.state.description,
                developers: this.state.developers,
                users: users
            });
            console.log(project);
            this.props.history.push("/");
        } catch (error) {
            console.error(error.response);
            this.setState({isSubmitting: false});
        }
    };

    createProject(project) {
        return API.post("projects", "/projects", {
            headers: {
                Authorization: "Bearer " + this.props.user.auth.AccessToken
            },
            body: project
        });
    }

    render() {
        return (
            <div className="NewProject">
                {!this.state.isLoading ?
                    <ListGroup>
                        <ListGroupItem>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup controlId="title">
                                    <ControlLabel>Title of project</ControlLabel>{': '}
                                    <FormControl onChange={this.handleChange} value={this.state.title}/>
                                </FormGroup>

                                <FormGroup controlId="description">
                                    <ControlLabel>Brief description</ControlLabel>{': '}
                                    <FormControl onChange={this.handleChange}
                                                 value={this.state.description}
                                                 componentClass="textarea" />
                                </FormGroup>

                                <FormGroup>
                                    <LoadingButton type="submit"
                                                   isLoading={this.state.isSubmitting}
                                                   text="Create"
                                                   loadingText="Creating..."
                                                   disabled={!this.validateForm()} />
                                </FormGroup>
                            </Form>
                        </ListGroupItem>

                        <ListGroupItem>
                            <h4>*OPTIONAL* Add known developers</h4>
                            <DynamicDeveloperForm setDevelopers={this.setDevelopers}
                                                  confirmDevelopers={this.confirmDevelopers}
                                                  name={this.state.title}
                                                  description={this.state.description}
                                                  projectManager={this.props.user.username}
                                                  siteUsers={this.state.siteUsers} />
                        </ListGroupItem>
                    </ListGroup>
                    :
                    <h2>Loading...</h2>
                }
            </div>
        );
    }
}