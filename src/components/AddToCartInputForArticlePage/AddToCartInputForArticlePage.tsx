import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import api, {ApiResponse} from "../../api/api";
import ApiArticleDto from "../../dtos/ApiArticleDto";

interface AddToCartInputProperties {
    article: ApiArticleDto | undefined;
}

interface AddToCartInputState {
    quantity: number;
}

export default class AddToCartInputForArticlePage extends React.Component<AddToCartInputProperties> {
    state: AddToCartInputState;

    constructor(props: AddToCartInputProperties | Readonly<AddToCartInputProperties>) {
        super(props);

        this.state = {
            quantity: 1,
        }
    }

    private quantityChanged(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            quantity: Number(event.target.value),
        });
    }

    private addToCart() {
        if(this.props.article===undefined){
            return;
        }

        const data = {
            articleId: this.props.article.articleId,
            quantity: this.state.quantity
        };

        api('api/user/cart/addToCart', 'post', data)
            .then((res: ApiResponse) => {
                if (res.status === 'error' || res.status === 'login') {
                    return;
                }

                const event = new CustomEvent('cart.update');
                window.dispatchEvent(event);
            });
    }

    render() {
        return (
            <Form.Group>
                <Row>
                    <Col xs={7}>
                        <Form.Control type="number" min={1} step={1} value={this.state.quantity}
                                      onChange={(event => this.quantityChanged(event as any))}/>
                    </Col>
                    <Col xs={5}>
                        <Button variant={"secondary"} onClick={() => this.addToCart()}>Buy</Button>
                    </Col>
                </Row>
            </Form.Group>
        );
    }
}