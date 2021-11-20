import React from "react";
import {Alert, Button, Card, Col, Container, Form} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import api, {ApiResponse, saveIdentity, saveRefreshToken, saveToken} from "../../api/api";
import {Redirect} from "react-router-dom";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";

interface AdministratorLoginPageState{
    username: string;
    password: string;
    errorMessage: string;
    isLoggedIn: boolean;
}

export class AdministratorLoginPage extends React.Component{
    state: AdministratorLoginPageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state={
            username: '',
            password:'',
            errorMessage:'',
            isLoggedIn: false
        }
    }

    private formInputChanged(event: React.ChangeEvent<HTMLInputElement>){
        const newState=Object.assign(this.state,{
            [ event.target.id] : event.target.value
        });

        this.setState(newState);
    }

    private setErrorMessage(message: string){
        const newState= Object.assign(this.state,{
            errorMessage: message
        });

        this.setState(newState);
    }

    private setLoginState(isLoggedIn: boolean){
        const newState= Object.assign(this.state,{
            isLoggedIn: isLoggedIn
        });

        this.setState(newState);
    }

    private doLogin(){
        api('auth/administrator/login', 'post', {
            username: this.state.username,
            password: this.state.password
        }).then((res: ApiResponse) => {
            if(res.status==='error'){
                this.setErrorMessage('System error... Try again!')
                return;
            }

            if(res.status==='ok'){
                if(res.data.statusCode !== undefined){
                    let message='';

                    switch (res.data.statusCode){
                        case -3001: message='Unknown username!'; break;
                        case -3002: message='Bad password!'; break;
                    }
                    this.setErrorMessage(message);
                    return;
                }

                saveToken('administrator', res.data.token);
                saveRefreshToken('administrator', res.data.refreshToken);
                saveIdentity('administrator', res.data.identity);

                //Preusmeriti korisnika.../#/
                this.setLoginState(true);
            }
        })
    }

    render() {
        if(this.state.isLoggedIn){//ako je true
            return (
                <Redirect to={"/administrator/dashboard"}/>
            );
        }
        return (
            <Container>
                <RoleMeinMenu role="visitor"/>

                <Col md={{span: 6, offset: 3}}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <FontAwesomeIcon icon={faSignInAlt}/> Administrator login
                            </Card.Title>
                            <Form>
                                <Form.Group>
                                    <Form.Label htmlFor="username">Username:</Form.Label>
                                    <Form.Control type="text" id="username"
                                                  value={this.state.username} onChange={event=>this.formInputChanged(event as any)}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label htmlFor="password">Password:</Form.Label>
                                    <Form.Control type="password" id="password"
                                                  value={this.state.password} onChange={event=>this.formInputChanged(event as any)}/>
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="primary" onClick={()=>this.doLogin()}>Log in</Button>
                                </Form.Group>
                            </Form>
                            <Alert variant={"danger"}
                                   className={this.state.errorMessage ? '' : 'd-none'}>
                                {this.state.errorMessage}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Container>
        );
    }
}