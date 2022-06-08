import {
	Card, Grid,
	CardContent, Toolbar, CircularProgress, Divider,
	Table, Typography,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Tooltip,
} from "@material-ui/core";
import React from "react";
import DeleteCategories from "../Component/DeleteCategories";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import AddCategories from "./../Component/AddCategories";
import EditCategories from "../Component/EditCategories"
import Alert from '@material-ui/lab/Alert';
import { Colors } from "../../util/Util";
import TableTitle from "../Component/custom/TableTitle";

export default function Categories(props) {
	const {className, loading = false, error = null,} = props;
	const {currentUser} = React.useContext(AuthContext);
	const {apiRequest} = React.useContext(ClientContext);

	const [loadingCategories, setLoadingCategories] = React.useState([]);
	const [success, setSucess] = React.useState(undefined);
	const [alert, setAlert] = React.useState(undefined);
	const [errorMessage, setErrorMessage] = React.useState("");

	const getError = (err) => {
		setErrorMessage(err.message)
	}

	const loadCategories = () => {
		apiRequest("GET", `/categories/all-by/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setLoadingCategories(res);
		})
		.catch((err) => {
			console.log("erro", err);
		});
	};

	React.useEffect(() => {
		loadCategories();
	},[]);

	React.useEffect(() => {
		loadCategories();
	},[success]);

	return (
		<div>
			{
				alert &&  ((alert === 1)
					? <Alert severity="success">Sucesso!</Alert>
					: <Alert severity="error">{errorMessage}</Alert>
				) 
			}
			
			<Card style={{marginTop:"2%"}}>
				{loading || error 
				? (
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
								<Grid item xs={10} md={3}>
									<TableTitle title={"Categorias"}/>
								</Grid>
								<Grid item xs={2} md={6}></Grid>
								<Grid item xs={12} md={3}>
									<AddCategories 
										getError={(err) => getError(err)} 
										loadCategories={() => {loadCategories()}} 
										setAlert={setAlert} setSucess={setSucess}
									/>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Nome</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Editar</TableCell>
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Deletar</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{
									(loadingCategories.length === 0) ? <TableRow>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Typography style={{color: 'black'}}>
												Nenhuma categoria encontrada
											</Typography>
										</TableCell>
									</TableRow>
									: loadingCategories && 
									loadingCategories.map(categories => (
									<TableRow>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
												{categories.category_name}
											</Typography>

										</TableCell>
										<TableCell style={{
										fontWeight: 'bold',
										opacity: 0.75, 
										whiteSpace: 'nowrap', 
										fontSize: 16, 
										color: '#4a4a4a'
										}}>
											<Tooltip title="Editar">
												<EditCategories
													id={categories.id}
													name={categories.category_name} 
													getError={(err) => getError(err)} 
													loadCategories={() => {loadCategories()}} 
													setAlert={setAlert} setSucess={setSucess}
												/>
											</Tooltip>
											
										</TableCell>
										<TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<Grid container justifyContent="flex-start" alignItems="center">
												<Grid item>
													<DeleteCategories 
														id={categories.id} 
														setAlert={setAlert} 
														setSucess={setSucess} 
														loadCategories={() => {loadCategories()}} 
													/>
												</Grid>
											</Grid>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				)}
			</Card>
		</div>
	);
};
