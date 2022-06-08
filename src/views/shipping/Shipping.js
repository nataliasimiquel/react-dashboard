import {
	Card, CardContent, CircularProgress
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React from "react";
import CustomTable from "../Component/custom/CustomTable";
import DeleteModal from "../Component/custom/DeleteModal";
import AuthContext from '../../contexts/AuthContext';
import ClientContext from "../../contexts/ClientContext";
import CreationModal from "./CreationModal";

const tableHeader = [
	{label:"ID", value:"id"},
	{label:"CEP de Origem", value: "cep"}, 
	{label:"País", value: "country"},
	{label:"UF", value: "uf"}, 
	{label:"Cidade", value: "city"},
	{label:"Bairro", value: "neighborhood"},
	{label:"Endereço", value: "address"},
	{label:"Editar", value: "edit"},
	{label:"Deletar", value: "delete"},
];

export default function Shipping (props) {
const {loading = false, error = null} = props;
const {currentUser} = React.useContext(AuthContext);
const {apiRequest} = React.useContext(ClientContext);

const [addresses, setAddresses] = React.useState([]);
const [openDelete, setOpenDelete] = React.useState(false);
const [openEdit, setOpenEdit] = React.useState(false);
const [submitting, setSubmitting] = React.useState(false);
const [errorAddress, setErrorAddress] = React.useState(false);
const [errorMessage, setErrorMessage] = React.useState("");
const [loadingAddresses, setLoadingAddresses] = React.useState(false);
const [openCreationModal, setOpenCreationModal] = React.useState(false);
const [editing, setEditing] = React.useState(false);
const [listBody, setListBody] = React.useState([]);
const [inputsArray, setInputsArray] = React.useState([]);
const [data, setData] = React.useState({company_id:currentUser.id, main:false});
const [selectedItemId, setSelectedItemId] = React.useState(null);
const [deleting, setDeleting] = React.useState(false);

const loadAddresses = () => {
	setLoadingAddresses(true);
	apiRequest("GET", `/address/company/${currentUser.id}`)
	.then((res) => {
		setLoadingAddresses(false);
		setAddresses(res)
	})
	.catch((err) => {
		setLoadingAddresses(false);
		setErrorAddress(true);
		setErrorMessage(err.message);
	});
};


const loadTable = () => {
	const list = [
		...addresses.map((item) => (
			createData(item) 
		))
	].sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
	setListBody(list);
}

// const loadInputs = () => {
// 	const addressInputs = [
// 		{
// 			id:1,
// 			name:"cep",
// 			value:data["cep"],
// 			label:"CEP de Origem",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:2,
// 			name:"country",
// 			value:data["country"],
// 			label:"País",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:3,
// 			name:"UF",
// 			value:data["UF"],
// 			label:"UF",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:4,
// 			name:"city",
// 			value:data["city"],
// 			label:"Cidade",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:5,
// 			name:"neighborhood",
// 			value:data["neighborhood"],
// 			label:"Bairro",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:6,
// 			name:"address",
// 			value:data["address"],
// 			label:"Endereço",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:7,
// 			name:"complement",
// 			value:data["complement"],
// 			label:"Complemento",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 		{
// 			id:8,
// 			name:"number",
// 			value:data["number"],
// 			label:"Número",
// 			onChange:(e) =>{changeData(e)}
// 		},
// 	]
// 	setInputsArray(addressInputs);
// }

React.useEffect(() => {
    loadAddresses();
	// loadInputs();
}, []);

React.useEffect(() => {
    loadTable();
}, [addresses]);

React.useEffect(() => {
	if(selectedItemId && (editing || deleting)){
		loadAddressInfo();
	}
},[selectedItemId]);

const loadAddressInfo = () => {
	setLoadingAddresses(true);
	apiRequest("GET", `/address/company/info/${selectedItemId}`)
	.then((res) => {
		setLoadingAddresses(false);
		setData({...res.address, main:res.main})
	})
	.catch((err) => {
		setLoadingAddresses(false);
		console.log({err})
		setErrorAddress(true);
		setErrorMessage(err.message);
	});
};


const handleOpenDelete = (item) => {
	const id = item[0];
	setSelectedItemId(id);
	setOpenDelete(true);	
};
const handleOpenEdit = (item) => {
	const id = item[0];
	setSelectedItemId(id);
	setOpenEdit(true);
	setEditing(true);
};
const handleCloseDelete = () => setOpenDelete(false);
const handleCloseModal = () => {setOpenCreationModal(false);setOpenEdit(false)};
const openNewAddressModal = () => {setOpenCreationModal(true);}

const createAddress = () => {
	if(!editing){
		setSubmitting(true);
		apiRequest("POST", `/address/company/new/${currentUser.id}`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorAddress(false);
			setErrorMessage("");
			setData({company_id:currentUser.id, main:false});
			loadAddresses();
			setSelectedItemId(null);
			handleCloseModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorAddress(true);
			setErrorMessage(err.message);

		});
	}else{
		setSubmitting(true);
		apiRequest("PATCH", `/address/company/edit/${currentUser.id}/${selectedItemId}`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorAddress(false);
			setErrorMessage("");
			setData({company_id:currentUser.id, main:false});
			loadAddresses();
			setSelectedItemId(null);
			handleCloseModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorAddress(true);
			setErrorMessage(err.message);

		});
	}
}

