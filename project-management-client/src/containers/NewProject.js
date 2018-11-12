import React, {Component} from "react";
import {Form, FormGroup, FormControl, ControlLabel} from "react-bootstrap";
import {API} from "aws-amplify";
import "./NewProject.css";
import LoadingButton from "../components/LoadingButton";

export default class NewProject extends Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: null,
            name: "",
            description: ""
        };
    }

    validateForm() {
        return this.state.name.length > 0 & this.state.description.length > 0;
    }

    handleChange = event => {
        this.setState({[event.target.id]: event.target.value});
    }


    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});
        try {
            await this.createProject({name: this.state.name, description: this.state.description});
            this.props.history.push("/");
        } catch (error) {
            alert(error);
            this.setState({isLoading: false});
        }
    }

    createProject(project) {
        return API.post("projects", "/projects", {body: project});
    }

    render() {
        return (
            <div className="NewProject">
                <Form inline onSubmit={this.handleSubmit}>
                    <FormGroup controlId="name">
                        <ControlLabel>Name of project</ControlLabel>{': '}
                        <FormControl onChange={this.handleChange} value={this.state.name} />
                    </FormGroup>
                    <FormGroup controlId="description">
                        <ControlLabel>Brief description</ControlLabel>{': '}
                        <FormControl onChange={this.handleChange}
                                     value={this.state.description}
                                     componentClass="textarea" />
                    </FormGroup>
                    <LoadingButton
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Create"
                        loadingText="Creating..."
                        disabled={!this.validateForm}
                    />
                </Form>
            </div>
        )
    }
}