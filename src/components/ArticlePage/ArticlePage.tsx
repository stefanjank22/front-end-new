import React from "react";
import ApiArticleDto from "../../dtos/ApiArticleDto";
import api, {ApiResponse} from "../../api/api";
import {Redirect} from "react-router-dom";
import {Card, Col, Container, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";
import {ApiConfig} from "../../config/api.config";
import AddToCartInput from "../AddToCartInput/AddToCartInput";

interface ArticlePageProperties {
    match: {
        params: {
            aId: number;
        }
    }
}

interface ArticlePageState{
    isUserLoggedIn: boolean;
    message: string;
    article?: ApiArticleDto;
    features: FeatureData[];
}

interface FeatureData{
    name: string;
    value: string;
}

export default class ArticlePage extends React.Component<ArticlePageProperties>{
    state: ArticlePageState;

    constructor(props: Readonly<ArticlePageProperties>) {
        super(props);

        this.state={
            isUserLoggedIn: true,
            message: '',
            features: [],
        }

    }

    private setLoginState(isLoggedIn: boolean) {
        const newState = Object.assign(this.state, {
            isUserLoggedIn: isLoggedIn
        });

        this.setState(newState);
    }

    private setMessage(message: string) {
        const newState = Object.assign(this.state, {
            message: message
        });

        this.setState(newState);
    }

    private setArticleData(articleData: ApiArticleDto | undefined) {
        const newState = Object.assign(this.state, {
            article: articleData,
        });

        this.setState(newState);
    }

    private setFeatureData(features: FeatureData[]) {
        const newState = Object.assign(this.state, {
            features: features,
        });

        this.setState(newState);
    }

    componentDidMount() {
        this.getArticleData();
    }

    componentDidUpdate(prevProps: Readonly<ArticlePageProperties>, prevState: Readonly<{}>, snapshot?: any) {
        if (prevProps.match.params.aId === this.props.match.params.aId) {
            return;
        }
        this.getArticleData();
    }

    getArticleData(){
        api('api/article/' + this.props.match.params.aId, 'get', {})
            .then((res: ApiResponse) => {
                if (res.status === 'login') {
                    return this.setLoginState(false)
                }

                if (res.status === 'error') {
                    return this.setMessage('This article does not exist!');
                    this.setArticleData(undefined);
                    this.setFeatureData([]);

                }

                const data: ApiArticleDto=res.data;

                this.setArticleData(data);

                const features: FeatureData[]=[];

                for(const articleFeature of data.articleFeatures){
                    const value=articleFeature.value;
                    let name='';

                    for(const feature of data.features){
                        if(feature.featureId===articleFeature.featureId){
                            name=feature.name;
                            break;
                        }
                    }

                    features.push({name, value});
                }


                this.setFeatureData(features);


            });
    }

    private printOptionalMessage() {
        if (this.state.message !== '') {
            return;
        }
        return (
            <Card.Text>
                {this.state.message}
            </Card.Text>
        );
    }

    render() {
        if (!this.state.isUserLoggedIn) {
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
                            <FontAwesomeIcon icon={faBoxOpen}/> {this.state.article?.name}
                        </Card.Title>
                        {this.printOptionalMessage()}

                        {
                            this.state.article?
                                (this.renderArticleData(this.state.article)):
                                ''
                        }

                    </Card.Body>
                </Card>
            </Container>

        );
    }

    renderArticleData(article: ApiArticleDto){
        return(
            <Row>
                <Col xs={12} lg={8}>
                    <div className="excerpt">
                        {article.excerpt}
                    </div>

                    <hr/>

                    <div className="description">
                        {article.description}
                    </div>

                    <hr/>

                    <b>Features:</b><br/>

                    <ul>
                        {this.state.features.map(feature=>(
                            <li>
                                {feature.name}: {feature.value}
                            </li>
                        ),this)}
                    </ul>

                </Col>

                <Col xs={12} lg={4}>
                    <Row>
                        <Col xs={12}>
                            <img src={ApiConfig.PHOTO_PATH+'small/'+article.photos[0].imagePath}
                                 alt={'Image - '+ article.photos[0].photoId}
                                 className="w-100"/>
                        </Col>
                    </Row>

                    <Row>
                        {article.photos.slice(1).map(photo=>(
                            <Col xs={12} sm={6}>
                                <img src={ApiConfig.PHOTO_PATH+'small/'+photo.imagePath}
                                     alt={'Image - '+ photo.photoId}
                                     className="w-100 mb-3"/>
                            </Col>
                        ), this)}
                    </Row>
                    <Row>
                        <Col xs={12} className="text-center mt-3 mb-3">
                            <b>
                                Price: {
                                Number(article.articlePrices[article.articlePrices.length-1].price).toFixed(2)+' EUR'}
                            </b>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs={12} className="text-center mt-3">
                            <AddToCartInput article={article}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }

}