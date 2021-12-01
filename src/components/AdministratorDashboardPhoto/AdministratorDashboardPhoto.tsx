import React from 'react';
import {Button, Card, Col, Container, Form, Nav, Row} from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faBackward, faImages, faMinus, faPlus} from "@fortawesome/free-solid-svg-icons";
import {Redirect, Link} from "react-router-dom";
import api, {apiFile, ApiResponse} from "../../api/api";
import RoleMeinMenu from "../RoleMainMenu/RoleMeinMenu";

import PhotoType from "../../types/PhotoType";
import {ApiConfig} from "../../config/api.config";

interface AdministratorDashboardPhotoProperties{
    match:{
        params:{
            aId:number;
        }
    }
}

interface AdministratorDashboardPhotoState{
    isAdministratorLoggedIn: boolean;
    photos: PhotoType[],

}


class AdministratorDashboardPhoto extends React.Component<AdministratorDashboardPhotoProperties>{
    state: AdministratorDashboardPhotoState;

    constructor(props: Readonly<AdministratorDashboardPhotoProperties>) {
        super(props);

        this.state={
            isAdministratorLoggedIn: true,
            photos:[],

        }

    }

    componentDidMount() {
        this.getPhotos();
    }

    componentDidUpdate(prevProps: Readonly<AdministratorDashboardPhotoProperties>, prevState: Readonly<{}>, snapshot?: any) {
        if(this.props.match.params.aId===prevProps.match.params.aId){
            return;
        }

        this.getPhotos();
    }

    private getPhotos(){
        api('api/article/'+this.props.match.params.aId+'/?join=photos','get',{},'administrator')
            .then((res: ApiResponse)=>{
                if(res.status==="error" || res.status==="login") {
                    this.setLoginState(false);
                    return;
                }

                this.setState(Object.assign(this.state,{
                    photos: res.data.photos,
                }));
            });
    }


    private setLoginState(isLoggedIn: boolean){
        this.setState(Object.assign(this.state,{
            isAdministratorLoggedIn: isLoggedIn
        }));

    }

    render() {
        if(!this.state.isAdministratorLoggedIn){
            return (
                <Redirect to={"/administrator/login"}/>
            );
        }
        return (
            <Container>
                <RoleMeinMenu role="administrator"/>
                <Card>
                    <Card.Body>
                        <Card.Title>
                            <FontAwesomeIcon icon={faImages}/> Photos
                        </Card.Title>

                        <Nav className="mb-3">
                            <Nav.Item>
                                <Link to="/administrator/dashboard/article/" className="btn btn-sm btn-info">
                                    <FontAwesomeIcon icon={faBackward}/>Go back to articles
                                </Link>
                            </Nav.Item>
                        </Nav>

                        <Row>
                            {this.state.photos.map(this.printSinglePhoto, this)}
                        </Row>

                        <Form>
                            <Form.Group className="mt-5">
                                <p>
                                    <strong>Add a new photo to this article</strong>
                                </p>
                                <Form.Label htmlFor="add-photo">New article photo</Form.Label>
                                <Form.Control type="file" id="add-photo"/>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary"
                                onClick={()=>this.doUpload()}>
                                    <FontAwesomeIcon icon={faPlus}/> Upload photo
                                </Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    private printSinglePhoto(photo: PhotoType){
        return(
            <Col xs={12} sm={6} md={4} lg={3}>
                <Card>
                    <Card.Body>
                        <img alt={"Photo "+ photo.photoId}
                             src={ApiConfig.PHOTO_PATH+'small/'+photo.imagePath}
                             className="w-100"/>
                        <Card.Footer>
                            {this.state.photos.length>1?(
                                <Button variant="danger"
                                onClick={()=>this.deletePhoto(photo.photoId)}>
                                    <FontAwesomeIcon icon={faMinus}/> Delete photo
                                </Button>
                            ):''}
                        </Card.Footer>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    private async doUpload(){
        const filePicker: any = document.getElementById('add-photo');

        if (filePicker?.files.length === 0) {
            return;
        }

        const file = filePicker.files[0]
        await this.uploadArticlePhoto(this.props.match.params.aId, file);
        filePicker.value='';

        this.getPhotos();
    }

    private async uploadArticlePhoto(articleId: number, file: File) {
        return await apiFile('api/article/' + articleId + '/uploadPhoto', 'photo', file, 'administrator');
    }

    private deletePhoto(photoId: number){
        if(!window.confirm('Are you sure?')){
            return;
        }

        api('api/article/'+this.props.match.params.aId+'/deletePhoto/'+photoId+'/','delete',{},'administrator')
            .then((res:ApiResponse)=>{
                if(res.status==="error" || res.status==="login") {
                    this.setLoginState(false);
                    return;
                }

                this.getPhotos();
            })
    }
}

export default AdministratorDashboardPhoto;
