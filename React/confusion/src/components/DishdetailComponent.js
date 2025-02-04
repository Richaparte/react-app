//presentational component as it depends only on props passed to it and doesnot have its own local state
  
import React, {Component} from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalBody,ModalHeader, Row,Col,Label} from 'reactstrap';
import {Link } from 'react-router-dom';
import { LocalForm, Control, Errors } from 'react-redux-form';
import {Loading} from './LoadingComponent';

const required=(val) =>val && val.length;
const maxLength= (len)=>(val) => !(val) || (val.length<=len);
const minLength= (len) => (val) => (val) && (val.length>=len);

 class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            isModalOpen: false
       };
       this.toggleModal = this.toggleModal.bind(this);
       this.submitHandle = this.submitHandle.bind(this);
    }

    toggleModal(){
        this.setState({
            
            isModalOpen: !this.state.isModalOpen
        });
    }

    //check
    submitHandle(values){
        this.toggleModal();
        this.props.addComment(this.props.dishId , values.rating ,values.author ,values.comment);
    }

    render(){
    return(
        <React.Fragment>
            <Button className="bg-white text-dark" onClick={this.toggleModal} type="submit" className="fa fa-pencil" >
                Submit Comment
            </Button>
            <Modal isOpen = {this.state.isModalOpen} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal}>
                    Submit comment
                </ModalHeader>
                <ModalBody>
                    <LocalForm onSubmit={(value)=>{this.submitHandle(value)}}>
                        <Row className="form-group">
                            <Label htmlFor="rating" md={4}>Rating</Label>
                            <Col md={12}>
                                <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="author" md={4}>Your Name</Label>
                            <Col md={12}>
                                <Control.text model=".author" id="author" name="author" className="form-control"
                                validators={{
                                    minLength:minLength(3) ,maxLength:maxLength(15)
                                }} 
                                />
                                <Errors
                                    className="text-danger" model=".author" show="touched"
                                    messages={{
                                        minLength:"Must be graeter than 2 characters",
                                        maxLength:"Must be less than 15 characters"
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Label htmlFor="comment" md={4}>Comment</Label>
                            <Col md={12}>
                                <Control.textarea model=".comment" id="comment" name="comment" className="form-control"
                                validators={{
                                    required
                                }}  rows="6"
                                />
                                <Errors
                                    className="text-danger" model=".comment" show="touched"
                                    messages={{
                                        required :"Comment Required"
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="form-group">
                            <Col>
                                <Button type="submit" color="primary">Submit</Button>
                            </Col>
                        </Row>
                    </LocalForm>
                </ModalBody>
            </Modal>
        </React.Fragment>
     );
    }
 }





  function RenderComments({comments ,addComment,dishId}) {
        if (comments == null) {
            return (<div></div>)
        }
        const cmnts = comments.map(comment => {
            return (
                <li key={comment.id}>
                    <p>{comment.comment}</p>
                    <p>-- {comment.author},
                    &nbsp;
                    {new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: '2-digit'
                        }).format(new Date(comment.date))}
                    </p>
                </li>
            )
        })
        return (
            <div className="col-12 col-md-5 m-1">
                <h4> Comments </h4>
                <ul className='list-unstyled'>
                    {cmnts}
                    <CommentForm dishId={dishId} addComment={addComment} />
                </ul>

            </div>
        )
    }

  function RenderDish({dish}) {
        if (dish != null) {
            return (
                <div className="col-12 col-md-5 m-1">
                    <Card >
                        <CardImg top src={dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </div>
            )
        }
        else {
            return (<div></div>)
        }
    }


    
    const Dishdetail=(props) => {
        if (props.isLoading){
            return (
                <div className="container">
                    <div className="row">
                        <Loading/>
                    </div>
                </div>
            );
        }
        else if(props.errMess){
            return (
                <div className="container">
                    <div className="row">
                        <h2>{props.errMess}</h2>
                    </div>
                </div>
            );
        }
        const dish = props.dish
        if (dish == null) {
            return (<div></div>)
        }
        
        return (
            <div class='container'>
                <div className="row">
                    <Breadcrumb>
      
                        <BreadcrumbItem><Link to='/menu'>Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr/>
                    </div>
                </div>
                <div className='row'>
                    <RenderDish dish ={props.dish} />
                    <RenderComments comments ={props.comments} 
                    addComment ={props.addComment}
                    dishId ={props.dish.id} />
                </div>
                
            </div>
        )
    }


export default Dishdetail;
