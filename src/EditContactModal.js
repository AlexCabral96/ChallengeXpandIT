import React,{Component} from 'react';
import {Modal, Button, Row, Col, Form, Image, ButtonToolbar} from 'react-bootstrap';

export class EditContactModal extends Component{
    constructor(props){
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileSelected = this.handleFileSelected.bind(this);
        this.state={contactphones: []}
    }

    photofilename = null;
    imagesrc = process.env.REACT_APP_PHOTOPATH + this.contactphotofilename;

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
            },
            (error) =>{ 
                alert('Falha no upload da foto');
            }
        )
    }

    handleSubmit(event){
        event.preventDefault();
        fetch(process.env.REACT_APP_API + "contacts/" + event.target.ContactId.value,{
            method:'PUT',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                Id: event.target.ContactId.value,
                Name: event.target.ContactName.value,
                Email: event.target.ContactEmail.value,
                Address: event.target.ContactAddress.value,
                PhotoFileName: this.photofilename,
                Phones: this.state.contactphones
            })
        })
        .then(
            (result) => {
                alert('Contacto editado com sucesso');
            },
            (error) => {
                alert('Erro a editar contacto');
            }
        )
        .then(this.props.onHide)
    }
    
    deleteContact(contactid){
        if(window.confirm('Tem a certeza que quer remover este contacto?')){
            fetch(process.env.REACT_APP_API + 'contacts/' + contactid,{
                method: 'DELETE',
                headers:{
                    'Accept':'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(
                (result) => {
                    alert('Contacto removido com sucesso');
                },
                (error) => {
                    alert('Erro a remover contacto');
                }
            )
            .then(this.props.onHide)
        }
    }

    addPhone(){
        
    }

    render(){
        const {phones} = this.state;
        
        return(
            <div className="container">
                <Modal {...this.props} sizer="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Editar Contacto
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group className="mt-1" controlId="ContactId">
                                        <Form.Label className="mb-0">Id</Form.Label>
                                        <Form.Control type="text" name="ContactId" required disabled defaultValue={this.state.contactid}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactName">
                                        <Form.Label className="mb-0">Nome</Form.Label>
                                        <Form.Control type="text" name="ContactName" required defaultValue={this.state.contactname}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactEmail">
                                        <Form.Label className="mb-0">Email</Form.Label>
                                        <Form.Control type="text" name="ContactEmail" required defaultValue={this.state.contactemail}/>
                                    </Form.Group>
                                    <Form.Group className="mt-1" controlId="ContactAddress">
                                        <Form.Label className="mb-0">Morada</Form.Label>
                                        <Form.Control type="text" name="ContactAddress" required defaultValue={this.state.contactaddress}/>
                                    </Form.Group>
                                    {this.state.contactphones.map(phone => 
                                        <Form.Group>
                                            <Form.Label className="mb-0">{phone.Description}</Form.Label>
                                            <Form.Control type="text" defaultValue={phone.Number}/>
                                        </Form.Group>
                                        )
                                    }
                                    <div id="lalala"/>
                                    <Form.Group>
                                        <ButtonToolbar>
                                            <Button className="mr-5 mt-3" variant="primary" type="submit">
                                                Guardar
                                            </Button>
                                            <Button className="ml-5 mt-3" variant="danger" onClick={() => this.deleteContact(this.state.contactid)}>
                                                Remover
                                            </Button>
                                            <Button className="ml-5 mt-3" variant="secondary" onClick={() => this.addPhone()}>
                                                Adicionar Nº
                                            </Button>
                                        </ButtonToolbar>
                                    </Form.Group>
                                </Form>
                            </Col>
                            <Col sm={6}>
                                <Image width="200px" height="200px" hidden={this.state.contactphotofilename == null} 
                                        src={process.env.REACT_APP_PHOTOPATH + this.state.contactphotofilename}/>
                                <h3 hidden={this.state.contactphotofilename != null}>{this.getPhotoName(this.state.contactname)}</h3>
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