import React from "react";
import {Redirect} from "react-router-dom";
import {removeTokenData} from "../../api/api";

interface UserLogoutPageState{
    done: boolean;
}

export class UserLogoutPage extends React.Component<any, any>{
    state:UserLogoutPageState;

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
            return <Redirect to="/user/login/"/>
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
        removeTokenData("user");
        this.finished();
    }

}