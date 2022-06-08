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
	{label:"Cupom", value: "coupon"}, 
	{label:"Imagem", value: "image"},
	{label:"Início", value: "start_at"}, 
	{label:"Fim", value: "end_at"},
	{label:"Quantidade de Cliques", value: "popup_clicks"},
	{label:"Editar", value: "edit"},
	{label:"Deletar", value: "delete"},
];

export default function PopUps (props) {
const {loading = false, error = null} = props;
const {currentUser} = React.useContext(AuthContext);
const {apiRequest} = React.useContext(ClientContext);

const [popups, setPopUps] = React.useState([]);
const [openDelete, setOpenDelete] = React.useState(false);
const [openEdit, setOpenEdit] = React.useState(false);
const [submitting, setSubmitting] = React.useState(false);
const [errorPopUps, setErrorPopUps] = React.useState(false);
const [errorMessage, setErrorMessage] = React.useState("");
const [loadingPopups, setLoadingPopUps] = React.useState(false);
const [openCreationModal, setOpenCreationModal] = React.useState(false);
const [editing, setEditing] = React.useState(false);
const [listBody, setListBody] = React.useState([]);
const [inputsArray, setInputsArray] = React.useState([]);
const [data, setData] = React.useState({company_id:currentUser.id, main:false});
const [selectedItemId, setSelectedItemId] = React.useState(null);
const [deleting, setDeleting] = React.useState(false);
const [loadFileError, setLoadFileError] = React.useState(null)
const [loadFile, setLoadFile] = React.useState(false)
const [coupons, setCoupons] = React.useState([]);
const [errorCoupon, setErrorCoupon] = React.useState(false);

const loadPopUps = () => {
	setLoadingPopUps(true);
	apiRequest("GET", `/popups/${currentUser.id}`)
	.then((res) => {
		setLoadingPopUps(false);
		setPopUps(res)
	})
	.catch((err) => {
		setLoadingPopUps(false);
		setErrorPopUps(true);
		setErrorMessage(err.message);
	});
};


const loadTable = () => {
	const list = [
		...popups.map((item) => (
			createData(item) 
		))
	].sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
	setListBody(list);
}

React.useEffect(() => {
    loadPopUps();
	loadCoupons();
}, []);

React.useEffect(() => {
    loadTable();
}, [popups]);

React.useEffect(() => {
	if(selectedItemId && (editing || deleting)){
		loadPopUpsInfo();
	}
},[selectedItemId]);

const loadPopUpsInfo = () => {
	setLoadingPopUps(true);
	apiRequest("GET", `/popups/info/${selectedItemId}`)
	.then((res) => {
		console.log(res)
		setLoadingPopUps(false);
		setData({
			...res, 
			start_at:moment(res.start_at).format('YYYY-MM-DD'),
			end_at:moment(res.end_at).format('YYYY-MM-DD')
		})
	})
	.catch((err) => {
		setLoadingPopUps(false);
		console.log({err})
		setErrorPopUps(true);
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
const openNewPopUpsModal = () => {setOpenCreationModal(true);}

const createPopUps = () => {
	console.log({data})
	if(!editing){
		setSubmitting(true);
		apiRequest("POST", `/popups/create`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorPopUps(false);
			setErrorMessage("");
			setData({company_id:currentUser.id});
			loadPopUps();
			setSelectedItemId(null);
			handleCloseModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorPopUps(true);
			setErrorMessage(err.message);

		});
	}else{
		setSubmitting(true);
		apiRequest("PATCH", `/popups/edit/${selectedItemId}`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorPopUps(false);
			setErrorMessage("");
			setData({company_id:currentUser.id});
			loadPopUps();
			setSelectedItemId(null);
			handleCloseModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorPopUps(true);
			setErrorMessage(err.message);

		});
	}
}


const changeData = (event) => {
	setData({
		...data,
		[event.target.name]: event.target.value,
	});
};

const deletePopUps = () => {
	setDeleting(true);
	apiRequest('PATCH', `/popups/delete/${selectedItemId}`)
	.then(res => {
		handleCloseDelete();
		loadPopUps();
	}).catch(err => {
		setLoadingPopUps(false);
		console.log({err})
		setErrorPopUps(true);
		setErrorMessage(err.message);
	})
}



function createData(obj) {
	console.log({obj})
	const dataArray = [];
	for(let i of tableHeader){
		switch(i.value){
			case "id":
				dataArray.push(obj.id);
				break;
			case "coupon":
				if(obj.coupon){
					dataArray.push(obj.coupon.code);
				}else{
					dataArray.push("-")
				}
				break;
			case "image":
				dataArray.push({key:"image", value:obj.image});
				break;
			case "start_at":
				dataArray.push(moment(obj.start_at).format('DD/MM/YYYY - HH:mm'));
				break;
			case "end_at":
				dataArray.push(moment(obj.end_at).format('DD/MM/YYYY - HH:mm'));
				break;
			case "popup_clicks":
				dataArray.push(obj.clicks.length);
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


const onLoadFile = (event) => {
	setLoadFile(true)
	setLoadFileError(null)

	let formData = new FormData();
	formData.append("File", event)

	apiRequest("POST", `/contents/file/admin-products`, formData)
	.then(res => { 
		if(!res.file) throw new Error("Falha ao salvar imagem");
		setData(({...data, image:res.file}))
		setLoadFile(false)
	})
	.catch((err) => {
		setLoadFileError(err)
		setLoadFile(false)
	})
}


const loadCoupons = () => {
	apiRequest("GET", `/coupons/${currentUser.id}`)
	.then((res) => {
		setCoupons(res)
	})
	.catch((err) => {
		console.log({err})
		setErrorCoupon(true);
		setErrorMessage(err.message);
	});
};

return (
	<div>
		<Card style={{marginTop:"2%"}}>
			{errorPopUps && <Alert severity="error">{errorMessage}</Alert>}
			{loadingPopups || error ? (
			<CardContent align="center">
				{loadingPopups ? (
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
                    title={"PopUps Promocionais"}
                    listHeader={tableHeader.map(item => item.label)}
					buttonBody={'Novo PopUp'}
					buttonFunction={true}
					handleClose={handleCloseModal}
					handleOpenEdit={handleOpenEdit}
					handleOpenDelete={handleOpenDelete}
					handleOpen={openNewPopUpsModal}
                />
            )}
		</Card>

		<CreationModal
			onLoadFile={onLoadFile} 
			coupons={coupons} 
			editing={editing}
			loading={submitting}
			open={(openCreationModal || openEdit)}
			handleClose={handleCloseModal}
			create={createPopUps}
			onChange={changeData}
			data={data}
			error={errorPopUps}
			errorMessage={errorMessage}
		/>
		<DeleteModal
			open={openDelete}
			deleting={deleting}
			handleOpen={handleOpenDelete}
			delete={deletePopUps}
			handleClose={handleCloseDelete}
		/>
	</div>
  );
};

