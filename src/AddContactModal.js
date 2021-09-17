import React,{Component} from 'react';
import {Modal, Button, Row, Col, Form, Image, ButtonToolbar} from 'react-bootstrap';

export class AddContactModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
    }

    photofilename = null;
    imagesrc = process.env.REACT_APP_PHOTOPATH + this.contactphotofilename;

    handleSubmit(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API + 'contacts',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type' : 'application/json'
            },
            body:JSON.stringify({
                Name: event.target.ContactName.value,
                Email: event.target.ContactEmail.value,
                Address: event.target.ContactAddress.value,
                PhotoFileName: this.photofilename
            })
        })
        .then(
            (result) => {
                alert('Contacto adicionado com sucesso');
            },
            (error) => {
                alert('Erro a adicionar contacto');
            }
        )

        .then(this.props.onHide)
    }

    handleFileSelected(event){
        event.preventDefault();
        this.photofilename = event.target.files[0].name;
        const formData = new FormData();
        formData.append(
            "myFile",
            event.target.files[0],
            event.target.files[0].name
        )

        fetch(process.env.REACT_APP_API + 'contacts/SaveFile',{
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.imagesrc = process.env.REACT_APP_PHOTOPATH + result;
                // alert(this.imagesrc);
            },
            (error) =>{ 
                alert('Falha no upload da foto');
            }
        )
    }

    render(){
        return(
            <div className="container">
                <Modal {...this.props} sizer="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Add Contact
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group className="mt-1" controlId="ContactId">
                                        <Form.Label className="mb-0">Id</Form.Label>
                                        <Form.Control type="text" name="ContactId" required disabled defaultValue={this.props.contactid}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactName">
                                        <Form.Label className="mb-0">Nome</Form.Label>
                                        <Form.Control type="text" name="ContactName" required defaultValue={this.props.contactname}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactEmail">
                                        <Form.Label className="mb-0">Email</Form.Label>
                                        <Form.Control type="text" name="ContactEmail" required defaultValue={this.props.contactemail}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactAddress">
                                        <Form.Label className="mb-0">Morada</Form.Label>
                                        <Form.Control type="text" name="ContactAddress" required defaultValue={this.props.contactaddress}/>
                                    </Form.Group>
                                    <Form.Group>
                                        <ButtonToolbar>
                                            <Button className="mt-3" variant="primary" type="submit">
                                                Add Contact
                                            </Button>
                                        </ButtonToolbar>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" src={this.imagesrc}/>
                                <input onChange={this.handleFileSelected} type="File"/>
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