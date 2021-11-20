import React from "react";
import {MainMenu, MainMenuItem} from '../MainMenu/MainMenu'

interface RoleMeinMenuProperties{
    role: 'user' | 'administrator' | 'visitor'
}

export default class RoleMeinMenu extends React.Component<RoleMeinMenuProperties>{
    render() {
        let items: MainMenuItem[];

        switch (this.props.role){
            case 'visitor' : items=this.getVisitorsMenuItems(); break;
            case 'user' : items=this.getUserMenuItems(); break;
            case 'administrator' : items=this.getAdministratorMenuItems(); break;
        }

        let showCart=false;

        if(this.props.role==='user'){
            showCart=true;
        }

        return <MainMenu items={items} showCart={showCart}/>
    }

    getUserMenuItems():MainMenuItem[]{
        return[
            new MainMenuItem("Home","/"),
            new MainMenuItem("Contact","/contact"),
            new MainMenuItem("MyOrders","/user/orders"),
            new MainMenuItem("Log out","/user/logout")

        ];
    }

    getAdministratorMenuItems():MainMenuItem[]{
        return[
            new MainMenuItem("Dashboard","/administrator/dashboard"),
            new MainMenuItem("Log out","/administrator/logout")
        ];
    }

    getVisitorsMenuItems():MainMenuItem[]{
        return[
            new MainMenuItem("Register","/user/register"),
            new MainMenuItem("User log in","/user/login"),
            new MainMenuItem("Administrator log in","/administrator/login")
        ];
    }
}