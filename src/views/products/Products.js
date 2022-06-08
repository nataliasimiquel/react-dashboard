import {
	Card, CardContent, CircularProgress, Divider, Grid, IconButton, Table, TableBody, TableCell,
	TableFooter,
	TableHead, TablePagination, TableRow, Toolbar, Tooltip, Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';
import React from "react";
import InputField from "../../commons/InputField";
import { Colors, formatReais } from "../../util/Util";
import TablePaginationActions from '../Component/custom/TablePaginationActions';
import TableTitle from "../Component/custom/TableTitle";
import LinkCategory from "../Component/LinkCategory";
import LinkShipping from "../Component/LinkShipping";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import CustomProducts from "./CustomProducts";

export default function Products (props) {
	const {loading = false, error = null} = props;
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	const [alert, setAlert] = React.useState(undefined);
	const [success, setSucess] = React.useState(undefined);
	const [searchText, setSearchText] = React.useState("");
	const [errorMessage, setErrorMessage] = React.useState("");

	const [open, setOpen] = React.useState(false);

	const [data, setData] = React.useState({
		currentProduct: {},
		category_name: "Produtos por categorias"
	});
	const [categories, setCategories] = React.useState([]);
	const [loadingProducts, setLoadingProducts] = React.useState([]);
	const [filteredProducts, setFilteredProducts] = React.useState([]);
	const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
	

	const handleOpen = () => {setOpen(true)}
	const handleClose = () => {setOpen(false)}

	const getError = (err) => {setErrorMessage(err.message)}

	const handleChange = (e) => {
		setData(dd =>  ({ ...dd, [e.target.name]: e.target.value }))
	}

	const loadProducts = (text=null) => {
		apiRequest("GET", `/itens/all-products/${currentUser.companyProfiles[0].company_id}?name=${text}`)
		.then((res) => {
			setLoadingProducts(res);
			setFilteredProducts(res);
		})
		.catch((err) => {
			console.log("nao conseguiu carregar os produtos", err);
		});
	}; 

	const getCategories = () => {
		apiRequest("GET", `/categories/all-by/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setCategories([
				...res, 
				{category_name:'Produtos por categorias'}
			])
		})
		.catch((err) => {
			console.log("nao conseguiu pegar as categorias")
		});
	}

	const removeProducts = (value) => {
		apiRequest("PATCH", `/itens/delete-product/${value.id}`)
		.then((res) => {
			setAlert(1) 
			loadProducts()
		})
		.catch((err) => {
			console.log("nao conseguiu apagar o produto", err);
		});
	}

	React.useEffect(() => {
		getCategories()
		loadProducts();
	},[currentUser]);

	var list = (data.category_name !== 'Produtos por categorias')
		? filteredProducts.filter(item => !item.product_category?"":item.product_category[0].category.category_name === data.category_name)
		: filteredProducts;

	const filterProducts = (event) => {
		console.log(event.target.value);
		setSearchText(event.target.value)
		if(event.target.value.length > 3){
			console.log({loadingProducts});
			// loadProducts(event.target.value);
			setFilteredProducts(loadingProducts.filter(p => p.name.toLowerCase().includes(event.target.value.toLowerCase())));
		}else{
			setFilteredProducts(loadingProducts);
		}
	}

	TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
    };

	const rows = [...list];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
	<div>
	  {
		 alert &&  ((alert === 1)
		  ? <Alert severity="success">Sucesso!</Alert>
		  : <Alert severity="error">{errorMessage || "error"}</Alert>
		) 
	  }
		
		<Card style={{marginTop:"2%"}}>
			{loading || error ? (
			<CardContent align="center">
				{loading ? (
				<CircularProgress />
				) : (
				<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
					{error}
				</div>
				)}
			</CardContent>
			) : (
				<div className="table-responsive">
					<Toolbar>
						<Grid 
							container 
							spacing={2}
							direction="row" 
							style={{
								marginTop:'1%', 
								marginBottom:3
							}} 
						>
							<Grid item xs={12} sm={12} md={4}>
								<InputField
									fullWidth	
									value={searchText}
									label="Buscar por Nome"
									onChange={filterProducts}
								/>
							</Grid>
							<Grid item xs={12} sm={12} md={8}></Grid>
							<Grid item xs={12} sm={12} md={6}>
								<TableTitle title={"Produtos"}/>
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								{/* <Select
									fullWidth 
									variant="outlined"
									name="category_name"
									onChange={handleChange}
									value={data.category_name}
									defaultValue={'TODOS'}
									inputProps={{ 'aria-label': 'Without label' }}
								>
									{categories && categories.map((c) => (
										<MenuItem value={c.category_name}>
											{c.category_name}
										</MenuItem>
									))}
								</Select> */}
							</Grid>
							<Grid item xs={12} sm={12} md={3}>
								<CustomProducts
									open={open}
									setData={setData}
									product={data.currentProduct}
									handleOpen={handleOpen}
									handleClose={handleClose}

									setAlert={setAlert} 
									setSucess={setSucess} 
									getError={(err) => getError(err)} 
									loadProducts={() => {loadProducts()}}
								/>
							</Grid>
						</Grid>
					</Toolbar>
					<Divider/>
					<Table style={{overflowX: 'auto', marginTop: "0.5%"}}>
						<TableHead>
							<TableRow>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Nome</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Categoria</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Adicionar Categoria</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Frete</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Editar</TableCell>
								<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
						{
							(rows.length === 0) ? <TableRow>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Typography style={{color: 'black'}}>
										Nenhum produto encontrado
									</Typography>
								</TableCell>
							</TableRow>
							: (rowsPerPage > 0
								? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								: rows
							).map(item => (
							<TableRow>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
										{item.name}
									</Typography>
								</TableCell>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
										{formatReais(item.price)}
									</Typography>
								</TableCell>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Grid container direction="row" xs={12} sm={12} md={12}>
										<Grid item xs={12} sm={12} md={8}> 
											<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
												{
													(!item.product_category || item.product_category.length===0)
													?"Nenhuma categoria"
													:item.product_category[0].category.category_name
												}
											</Typography>
										</Grid>
									</Grid>
								</TableCell>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Grid container direction="row" xs={12} sm={12} md={12}>
										<Grid item xs={12} sm={12} md={9}> 
											<LinkCategory 
												categories={categories}
												category={item.product_category}
												product_id={item.id} 
												loadProducts={() => loadProducts()}
											/>
										</Grid>
									</Grid>
								</TableCell>
								<TableCell style={{
									fontWeight: 'bold',
									opacity: 0.75, 
									whiteSpace: 'nowrap', 
									fontSize: 16, 
									color: '#4a4a4a'
								}}>
									<Grid container direction="row" xs={12} sm={12} md={12}>
										<Grid item xs={12} sm={12} md={9}> 
											<LinkShipping 
												setAlert={setAlert} 
												setSucess={setSucess} 
												product_id={item.id} 
												shipping={item.shipping}
												getError={(err) => getError(err)} 
												loadProducts={() => loadProducts()}
											/>
										</Grid>
									</Grid>
								</TableCell>
								<TableCell 
									style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}
								>
									<Tooltip title="Editar">
										<IconButton 
											onClick={() => {
												handleOpen();
												setData(sd => ({
													...sd, 
													currentProduct: item
												}));
											}}
										>
											<EditIcon
												fontSize="medium" 
												style={{cursor:'pointer', color: 'black'}} 
											/>
										</IconButton>
									</Tooltip>

								</TableCell>
								<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
								}}>
									<Tooltip title="Deletar">
										<IconButton onClick={() => {
											removeProducts(item)
										}}>
											<DeleteIcon 
												fontSize="medium"
												style={{cursor:'pointer', color: 'black'}} 
											/>
										</IconButton>
									</Tooltip>
								</TableCell>
							</TableRow>
							)) 
						}
						</TableBody>
						{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow> )
							}
						<TableFooter>
							<TablePagination
									colSpan={6}
									page={page}
									count={rows.length}
									rowsPerPage={rowsPerPage}
									onPageChange={handleChangePage}
									ActionsComponent={TablePaginationActions}
									onRowsPerPageChange={handleChangeRowsPerPage}
									rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
									SelectProps={{
										inputProps: { 'aria-label': 'Produtos por página' },
										native: true,
									}}
								/>
						</TableFooter>
					</Table>
				</div>
			)}
		</Card>
	</div>
  );
};