const searchCep = (cep) => {
	if((cep.length < 8)) {
		return;
	} else {    
		setTimeout(() => {
			fetch(`http://viacep.com.br/ws/${cep}/json/`, {mode: 'cors'})
			.then((res) => res.json())
			.then((res) => {
				if (res.hasOwnProperty("erro")) {}
				else{
					setData({
						cep:res.cep.replace("-", ""),
						country:"Brasil",
						uf:res.uf,
						neighborhood:res.bairro,
						city:res.localidade,
						address:res.logradouro,
					})
				}
			})
			.catch(err => console.log(err));
		},400)
	}
}


const changeData = (event) => {
	if(event.target.name == "cep"){
		searchCep(event.target.value);
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	}
	else if(event.target.name == "main"){
		const boolean = ((event.target.value == "true") || (event.target.value == true)) ? true : false
		setData({
			...data,
			[event.target.name]:!boolean
		});
	}else{
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	}
};

const deleteAddress = () => {
	setDeleting(true);
	apiRequest('PATCH', `/address/company/delete/${currentUser.id}/${selectedItemId}`)
	.then(res => {
		handleCloseDelete();
		loadAddresses();
	}).catch(err => {
		setLoadingAddresses(false);
		console.log({err})
		setErrorAddress(true);
		setErrorMessage(err.message);
	})
}



function createData(obj) {
	const dataArray = [];
	for(let i of tableHeader){
		switch(i.value){
			case "id":
				dataArray.push(obj.id);
				break;
			case "cep":
				dataArray.push(obj.address.cep);
				break;
			case "country":
				dataArray.push(obj.address.country);
				break;
			case "uf":
				dataArray.push(obj.address.uf);
				break;
			case "city":
				dataArray.push(obj.address.city);
				break;
			case "neighborhood":
				dataArray.push(obj.address.neighborhood);
				break;
			case "address":
				dataArray.push(obj.address.address);
				break;
			case "edit":
				dataArray.push("edit");
				break;
			case "delete":
				dataArray.push("delete");
				break;
			default:
				console.log("DEFAULT");
				break;
			
		}
		
	}
    return dataArray;
}





return (
	<div>
		<Card style={{marginTop:"2%"}}>
			{errorAddress && <Alert severity="error">{errorMessage}</Alert>}
			{loadingAddresses || error ? (
			<CardContent align="center">
				{loadingAddresses ? (
				<CircularProgress />
				) : (
				<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
					{error}
				</div>
				)}
			</CardContent>
			) : (
				<CustomTable
					listBody={listBody}
                    title={"Endereços de Entrega/Frete"}
                    listHeader={tableHeader.map(item => item.label)}
					buttonBody={'Novo endereço'}
					buttonFunction={true}
					handleClose={handleCloseModal}
					handleOpenEdit={handleOpenEdit}
					handleOpenDelete={handleOpenDelete}
					handleOpen={openNewAddressModal}
                />
            )}
		</Card>

		<CreationModal
			searchCep={searchCep} 
			editing={editing}
			loading={submitting}
			open={(openCreationModal || openEdit)}
			handleClose={handleCloseModal}
			create={createAddress}
			onChange={changeData}
			data={data}
			error={errorAddress}
			errorMessage={errorMessage}
		/>
		<DeleteModal
			open={openDelete}
			deleting={deleting}
			handleOpen={handleOpenDelete}
			delete={deleteAddress}
			handleClose={handleCloseDelete}
		/>
	</div>
  );
};

