import React, {Component} from "react";
import {Button, ControlLabel, Form, FormGroup, FormControl} from "react-bootstrap";
import {API} from "aws-amplify";

export default class RegisterConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        }
    }

    handleChange = event => {
        this.setState({code: event.target.value});
    }

    handleSubmit = async event => {
        event.preventDefault();
        this.setState({isLoading: true});

        try {
            await API.post("projects", "/register/confirm", {body: {
                    Username: this.props.Username,
                    ConfirmationCode: this.state.code
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return (
            <div className="RegisterConfirm">
                <h1>Thank you for registering!</h1>
                <h3>Please find the confirmation code in your email and enter it below</h3>
                <Form type="submit"
                      onSubmit={this.handleSubmit} >
                    <FormGroup>
                        <ControlLabel>Confirmation code</ControlLabel>
                        <FormControl value={this.state.code}
                                     onChange={this.handleChange}/>
                        <Button type="submit">
                            Confirm
                        </Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }
}