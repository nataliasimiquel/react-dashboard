import {
	Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Modal, Select, TextField, Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import InputField from "../../commons/InputField";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";

export default function RegisterStock(props) {	
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	const [data, setData] = React.useState({});
	const [open, setOpen] = React.useState(false);
	const [products, setProducts] = React.useState([])
	const [error, setError] = React.useState({
		product_id:false,
		amount:false,
		stock_date:false,
		due_date:false,
		custom_product_id:false,
	});

	const handleClose = () => setOpen(false);
	const handleOpen = () => setOpen(true);

	const registerStock = (e) => {
		if (!data.product_id) {
		 setError(e => ({...e,product_id:true}))
		}
		if (!data.amount) {
		 setError(e => ({...e, amount:true}))
		}
		if (!data.stock_date) {
		 setError(e => ({...e, stock_date:true}))
		}
		if (!data.due_date) {
		 setError(e => ({...e, due_date:true}))
		}
		// if (!data.custom_product_id) {
		//  setError(e => ({...e, custom_product_id:true}))
		// }
		else if (!error.product_id && !error.stock_date && !error.due_date && !error.amount && !error.custom_product_id) {
			const params = {...data,price: parseFloat(data.price)}
			apiRequest("POST", `/stock/add-stock`, {...params,price:params.price})
			.then((res) => {
				setData([]);
				handleClose();
				props.setAlert(1)
				props.setSucess(1)
				props.loadStock();
			})
			.catch((err) => {
				handleClose();
				props.setAlert(2)
				props.setSucess(2)
				props.getError(err)
			});
		}
	}

	const loadProducts = () => {
		apiRequest("GET", `/itens/all-products/${currentUser.companyProfiles[0].company_id}`)
			.then((res) => {
				console.log({res});
				setProducts(res)
			})
			.catch((err) => {
				console.log("nao conseguiu carregar os produtos", err);
			});
	};

	const getCurrentProduct = (p) => {
		setData({
			...data,
			product_id: p.id,
			productInfo:p
		})
	}
	const getCustomization = (c) => {
		setData({
			...data,
			custom_product_id: c.id,
		})
	}

	const handleChangeData = (event) => {
		setData({
			...data,
			[event.target.name]: event.target.value,
		});
	};

	React.useEffect(() => {
		loadProducts()
		setData({})
	},[]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect (() => {
		if (data.product_id) {
			setError(e => ({...e,product_id:false}))
		 }
		 if (data.amount) {
			setError(e => ({...e, amount:false}))
		 }
		 if (data.stock_date) {
			setError(e => ({...e, stock_date:false}))
		 }
		 if (data.due_date) {
			setError(e => ({...e, due_date:false}))
		 }
		 if (data.custom_product_id) {
			setError(e => ({...e, custom_product_id:false}))
		 }
		 console.log({data});
	}, [data])

	return (
		<div>
			<Button 
				fullWidth
				variant="contained" 
				color="primary" 
				style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
				onClick={handleOpen}
			>
				Inserir Estoque
			</Button>

			<Modal 
				open={open} 
				onClose={handleOpen} 
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
								Cadastrar estoque
							</Typography>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12} spacing={2}>
						<Grid item xs={12} sm={12} md={12}>
							<FormControl
								fullWidth
								variant="outlined"
								style={{width: "90%"}}
							>
									<InputLabel htmlFor="outlined-age-native-simple">Produtos</InputLabel>
									<Select
										fullWidth
										value={data.id}
										label="Produtos"
										error={error.product_id}
									>
										{products.map((p) => (
											<MenuItem 
												key={p.id} 
												value={p}
												onClick={() => { getCurrentProduct(p) }}
											>
												{p.name}
											</MenuItem>
										))}
									</Select>
								{
									error.product_id ?
									<FormHelperText error={error.product_id}>insira um produto</FormHelperText>
									: null
								}
							</FormControl>
						</Grid>
						{
							data &&
							data.productInfo &&
							data.productInfo.custom_products &&
							<Grid item xs={12} sm={12} md={12}>
								<FormControl
									fullWidth
									variant="outlined"
									style={{width: "90%"}}
								>
									<InputLabel htmlFor="outlined-age-native-simple">Customizações</InputLabel>
									<Select
										fullWidth
										value={data.custom_product_id}
										label="Customizações"
										error={error.custom_product_id}
									>
										{data.productInfo.custom_products.map((c) => (
											<MenuItem 
												key={c.id} 
												value={c.id}
												onClick={() => { getCustomization(c) }}
											>
												{c.custom_attributes_products.length ? {...{...c.custom_attributes_products[0]}.custom_attributes}.title : ""}
											</MenuItem>
										))}
									</Select>
									{
										error.custom_product_id ?
										<FormHelperText error={error.custom_product_id}>Insira uma customização</FormHelperText>
										: null
									}
								</FormControl>
							</Grid>
						}
						<Grid item xs={12} sm={12} md={12}>
							<TextField
								fullWidth
								variant="outlined"
								name="amount"
								type="number"
								label="Quantidade"
								style={{width: "90%"}}
								value={data ? data.amount : ""}
								InputProps={{inputProps:{min:0}}}
								onChange={handleChangeData}
								error={error.amount}
								helperText={error.amount ? "insira uma quantidade" : ""}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
								<InputField
									fullWidth
									mask="money"
									name="price"
									style={{width: "90%"}}
									value={{...data}.price}
									label="Preço do Produto"
									onChange={
										e => setData({...data, [e.target.name]: e.target.value})
									}
								/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<TextField
								fullWidth
								variant="outlined"
								type="date"
								name="stock_date"
								label="Data de entrada" 
								style={{width: "90%"}}
								placeholder="DD/MM/YYYY"
								value={data ? data.stock_date : ""}
								onChange={handleChangeData}
								InputLabelProps={{ shrink: true }}
								error={error.stock_date}
								helperText={error.stock_date ? "insira uma data" : ""}
							/>
						</Grid>
						<Grid item xs={12} sm={12} md={12}>
							<TextField
								fullWidth
								variant="outlined"
								type="date"
								name="due_date"
								label="Data de vencimento"
								style={{width: "90%"}}
								placeholder="DD/MM/YYYY"
								value={data ? data.due_date : ""}
								onChange={handleChangeData}
								InputLabelProps={{ shrink: true }}
								error={error.due_date}
								helperText={error.due_date ? "insira uma data" : ""}
							/>
						</Grid>
					</Grid>

					<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
							<Grid item xs={12} sm={12} md={12}>
								<Button 
									fullWidth
									style={{borderRadius:8, width:"90%"}}
									variant="contained" 
									color="primary" 
									size="medium" 
									type="submit"
									onClick={(e) => registerStock(e)} 
								>
									INSERIR
								</Button>
							</Grid>
						</Grid>

				</div>
			</Modal>
		</div>
	);
}
