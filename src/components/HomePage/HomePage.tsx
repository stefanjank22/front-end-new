import React from 'react';
import {Card, Col, Container, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faListAlt} from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";
import {Redirect, Link} from "react-router-dom";
import api, {ApiResponse} from "../../api/api";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";
import ApiCategoryDto from "../../dtos/ApiCategoryDto";

interface HomePageState{
    isUserLoggedIn: boolean;
    categories: CategoryType[];
}

class HomePage extends React.Component{
    state: HomePageState;

    constructor(props: Readonly<{}>) {
        super(props);

        this.state={
            isUserLoggedIn: true,
            categories: []
        }

    }

    componentWillMount() {
        this.getCategories();
    }

    /*componentWillUpdate() {
        this.getCategories();

    }*///stavljam komentar da se ne bi beskonacno vrtelo

    private getCategories(){
        api('/api/category/?filter=parentCategoryId||$isnull ', 'get', {})
            .then((res: ApiResponse) => {
                if(res.status==="login"){
                    this.setLoginState(false);
                    return;
                }

                this.putCategoriesInState(res.data);
            });
    }

    private putCategoriesInState(data: ApiCategoryDto[]){
        const categories: CategoryType[] = data.map(category=>{
           return{
               categoryId: category.categoryId,
               name: category.name,
               items: [],
           };
        });

        const newState= Object.assign(this.state,{
            categories: categories
        });
        this.setState(newState);
    }

    private setLoginState(isLoggedIn: boolean){
        const newState= Object.assign(this.state,{
            isUserLoggedIn: isLoggedIn
        });

        this.setState(newState);
    }

    render() {
        if(!this.state.isUserLoggedIn){
            return (
                <Redirect to={"/user/login"}/>
            );
        }
        return (
            <Container>
            <RoleMeinMenu role="user"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt}/> Top level categories
                        </Card.Title>
                        <Row>
                        {this.state.categories.map(this.singleCategory)}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private singleCategory(category: CategoryType){
        return(
            <Col lg={3} md={4} sm={6} xs={12}>
                <Card className="mb-3">
                    <Card.Body>
                        <Card.Title as="p">{category.name}</Card.Title>
                        <Link to={`/category/${category.categoryId}`} className="btn btn-primary btn-block btn-sm">Open category</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}

export default HomePage;
