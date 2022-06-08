import {
	Card, CardContent, CircularProgress
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import moment from "moment";
import React from "react";
import CustomTable from "../Component/custom/CustomTable";
import DeleteModal from "../Component/custom/DeleteModal";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import CreationModal from "./CreationModal";

const tableHeader = [
	{label:"ID", value:"id"},
	{label:"Código", value: "code"}, 
	{label:"Desconto", value: "discount"}, 
	{label:"Início", value: "start_at"},
	{label:"Válido até", value: "end_at"},
	{label:"Limite total", value: "limit_total"},
	{label:"Limite por usuário", value: "limit_by_user"},
	{label:"Editar", value: "edit"},
	{label:"Deletar", value: "delete"},
];

export default function Coupons (props) {
const {loading = false, error = null} = props;
const {currentUser} = React.useContext(AuthContext);
const {apiRequest} = React.useContext(ClientContext);

const [coupons, setCoupons] = React.useState([]);
const [openDelete, setOpenDelete] = React.useState(false);
const [openEdit, setOpenEdit] = React.useState(false);
const [submitting, setSubmitting] = React.useState(false);
const [errorCoupon, setErrorCoupon] = React.useState(false);
const [errorMessage, setErrorMessage] = React.useState("");
const [loadingCoupons, setLoadingCoupons] = React.useState(false);
const [openCreationModal, setOpenCreationModal] = React.useState(false);
const [editing, setEditing] = React.useState(false);
const [listBody, setListBody] = React.useState([]);
const [data, setData] = React.useState({company_id:currentUser.id});
const [selectedItemId, setSelectedItemId] = React.useState(null);
const [deleting, setDeleting] = React.useState(false);


const handleOpenDelete = (item) => {
	const id = item[0];
	setData({...data, coupon_id:selectedItemId})
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


const loadCoupons = () => {
	setLoadingCoupons(true);
	apiRequest("GET", `/coupons/${currentUser.id}`)
	.then((res) => {
		setLoadingCoupons(false);
		setCoupons(res)
	})
	.catch((err) => {
		setLoadingCoupons(false);
		console.log({err})
		setErrorCoupon(true);
		setErrorMessage(err.message);
	});
};

React.useEffect(() => {
	if(selectedItemId && (editing || deleting)){
		loadCouponInfo();
	}
},[selectedItemId]);

const loadCouponInfo = () => {
	setLoadingCoupons(true);
	apiRequest("GET", `/coupons/info/${selectedItemId}`)
	.then((res) => {
		setLoadingCoupons(false);
	setData({...res, coupon_id:selectedItemId})
	})
	.catch((err) => {
		setLoadingCoupons(false);
		console.log({err})
		setErrorCoupon(true);
		setErrorMessage(err.message);
	});
};

const openNewCouponModal = () => {setOpenCreationModal(true);}
const closeNewCouponModal = () => {setOpenCreationModal(false);}

const createCoupon = () => {
	if(!editing){
		setSubmitting(true);
		apiRequest("POST", `/coupons/create`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorCoupon(false);
			setErrorMessage("");
			setData({company_id:currentUser.id});
			loadCoupons();
			setSelectedItemId(null);
			closeNewCouponModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorCoupon(true);
			setErrorMessage(err.message);

		});
	}else{
		setSubmitting(true);
		console.log({data})
		apiRequest("PATCH", `/coupons/edit`,{...data})
		.then((res) => {
			setSubmitting(false);
			setErrorCoupon(false);
			setErrorMessage("");
			setData({company_id:currentUser.id});
			loadCoupons();
			setSelectedItemId(null);
			handleCloseModal();
		})
		.catch((err) => {
			setSubmitting(false);
			console.log({err})
			setErrorCoupon(true);
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

const deleteCoupon = () => {
	setDeleting(true);
	apiRequest('PATCH', `/coupons/delete`,{coupon_id:selectedItemId})
	.then(res => {
		handleCloseDelete();
		loadCoupons();
	}).catch(err => {
		setLoadingCoupons(false);
		console.log({err})
		setErrorCoupon(true);
		setErrorMessage(err.message);
	})
}
const loadTable = () => {
	const list = [
		...coupons.map((item) => (
			createData(item) 
		))
	].sort((a, b) => (a.created_at < b.created_at ? -1 : 1));
	setListBody(list);
}

React.useEffect(() => {
    loadCoupons();
}, []);

React.useEffect(() => {
    loadTable();
}, [coupons]);



function createData(obj) {
	const dataArray = [];
	for(let i of tableHeader){
		switch(i.value){
			case "id":
				dataArray.push(obj.id);
				break;
			case "code":
				dataArray.push(obj.code);
				break;
			case "discount":
				if(obj.discount_percentage){
					dataArray.push(`${obj.discount_percentage}%`);
					break;
				}else{
					dataArray.push((obj.discount_price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
					break;
				}
			case "start_at":
				if(obj.start_at){
					dataArray.push(moment(obj.start_at).format('DD/MM/YYYY - HH:mm'));
					break;
				}else{
					dataArray.push("-");
					break;
				}
			case "end_at":
				if(obj.end_at){
					dataArray.push(moment(obj.end_at).format('DD/MM/YYYY - HH:mm'));
					break;
				}else{
					dataArray.push("-");
					break;
				}
			case "limit_total":
				if(obj.limit_total){
					dataArray.push(obj.limit_total);
					break;
				}else{
					dataArray.push("-");
					break;
				}
			case "limit_by_user":
				if(obj.limit_by_user){
					dataArray.push(obj.limit_by_user);
					break;
				}else{
					dataArray.push("-");
					break;
				}
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
			{errorCoupon && <Alert severity="error">{errorMessage}</Alert>}
			{loadingCoupons || error ? (
			<CardContent align="center">
				{loadingCoupons ? (
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
                    title={"Cupons de Desconto"}
                    listHeader={tableHeader.map(item => item.label)}

					buttonBody={'Novo cupom'}
					buttonFunction={true}
					handleClose={handleCloseModal}
					handleOpenEdit={handleOpenEdit}
					handleOpenDelete={handleOpenDelete}
					handleOpen={openNewCouponModal}
                />
            )}
		</Card>

		<CreationModal 
			editing={editing}
			loading={submitting}
			open={(openCreationModal || openEdit)}
			handleClose={closeNewCouponModal}
			create={createCoupon}
			onChange={changeData}
			data={data}
			error={errorCoupon}
			errorMessage={errorMessage}
		/>
		<DeleteModal
			open={openDelete}
			deleting={deleting}
			handleOpen={handleOpenDelete}
			delete={deleteCoupon}
			handleClose={handleCloseDelete}
		/>
	</div>
  );
};

