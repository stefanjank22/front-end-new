import React from "react";
import {Card, Container} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faListAlt} from "@fortawesome/free-solid-svg-icons";
import CategoryType from "../../types/CategoryType";

interface CategoryPageProperties{
    match:{
        params: {
            cId: number;
        }
    }
}

interface CategoryPageState{
    category?: CategoryType;
}

export default class CategoryPage extends React.Component<CategoryPageProperties>{
    state: CategoryPageState;

    constructor(props: CategoryPageProperties | Readonly<CategoryPageProperties>) {
        super(props);

        this.state={ };
    }

    render() {
        return (
            <Container>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faListAlt}/> {this.state.category?.name}
                        </Card.Title>
                    </Card.Body>
                    <Card.Text>
                        Here, we will have out articles...
                    </Card.Text>
                </Card>
            </Container>
        );
    }

    componentWillMount() {
        this.getCategoryData();
    }

    componentWillReceiveProps(nextProps: Readonly<CategoryPageProperties>, nextContext: any) {
        if(nextProps.match.params.cId===this.props.match.params.cId){
            return;
        }
        this.getCategoryData();
    }

    getCategoryData(){
        setTimeout(()=>{
            const data: CategoryType={
                name:'Category '+ this.props.match.params.cId,
                categoryId: this.props.match.params.cId,
                items:[]
            };

            this.setState({
                category:data,
            })
        },210);
    }
}



