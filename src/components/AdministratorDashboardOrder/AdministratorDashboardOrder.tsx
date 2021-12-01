import React from "react";
import ApiOrderDto from "../../dtos/ApiOrderDto";
import api, {ApiResponse} from "../../api/api";
import {Redirect} from "react-router-dom";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";
import {Button, Card, Container, Modal, Tab, Table, Tabs} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxOpen, faCartArrowDown} from "@fortawesome/free-solid-svg-icons";
import CartType from "../../types/CartType";
import OrderType from "../../types/OrderType";

interface AdministratorDashboardOrderState{
    isAdministratorLoggedIn: boolean;
    cartVisible: boolean;
    orders: ApiOrderDto[];
    cart?: CartType;
}

export default class AdministratorDashboardOrder extends React.Component<any, any>{
    state: AdministratorDashboardOrderState;

    constructor(props: Readonly<any>) {
        super([props]);

        this.state={
            isAdministratorLoggedIn: true,
            cartVisible: false,
            orders: [],
        };
    }

    private setOrders(orders: ApiOrderDto[]) {
        this.setState(Object.assign(this.state, {
            orders: orders,
        }));
    }

    private setLoginState(isLoggedIn: boolean) {
        this.setState(Object.assign(this.state, {
            isAdministratorLoggedIn: isLoggedIn
        }));
    }

    private setCartVisibleState(state: boolean){
        this.setState(Object.assign(this.state,{
            cartVisible: state,
        }));
    }

    private setCartState(cart: CartType){
        this.setState(Object.assign(this.state,{
            cart: cart,
        }));
    }

    private hideCart(){
        this.setCartVisibleState(false);
    }

    private showCart(){
        this.setCartVisibleState(true);
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
    reloadOrders(){
        api('/api/order', 'get',{},'administrator')
            .then((res:ApiResponse)=>{
                if (res.status === "error" || res.status === "login") {
                    this.setLoginState(false);
                    return;
                }

                const data: ApiOrderDto[]=res.data;

                this.setOrders(data);
            });
    }

    componentDidMount() {
        this.reloadOrders();
    }

    changeStatus(orderId: number, newStatus: "pending" | "rejected" | "accepted" | "shipped"){
        api('/api/order/'+orderId, 'patch',{newStatus},'administrator')
            .then((res:ApiResponse)=> {
                if (res.status === "error" || res.status === "login") {
                    this.setLoginState(false);
                    return;
                }

                this.reloadOrders();
            });
    }

    private setAndShowCart(cart: CartType){
        this.setCartState(cart);
        this.showCart();
    }

    renderOrders(withStatus: "pending" | "rejected" | "accepted" | "shipped"){
        return(
            <Table hover size="sm" bordered>
                <thead>
                <tr>
                    <th className="text-right">Order ID</th>
                    <th>Date</th>
                    <th>Cart</th>
                    <th>Options</th>
                </tr>
                </thead>
                <tbody>
                {this.state.orders.filter(order=>order.status===withStatus).map(order=>(
                    <tr>
                        <td className="text-right">{order.orderId}</td>
                        <td>{order.createdAt.substring(0,10)}</td>
                        <td>
                            <Button size="sm" variant="primary" onClick={()=> this.setAndShowCart(order.cart)}>
                                <FontAwesomeIcon icon={faBoxOpen}/>
                            </Button>
                        </td>
                        <td>
                            {this.printStatusChangeButtons(order)}
                        </td>
                    </tr>
                ), this)}
                </tbody>
            </Table>
        )
    }

    render() {
        if (!this.state.isAdministratorLoggedIn) {
            return (
                <Redirect to={"/administrator/login"}/>
            );
        }

        const sum=this.calculateSum();

        return (
            <Container>
                <RoleMeinMenu role="administrator"/>

                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faCartArrowDown}/> Orders
                        </Card.Title>

                        <Tabs defaultActiveKey="pending" id="order-tabs">
                            <Tab eventKey="pending" title="Pending">
                                {this.renderOrders("pending")}
                            </Tab>
                            <Tab eventKey="accepted" title="Accepted">
                                {this.renderOrders("accepted")}
                            </Tab>
                            <Tab eventKey="shipped" title="Shipped">
                                {this.renderOrders("shipped")}
                            </Tab>
                            <Tab eventKey="rejected" title="Rejected">
                                {this.renderOrders("rejected")}
                            </Tab>
                        </Tabs>


                    </Card.Body>
                </Card>

                <Modal size="lg" centered show={this.state.cartVisible} onHide={()=>this.hideCart()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Order content</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Table hover size="sm">
                            <thead>
                            <tr>
                                <th>Category</th>
                                <th>Article</th>
                                <th className="text-right">Quantity</th>
                                <th className="text-right">Price</th>
                                <th className="text-right">Total</th>
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
        );
    }

    printStatusChangeButtons(order: OrderType){
        if(order.status==='pending'){
            return (
                <>
                    <Button type="button" variant="primary" size="sm" className="mr-1"
                            onClick={()=>this.changeStatus(order.orderId,'accepted')}>Accept</Button>
                    <Button type="button" variant="danger" size="sm"
                            onClick={()=>this.changeStatus(order.orderId,'rejected')}>Rejected</Button>
                </>
            )
        }

        if(order.status==='accepted'){
            return (
                <>
                    <Button type="button" variant="primary" size="sm" className="mr-1"
                            onClick={()=>this.changeStatus(order.orderId,'shipped')}>Ship</Button>
                    <Button type="button" variant="secondary" size="sm"
                            onClick={()=>this.changeStatus(order.orderId,'pending')}>Return to pending</Button>
                </>
            )
        }

        if(order.status==='shipped'){
            return (
                <>

                </>
            )
        }

        if(order.status==='accepted'){
            return (
                <>
                    <Button type="button" variant="secondary" size="sm"
                            onClick={()=>this.changeStatus(order.orderId,'pending')}>Return to pending</Button>
                </>
            )
        }
    }
}