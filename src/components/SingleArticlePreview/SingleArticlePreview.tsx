import React from "react";
import {Card, Col} from "react-bootstrap";
import CardHeader from "react-bootstrap/CardHeader";
import {ApiConfig} from "../../config/api.config";
import {Link} from "react-router-dom";
import ArticleType from "../../types/ArticleType";
import AddToCartInput from "../AddToCartInput/AddToCartInput";

interface SingleArticlePreviewProperties{
    article: ArticleType
}


export default class SingleArticlePreview extends React.Component<SingleArticlePreviewProperties>{

    constructor(props: SingleArticlePreviewProperties | Readonly<SingleArticlePreviewProperties>) {
        super(props);

    }

    render() {
        return (
            <Col lg={4} md={6} sm={6} xs={12}>
                <Card className="mb-3">
                    <CardHeader>
                        <img src={ApiConfig.PHOTO_PATH + 'small/' + this.props.article.imageUrl} alt={this.props.article.name}
                             className="w-100"/>
                    </CardHeader>
                    <Card.Body>
                        <Card.Title as="p"><strong>{this.props.article.name}</strong></Card.Title>
                        <Card.Text>
                            {this.props.article.excerpt}
                        </Card.Text>
                        <Card.Text>
                            Price:{Number(this.props.article.price).toFixed(2)} EUR
                        </Card.Text>

                        <AddToCartInput article={this.props.article}/>

                        <Link to={`/article/${this.props.article.articleId}`} className="btn btn-primary btn-block btn-sm">Open
                            article page</Link>
                    </Card.Body>
                </Card>
            </Col>
        );
    }
}