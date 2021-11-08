import React from "react";
import {Card, Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";

export class UserLoginPage extends React.Component{
    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faSignInAlt}/> User login
                        </Card.Title>
                    </Card.Body>
                    <Card.Text>
                        ... the form will be shown here ...
                    </Card.Text>
                </Card>
            </Container>
        );
    }
}