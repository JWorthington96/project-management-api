import React, {Component} from "react";
import {Button, ControlLabel, Form, FormControl, FormGroup, Glyphicon, ListGroupItem} from "react-bootstrap"
import {API} from "aws-amplify";

// Component to allow the admin to add developers when creating the project
export default class DynamicDeveloperForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentId: 0,
            currentDevelopers: []
        };

        this.addDeveloper = this.addDeveloper.bind(this);
        this.changeDeveloper = this.changeDeveloper.bind(this);
        this.deleteDeveloper = this.deleteDeveloper.bind(this);
    }

    addDeveloper(developer) {
        const id = this.state.currentId;
        const devs = this.state.currentDevelopers;
        console.log(devs.valueOf());
        devs[id] = {username: developer};

        if (this.props.developers === undefined){
            this.props.confirmDevelopers(true);
        } else if (devs.length !== this.props.developers.length) {
            this.props.confirmDevelopers(false);
        }
        this.setState({currentId: id + 1, currentDevelopers: devs});
    }

    changeDeveloper(id, developer) {
        const devs = this.state.currentDevelopers;
        devs[id] = {username: developer};
    }

    deleteDeveloper(id) {
        const devs = this.state.currentDevelopers;
        devs.splice(id, 1);
        if (devs.length === 0) this.props.confirmDevelopers(true);
        this.setState({currentId: devs.length, currentDevelopers: devs});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.setDevelopers(this.state.currentDevelopers);
        this.props.confirmDevelopers(true);
    };

    render() {
        return (
            <div className="developers">
                <Form onSubmit={this.handleSubmit}>
                    <DeveloperFormList
                        developers={this.state.currentDevelopers}
                        changeDeveloper={this.changeDeveloper}
                        deleteDeveloper={this.deleteDeveloper}
                    />
                    <NewDeveloperForm addDeveloper={this.addDeveloper}/>
                    <Button type="submit"
                            disabled={this.state.confirmDevelopers}>
                        Confirm developers
                    </Button>
                </Form>
            </div>
        );
    }
}

// React component to render all the currently added developers
class DeveloperFormList extends Component {
    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleChange = event => {
        const id = Number(event.target.id);
        const value = event.target.value;
        this.props.changeDeveloper(id, value);
    };

    handleDelete = event => {
        const id = Number(event.target.id);
        this.props.deleteDeveloper(id);
    };

    render() {
        return this.props.developers.map( (developer, i) =>
            <ListGroupItem key={i}>
                <FormGroup controlId={i.toString()}>
                    {console.log(i)}
                    {console.log(developer.username)}
                    <ControlLabel>Developer {i + 1}</ControlLabel>
                    <FormControl onChange={this.handleChange} value={developer.username} />
                </FormGroup>

                <Button id={i.toString()} onClick={this.handleDelete}>
                    <Glyphicon glyph="minus"/>
                </Button>
            </ListGroupItem>
        );
    }
}

// React component to render a new developer form
class NewDeveloperForm extends Component {
    //TODO: add a way to check the developer exists in the user base
    constructor(props){
        super(props);
        this.state = {
            newDeveloper: ""
        };
    }

    handleChange = event => {
        this.setState({newDeveloper: event.target.value});
    };

    handleAdd = event => {
        event.preventDefault();
        this.props.addDeveloper(this.state.newDeveloper);
        this.setState({newDeveloper: ""});
    };

    validateForm(){
        return this.state.newDeveloper.length > 0;
    }

    render() {
        return (
            <ListGroupItem>
                <FormGroup controlId="newDeveloper">
                    <ControlLabel>New developer</ControlLabel>
                    <FormControl onChange={this.handleChange} value={this.state.newDeveloper} />
                </FormGroup>

                <Button disabled={!this.validateForm()} onClick={this.handleAdd}>
                    <Glyphicon glyph="plus" />
                </Button>
            </ListGroupItem>
        );
    }
}