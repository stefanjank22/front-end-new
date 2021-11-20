import React from "react";
import {Card, Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPhone} from "@fortawesome/free-solid-svg-icons";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";

export class ContactPage extends React.Component{
    render() {
        return (
            <Container>
              <RoleMeinMenu role="user"/>

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faPhone}/> Contact details
                        </Card.Title>
                    </Card.Body>
                    <Card.Text>
                        Contact details will be show here...
                    </Card.Text>
                </Card>

            </Container>
        );
    }
}