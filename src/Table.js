import React, {Component} from 'react';
import MaterialTable from '@material-table/core';//'material-table'
import {Button, ButtonToolbar, Image, Form} from 'react-bootstrap';
import {AddContactModal} from './AddContactModal';
import {EditContactModal} from './EditContactModal';
import {ViewContactModal} from './ViewContactModal';

export class Table extends Component {

    constructor(props){
        super(props);
        this.state={contacts: [], 
            addModalShow: false, 
            editModalId: 0, 
            showModalId: 0,
            shouldLoad: this.props.shouldLoad}
    }
    
    componentDidMount(){
        this.setState({shouldLoad: true});
        this.refreshList();
    }
    componentDidUpdate(){
        if(this.state.shouldLoad){
            this.refreshList();
        }
    }
    // ########### GET CONTACTS ###########
    refreshList(){
        if(this.state.shouldLoad){
            fetch(process.env.REACT_APP_API + "contacts")
            .then(response => response.json())
            .then(data => {
                this.setState({contacts: data, shouldLoad: false})
            });
        }
    }
    // ########### GET PHOTO OR NAME ###########
    getItem(item){
        if(item.PhotoFileName == null){
            return <h4>{this.getPhotoName(item.Name)}</h4>
        }
        return <Image src={process.env.REACT_APP_PHOTOPATH + item.PhotoFileName} width="50px" height="50px"/>
    }
    getPhotoName(name){
        if (name == null)
            return "";
        return name.match(/\b(\w)/g).join('').slice(0, -1) + ' ' + name.split(/[, ]+/).pop();
    }
    // ########### GET EMAIL BUTTON ###########
    getEmailBtn(item){
        return (
            <Button className="mr-2" variant="dark" href={"mailto:" + item.Email}>
                Enviar Email
            </Button>
        )
    }
    // ########### GET VIEW BUTTON ###########
    getViewBtn(item){
        let viewModalClose = () => {this.setState({shouldLoad: true, showModalId: 0});}
        return (
            <div>
                <Button className="mr-2" variant="primary" onClick={() => this.setState({shouldLoad: false, showModalId: item.Id}) }>
                    Consultar
                </Button>
                <ViewContactModal show={item.Id === this.state.showModalId} onHide={viewModalClose} contactid={item.Id} />
            </div>
        )
    }
    updateViewState(item){
        
    }
    // ########### GET EDIT BUTTON ###########
    getEditBtn(item){
        let editModalClose = () => {this.setState({shouldLoad: true, editModalId: 0});}
        return (
            <div>
                <Button className="mr-2" variant="info" onClick={() => this.setState({shouldLoad: false, editModalId: item.Id}) }>
                    Editar
                </Button>
                <EditContactModal show={item.Id === this.state.editModalId} onHide={editModalClose} contactid={item.Id}/>
            </div>
        )
    }
    render(){
        let addModalClose = () => this.setState({addModalShow: false, shouldLoad: true});
        
        return(
            <div>
                <MaterialTable 
                    title = "Contactos" 
                    data = {this.state.contacts} 
                    columns = {[
                        {filtering: false, render: item => this.getItem(item)},
                        {title: 'Nome', field: 'Name'},
                        {title: 'Telemóvel', field: 'PrivatePhone'},
                        {title: 'Enviar Email', filtering: false, render: item => this.getEmailBtn(item)},
                        {title: 'Consultar', filtering: false, render: item => this.getViewBtn(item)},
                        {title: 'Editar', filtering: false, render: item => this.getEditBtn(item)},
                    ]}
                    options = {{
                        paging: true,
                        filtering: true,
                    }}/>
                <ButtonToolbar>
                    <Button variant='primary' className="mt-5" onClick={() => this.setState({addModalShow: true, shouldLoad: false})}>
                        Adicionar Contacto
                    </Button>

                    <AddContactModal show={this.state.addModalShow} onHide={addModalClose}/>
                </ButtonToolbar>
            </div>
        )
    }
}