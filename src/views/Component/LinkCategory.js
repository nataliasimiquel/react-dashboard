import {
	Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";
import AuthContext from './../../contexts/AuthContext';

const LinkCategory=(props)=> {
const { apiRequest } = React.useContext(ClientContext);
const {currentUser} = React.useContext(AuthContext);

const [open, setOpen] = React.useState(false);
const [categories, setCategories] = React.useState([]);
const [data, setData] = React.useState({ product_id: props.product_id, category_id: null });

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);


const linkCategoryWithProduct = (data) => {
	apiRequest("POST", `/categories/link-product_id/with-category_id`, {...data})
	.then((res) => {
		console.log({res});
		props.loadProducts()
	})
	.catch((err) => {
		console.log("nao foi possivel vincular a categoria com o produto: ", err)
	})
}

const getCurrentCategory = (c) => {
	setData({
		...data,
		category_id: c.id
	})
}

React.useEffect(() => {
	if(props.category && props.category.length){
		setData({
			...data,
			category_id: props.category[0].category_id
		})
	}
},[props.category]); // eslint-disable-line react-hooks/exhaustive-deps

return (
	<div>

	<Button 
		fullWidth 
		variant="contained" 
		color="primary"
		onClick={() => { handleOpen() }}
		style={{borderRadius:8 }}
	>
		{(!props.category || !props.category.length) ? "Adicionar" : "Editar"}
	</Button>

	<Modal
		open={open}
		onClose={handleClose}
		style={{
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
		}}
	>
		<div style={{
			width: "35%",
			minWidth: 350,
			borderRadius: 10,
			position: "absolute",
			backgroundColor: 'white',
		}}>
			<CloseIcon 
				fontSize="medium"
				onClick={handleClose} 
				style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
			/>

			<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography 
						fullWidth
						variant="h5"
						style={{ color: Colors.primary, width: "90%" }}
					>
						Adicionar Categoria
					</Typography>
				</Grid>
			</Grid>

			<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					<FormControl 
						fullWidth
						variant="outlined"
						style={{width: "90%"}} 
					>
						<InputLabel htmlFor="outlined-age-native-simple">Categorias</InputLabel>
						<Select 
							fullWidth
							value={data.category_id} 
							defaultValue={data.category_id}
							label="Categorias"
						>
							{(props.categories || []).map((c) => (
							<MenuItem 
								value={c.id}
								onClick={() => { getCurrentCategory(c) }}
							>
								{c.category_name}
							</MenuItem>
							))}
						</Select>
					</FormControl>
				</Grid>
			</Grid>

			<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					<Button 
						fullWidth
						variant="contained" 
						color="primary"
						style={{ borderRadius:8, width: "90%" }}
						onClick={() => {
							handleClose()
							linkCategoryWithProduct(data)
						}}
					>
						Adicionar 
					</Button>
				</Grid>
			</Grid>

		</div>
	</Modal>

	</div>
	);
	
}

export default LinkCategory;