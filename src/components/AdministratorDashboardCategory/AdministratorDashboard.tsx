import React from 'react';
import {Card, Container} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHome} from "@fortawesome/free-solid-svg-icons";
import {Redirect} from "react-router-dom";
import api, {ApiResponse} from "../../api/api";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";
import {Link} from "react-router-dom";

interface AdministratorDashboardState{
    isAdministratorLoggedIn: boolean;
}


class AdministratorDashboard extends React.Component{
    state: AdministratorDashboardState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state={
            isAdministratorLoggedIn: true,
        }

    }

    componentWillMount() {
        this.getMyData();
    }

    componentWillUpdate() {
        this.getMyData();

    }

    private getMyData(){
        api('api/administrator/','get',{},'administrator')
            .then((res: ApiResponse)=>{
                if(res.status==="error" || res.status==="login") {
                    this.setLoginState(false);
                    return;
                }
            });
    }

    private setLoginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state,{
            isAdministratorLoggedIn: isLoggedIn
        }));

    }

    render() {
        if(!this.state.isAdministratorLoggedIn){
            return (
                <Redirect to={"/administrator/login"}/>
            );
        }
        return (
            <Container>
                <RoleMeinMenu role="administrator"/>

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faHome}/> Administrator Dashboard
                        </Card.Title>
                        <ul>
                            <li><Link to="/administrator/dashboard/category">Categories</Link></li>
                            <li><Link to="/administrator/dashboard/feature">Features</Link></li>
                            <li><Link to="/administrator/dashboard/article">Articles</Link></li>
                        </ul>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

}

export default AdministratorDashboard;
