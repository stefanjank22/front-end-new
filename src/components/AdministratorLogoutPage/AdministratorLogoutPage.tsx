import React from "react";
import {Redirect} from "react-router-dom";
import {removeTokenData} from "../../api/api";

interface AdministratorLogoutPageState{
    done: boolean;
}

export class AdministratorLogoutPage extends React.Component<any, any>{
    state:AdministratorLogoutPageState;

    constructor(props: Readonly<any>) {
        super(props);

        this.state={
            done: false,
        };
    }

    finished(){
        this.setState({
            done:true,
        });
    }

    render() {
        if (this.state.done){
            return <Redirect to="/administrator/login/"/>
        }

        return (
            <p>Logging out...</p>
        );
    }

    componentDidMount() {
        this.doLogout();
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {

    }

    doLogout(){
        removeTokenData("administrator");
        this.finished();
    }

}