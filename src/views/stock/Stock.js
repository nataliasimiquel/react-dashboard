import {
	Card, CardContent, CircularProgress, Divider, Grid, Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	Toolbar, Typography
} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import moment from 'moment';
import React from "react";
import { Colors, formatReais } from "../../util/Util";
import TablePaginationActions from "../Component/custom/TablePaginationActions";
import TableTitle from "../Component/custom/TableTitle";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import ConfirmDelete from "./../Component/ConfirmDelete";
import LossStock from "./../Component/LossStock";
import RegisterStock from "./../Component/RegisterStock";
import PropTypes from 'prop-types';
import InputField from "../../commons/InputField";


export default function Stock (props) {
	const {loading = false, error = null} = props;
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	const [loadingStock, setLoadingStock] = React.useState([]);
	const [alert, setAlert] = React.useState(undefined);
	const [success, setSucess] = React.useState(undefined);
	const [errorMessage, setErrorMessage] = React.useState("");
	const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [searchText, setSearchText] = React.useState("");
	const [filteredStock, setFilteredStock] = React.useState([]);


	const getError = (err) => {
		//console.log((err.message))
		setErrorMessage(err.message)
	}
	
	const loadStock = () => {
		if (success === 1) { setAlert(1) }
		if (success === 2) { setAlert(2) }

		apiRequest("GET", `/stock/all-by/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setLoadingStock(res);
			setFilteredStock(res);
		})
		.catch((err) => {
			console.log("nao foi possivel pegar os estoques", err)
		})
	}

	React.useEffect(() => {
		loadStock();
	},[]); // eslint-disable-line react-hooks/exhaustive-deps

	React.useEffect(() => {
		loadStock();
	},[success]); 

	var list = filteredStock;

	const filterStock = (event) => {
		console.log(event.target.value);
		setSearchText(event.target.value)
		if(event.target.value.length > 3){
			setFilteredStock(loadingStock.filter(p => p.product.name.toLowerCase().includes(event.target.value.toLowerCase())));
		}else{
			setFilteredStock(loadingStock);
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
					? <Alert severity="success">SUCESSO!</Alert>
					: <Alert severity="error">{errorMessage}</Alert>
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
										onChange={filterStock}
									/>
								</Grid>
								<Grid item xs={12} sm={12} md={8}></Grid>
								<Grid item xs={12} sm={12} md={9}>
									<TableTitle title={"Estoque"}/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}>
									<RegisterStock 
										loadStock={() => {loadStock()}} 
										setAlert={setAlert} 
										setSucess={setSucess} 
										getError={getError}
									/>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>ID</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Produto</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Customização</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Quantia</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Data de entrada</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Vencimento</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Preço/u</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Perdas</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rows.length === 0) ? <TableRow>
									<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
										Nenhum estoque encontrado
									</TableCell>
								</TableRow>
								:(rowsPerPage > 0
									? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									: rows
								).map(s => (
								<TableRow>
									<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}>
										<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
											{s.id}
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
											{
												(s.product.length === 0)
												? "Sem nome do produto"
												: s.product.name.toLowerCase()
											}
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
											{
												(s.customization && s.customization.id)
												? s.customization.title
												: "-"
											}
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
											{s.amount}
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
											{moment(s.stock_date).format("DD/MM/yyyy")}
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
											{moment(s.due_date).format("DD/MM/yyyy")}
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
										{
											(s.price === null)
											? "Sem preço"
											: formatReais(s.price)
										}
										</Typography>

									</TableCell>
									<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}>
										<LossStock 
											stockId={s.id} 
											onOpen={false}
											setAlert={setAlert} 
											setSucess={setSucess} 
											getError={getError}
											stockAmount={s.amount}
											loadStock={() => {loadStock()}} 
										/>
									</TableCell>
									<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
									}}>
										<ConfirmDelete 
											isOpen={false}
											stock_id={s.id} 
											setAlert={setAlert} 
											setSucess={setSucess} 
											loadStock={() => {loadStock()}} 
										/>
									</TableCell>
								</TableRow>
								))} 
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
										inputProps: { 'aria-label': 'Estoque por página' },
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

