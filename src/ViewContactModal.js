import React,{Component} from 'react';
import {Modal, Button, Row, Col, Form, Image} from 'react-bootstrap';

export class ViewContactModal extends Component{
    constructor(props){
        super(props);
        this.state={contactphones: []};
    }

    componentDidMount(){
        this.getContactDetails(this.props.contactid);
    }

    getContactDetails(id){
        fetch(process.env.REACT_APP_API + "contacts/" + id)
        .then(response => response.json())
        .then(data => {
            this.setState({
                contactid: id,
                contactname: data.Name,
                contactemail: data.Email,
                contactaddress: data.Address,
                contactphotofilename: data.PhotoFileName,
                contactphones: data.Phones
            })
        });
    }

    getPhotoName(name){
        if (name == null)
            return "";
        return name.match(/\b(\w)/g).join('').slice(0, -1) + ' ' + name.split(/[, ]+/).pop();
    }

    render(){
        
        return(
            <div className="container">
                <Modal {...this.props} sizer="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Visualizar Contacto
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form>
                                    <Form.Group className="mt-1" controlId="ContactId">
                                        <Form.Label className="mb-0">Id</Form.Label>
                                        <Form.Control type="text" name="ContactId" disabled defaultValue={this.state.contactid}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactName">
                                        <Form.Label className="mb-0">Nome</Form.Label>
                                        <Form.Control type="text" name="ContactName" disabled defaultValue={this.state.contactname}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactEmail">
                                        <Form.Label className="mb-0">Email</Form.Label>
                                        <Form.Control type="text" name="ContactEmail" disabled defaultValue={this.state.contactemail}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactAddress">
                                        <Form.Label className="mb-0">Morada</Form.Label>
                                        <Form.Control type="text" name="ContactAddress" disabled defaultValue={this.state.contactaddress}/>
                                    </Form.Group>
                                    {this.state.contactphones.map(phone => 
                                        <Form.Group>
                                            <Form.Label className="mb-0">{phone.Description}</Form.Label>
                                            <Form.Control type="text" disabled defaultValue={phone.Number}/>
                                        </Form.Group>
                                        )
                                    }
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" hidden={this.state.contactphotofilename == null} 
                                    src={process.env.REACT_APP_PHOTOPATH + this.state.contactphotofilename}/>
                                <h3 hidden={this.state.contactphotofilename != null}>{this.getPhotoName(this.state.contactname)}</h3>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="danger" onClick={this.props.onHide}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}