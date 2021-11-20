import React from "react";
import {Redirect} from "react-router-dom";
import OrderType from "../../types/OrderType";
import api, {ApiResponse} from "../../api/api";
import {Button, Card, Container, Modal, Table} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import CartType from "../../types/CartType";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";

interface OrderPageState{
    isUserLoggedIn: boolean;
    orders: OrderType[];
    visible: boolean;
    cart?: CartType;
}

interface OrderDto{
    orderId:number;
    createdAt: string;
    status: "rejected" | "accepted" | "shipped" | "pending";
    cart: {
        cartId: number;
        createdAt: string;
        cartArticles:{
            quantity: number;
            article:{
                articleId: number;
                name: string;
                excerpt: string;
                isPromoted:number;
                category:{
                    categoryId:number;
                    name: string;
                }
                articlePrices: {
                    createdAt:string;
                    price: number;
                }[];
                photos:{
                    imagePath: string;
                }[];
            };
        }[];
    };
}

export default class OrderPage extends React.Component<any, any>{
    state:OrderPageState
    constructor(props: Readonly<{}>) {
        super(props);

        this.state={
            isUserLoggedIn:true,
            orders:[],
            visible: false,
        }
    }

    private setLoginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state,{
            isUserLoggedIn: isLoggedIn,
        }));
    }

    private setCartVisibleState(state: boolean){
        this.setState(Object.assign(this.state,{
            visible: state,
        }));
    }

    private setCartState(cart: CartType){
        this.setState(Object.assign(this.state,{
            cart: cart,
        }));
    }

    private setOrdersState(orders: OrderType[]){
        this.setState(Object.assign(this.state,{
            orders: orders
        }));
    }

    private hideCart(){
        this.setCartVisibleState(false);
    }

    private showCart(){
        this.setCartVisibleState(true);
    }

    componentDidMount() {
        this.getOrders();
    }

    componentDidUpdate() {
        this.getOrders();
    }

    private getOrders(){
        api('/api/user/cart/orders','get',{})
            .then((res:ApiResponse)=>{
                if (res.status === 'login' || res.status==='error') {
                    return this.setLoginState(false)
                }

               const data: OrderDto[]=res.data;

               const orders: OrderType[]=data.map(order=>({
                   orderId: order.orderId,
                   status: order.status,
                   createdAt: order.createdAt,
                   cart:{
                       cartId: order.cart.cartId,
                       user: null,
                       userId: 0,
                       createdAt: order.cart.createdAt,
                       cartArticles: order.cart.cartArticles.map(ca=>({
                           cartArticleId: 0,
                           articleId: ca.article.articleId,
                           quantity: ca.quantity,
                           article:{
                               articleId: ca.article.articleId,
                               name: ca.article.name,
                               category:{
                                   categoryId: ca.article.category.categoryId,
                                   name: ca.article.category.name,
                               },
                               articlePrices:ca.article.articlePrices.map(ap=>({
                                   articlePriceId: 0,
                                   createdAt: ap.createdAt,
                                   price: ap.price
                               }))
                           }
                       }))
                   }
               }));

               this.setOrdersState(orders);
            });
    }


    private getLatestPriceBeforeDate(article: any, latestDate: any){
        const cartTimestamp=new Date(latestDate).getTime();

        let price=article.articlePrices[0];

        for(let ap of article.articlePrices){
            const articlePricesTimestamp=new Date(ap.createdAt).getTime();

            if(articlePricesTimestamp<cartTimestamp){
                price=ap;
            }else{
                break;
            }
        }
        return price;
    }

    private calculateSum():number{
        let sum: number=0;

        if(this.state.cart===undefined){
            return sum;
        }else {

            for(const item of this.state.cart?.cartArticles){
                let price=this.getLatestPriceBeforeDate(item.article, this.state.cart.createdAt)

                sum+= price.price * item.quantity;
            }
        }

        return sum;
    }


    render() {
        if(!this.state.isUserLoggedIn){
            return (
                <Redirect to={"/user/login"}/>
            );
        }

        const sum=this.calculateSum();

        return (
            <Container>
                <RoleMeinMenu role="user"/>

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faBox}/> MyOrders
                        </Card.Title>
                        <Table hover size="sm">
                            <thead>
                            <tr>
                                <th>Created at</th>
                                <th>Status</th>
                                <th/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.orders.map(this.printOrderRow, this)}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={this.state.visible} onHide={()=>this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your shopping cart</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                            <tr>
                                <th>Category</th>
                                <th>Article</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.cart?.cartArticles.map(item=>{
                                const articlePrice=this.getLatestPriceBeforeDate(item.article, this.state.cart?.createdAt)
                                const price=Number(articlePrice.price).toFixed(2);
                                const total=Number(articlePrice.price * item.quantity).toFixed(2);

                                return (
                                    <tr>
                                        <td>{item.article.category.name}</td>
                                        <td>{item.article.name}</td>
                                        <td className="text-right">
                                            {item.quantity}
                                        </td>
                                        <td className="text-right">{price} EUR</td>
                                        <td className="text-right">{total} EUR</td>
                                    </tr>
                                )
                            }, this)}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td/>
                                <td/>
                                <td/>
                                <td className="text-right"><strong>Total:</strong></td>
                                <td className="text-right">{Number(sum).toFixed(2)} EUR</td>
                            </tr>
                            </tfoot>
                        </Table>
                    </Modal.Body>
                </Modal>
            </Container>
        )
    }
    
    private setAndShowCart(cart: CartType){
        this.setCartState(cart);
        this.showCart();
    }

    private printOrderRow(order: OrderType){
        return(
            <tr>
                <td>{order.createdAt}</td>
                <td>{order.status}</td>
                <td className="text-right">
                    <Button size="sm" variant="primary" onClick={()=> this.setAndShowCart(order.cart)}>
                        <FontAwesomeIcon icon={faBoxOpen}/>
                    </Button>
                </td>
            </tr>
        )
    }

}