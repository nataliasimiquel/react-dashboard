import { Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, Divider, Grid, Table, TableBody, TableCell, TableFooter, TableHead, TablePagination, TableRow, Toolbar, Typography } from "@material-ui/core";
import Add from "@material-ui/icons/Add";
import moment from "moment";
import React from "react";
import HtmlToReact from "react-html-parser";
import { useParams } from "react-router-dom";
import { Colors } from "../../util/Util";
import PropTypes from 'prop-types';
import TableTitle from "../Component/custom/TableTitle";
import ClientContext from "./../../contexts/ClientContext";
import AddContents from "./../Component/AddContents";
import DeleteContents from "./../Component/DeleteContents";
import EditContents from "./../Component/EditContents";
import TablePaginationActions from '../Component/custom/TablePaginationActions'


export default function Contents (props) {
	let { uuid } = useParams();

	const { loading = false, error = null } = props;
	const { apiRequest } = React.useContext(ClientContext);

	const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

	const [addingContent, setAddingContent] = React.useState(false);
	const [loadingContents, setLoadingContents] = React.useState(false);
	const [openHtml, setOpenHtml] = React.useState(false);
	const [contentType, setContentType] = React.useState(null)
	const [contentsAttributes, setContentsAttributes] = React.useState([])
	const [contents, setContents] = React.useState([])

	const getContentType = () => {
		apiRequest("GET", `/contents/contents-types/${uuid}`)
		.then((res) => {
			setContentType(res)
		})
		.catch((err) => {
			console.log("nao conseguiu carregar os contents-types", err);
		});
	}

	const getContentsAttributes = () => {
		apiRequest("GET", `/contents/contents-attributes-by/${uuid}`, uuid)
		.then((res) => {
			setContentsAttributes(res)
		})
		.catch((err) => {
			console.log("caiu no catch do getContentsAttributes", err);
		});
	}

	const getContents = () => {    
		setLoadingContents(true)
		apiRequest("GET", `/contents/contents-types/${uuid}/contents`)
		.then((res) => {
			setLoadingContents(false)
			setContents(res)
		})
		.catch((err) => {
			setLoadingContents(false)
			console.log("nao conseguiu carregar os contents-attributes", err);
		});
	}

	React.useEffect(() => {
		getContents(uuid)
		getContentType(uuid)
		getContentsAttributes(uuid)
	}, [uuid])

	const rows = [...contents]
	.sort((a, b) => (a.id < b.id ? -1 : 1));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    TablePaginationActions.propTypes = {
        count: PropTypes.number.isRequired,
        onPageChange: PropTypes.func.isRequired,
        page: PropTypes.number.isRequired,
        rowsPerPage: PropTypes.number.isRequired,
    };

	return (
		<div>
			<AddContents 
				open={addingContent}
				refresh={() => getContents()}
				contentTypeId={{...contentType}.id}
				onClose={() => setAddingContent(false)}
				contentsAttributes={contentsAttributes}
			/>

			<Card style={{marginTop:"2%"}}>
				{(loading || loadingContents || error) ? (
					<CardContent align="center">
						{(loading || loadingContents) ? (
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
								<Grid item xs={12} sm={12} md={6}>
									<TableTitle title={contentType?contentType.title:""}/>
								</Grid>
								<Grid item xs={12} sm={12} md={3}></Grid>
								<Grid item xs={12} sm={12} md={3}>
									<Button 
										fullWidth
										color="primary" 
										variant="contained" 
										startIcon={<Add />}
										style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
										onClick={() => setAddingContent(true)} 
									>
										Fazer um post
									</Button>
								</Grid>
							</Grid>
						</Toolbar>
						<Divider/>
						<Table>
							<TableHead>
								<TableRow>
									{contentsAttributes.map(ct => (
										<TableCell style={{fontSize: 18, color: Colors.primary}}>{ct.title}</TableCell>
									))}
									<TableCell style={{fontSize: 18, color: Colors.primary}}>Editar</TableCell>
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
										<Typography style={{color: 'black'}}>
											Nenhum conteúdo encontrado
										</Typography>
									</TableCell>
								</TableRow>
								:((rowsPerPage > 0
									? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									: rows
								).map(content => 
								<TableRow>
									{
										contentsAttributes.map(ct => {
											const item = content.attributes.find(att => att.content_attributes_id === ct.id)
											return (
											<TableCell style={{
												fontWeight: 'bold',
												opacity: 0.75, 
												whiteSpace: 'nowrap', 
												fontSize: 16, 
												color: '#4a4a4a'
											}}>
												{(item && item.value_attribute)
													? {
														date: <Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
															{moment(item.value_attribute).format("DD/MM/YYYY")}
														</Typography>,
														html: <Grid container direction="row" xs={12} sm={12} md={12}>
															<Grid item xs={12} sm={12} md={6}>
																<Button 
																	fullWidth
																	variant="text" 
																	color="primary" 
																	style={{ padding: "4%", width: "90%" }}
																	onClick={() => setOpenHtml(item.value_attribute)}
																>
																	Visualizar
																</Button>
															</Grid>
															<Grid item xs={12} sm={12} md={6}></Grid>
														</Grid>,
														image: <Grid container direction="row" xs={12} sm={12} md={12}>
															<Grid item xs={12} sm={12} md={7}>
																<img
																	fullWidth
																	src={item.value_attribute}
																	style={{
																		width: 80,
																		height: 80,
																		objectFit: 'contain',
																		cursor: 'pointer'
																	}}
																/>
															</Grid>
															<Grid item xs={12} sm={12} md={5}></Grid>
														</Grid>,
														pdf: <div>
														<a href={item.value_attribute} target="_blank">Link Pdf</a>
													</div>
													}[ct.type] || <Typography gutterBottom style={{fontSize: 16, color: 'black'}}>
														{
															item.value_attribute.length > 30
															?`${item.value_attribute.slice(0, 24)}...`
															:item.value_attribute
														}
													</Typography>
													: ""
												}
											</TableCell>
										)})
									}
									{
										(rows.length > 0)
										? <TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<EditContents 
												contentId={content.id}
												refresh={() => getContents()}
												contentTypeId={{...contentType}.id}
												contentsAttributes={contentsAttributes}
											/>  
										</TableCell>
										: ""
									}
									{
										(rows.length > 0)
										? <TableCell style={{
											fontWeight: 'bold',
											opacity: 0.75, 
											whiteSpace: 'nowrap', 
											fontSize: 16, 
											color: '#4a4a4a'
										}}>
											<DeleteContents 
												id={content.id} 
												refresh={() => getContents()}
											/>
										</TableCell>
										: ""
									}
								</TableRow>))}
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
										inputProps: { 'aria-label': 'Conteúdos por página' },
										native: true,
									}}
								/>
                        </TableFooter>
						</Table>
					</div>
				)}
			</Card>

			<Dialog
				open={Boolean(openHtml)}
				onClose={() => setOpenHtml(null)}
				fullWidth
				maxWidth="md"
			>
				<DialogContent>
					{HtmlToReact(openHtml)}
				</DialogContent>
				
				<DialogActions>
					<Button onClick={() => setOpenHtml(null)}>Fechar</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

	