import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CircularProgress,
	Dialog,
	Divider, Grid,
	Slide,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import moment from "moment";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import AddAvailability from "../Component/AddAvailability";
import RegisterSchedules from "../Component/RegisterSchedules";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
	root: {
		maxWidth: "90%",
	},
	content: {
		padding: 0,
	},
	statusContainer: {
		display: "flex",
		alignItems: "center",
	},
	actions: {
		justifyContent: "flex-end",
	},
	nowrap: {
		whiteSpace: "nowrap",
	},
}));

const Schedules = (props) => {
	const { className, loading = false, error = null } = props;
	const classes = useStyles();

	const [data, setData] = React.useState({});
	
	const { currentUser } = React.useContext(AuthContext);
	const { apiRequest } = React.useContext(ClientContext);
	
	const [loadingSchedules, setLoadingSchedules] = React.useState([])
	const [loadingAvailability, setLoadingAvailability] = React.useState([])
	
	const [open, setOpen] = React.useState(false)
	const handleClickClose = () => { setOpen(false) };
	const handleClose = () => { setOpen(false) }
	
	const registerSchedulesAv = () => {
		apiRequest("POST", "/schedules/add-schedules", { ...data })
		.then((res) => {
			setData({});
			handleClose();
		})
		.catch((err) => {
			alert(err);
		});
	}

	const GetAvailability = () => {
		apiRequest("GET", `/availability/list/all/${currentUser.companyProfiles[0].company_id}`, {
			service_id: 4,
		})
		.then((res) => {
			setLoadingAvailability(res);
		})
		.catch((err) => {
			console.log("erro", err);
		});
	};

	const removeSchedules = (value) => {
		apiRequest("DELETE", `/Schedules/delete-Schedules/${value.id}`)
		.then((res) => {
			let removedSchedules = loadingSchedules.filter(
				(item) => item !== value
			);
			setLoadingSchedules(removedSchedules);
		})
		.catch((err) => {
		});
	};

	const loadSchedules = () => {
		apiRequest("GET", `/schedules/all/${currentUser.companyProfiles[0].company_id}`)
		.then((res) => {
			setLoadingSchedules(res);
		})
		.catch((err) => {
		});
	};

	React.useEffect(() => {
		setData({});
		loadSchedules();
		GetAvailability();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div>
			<div className="col-lg-12">
				<div className="card">
					<Card className={clsx(className)}>
						<CardHeader title="Agendamentos" />
						<Divider />
						{loading || error ? (
							<CardContent align="center">
								{loading ? (
									<CircularProgress />
								) : (
									<div
										style={{
											textAlign: "center",
											color: "red",
											fontSize: 12,
										}}
									>
										{error}
									</div>
								)}
							</CardContent>
						) : (
							<CardContent className={classes.content}>
								<div className="table-responsive">
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Nome da sala</TableCell>
												<TableCell>Data</TableCell>
												<TableCell>Hora de inicio</TableCell>
												<TableCell>Período</TableCell>
												<TableCell>Status</TableCell>
												<TableCell>Cliente</TableCell>
												<TableCell>Excluir</TableCell>
											</TableRow>
										</TableHead>

										<TableBody>
											{loadingSchedules.length === 0 ? (
												<div />
											) : (
												loadingSchedules.map((schedules, index) => (
													<TableRow>
														<TableCell>{schedules.rooms.name}</TableCell>
														<TableCell>
															{schedules.schedules_dates?schedules.schedules_dates.date:""}
														</TableCell>
														<TableCell>
															{moment(
																schedules.schedules_dates?schedules.schedules_dates.date_time:""
															).format("h:mm:ss a")}
														</TableCell>
														<TableCell>
															{schedules.schedules_dates?schedules.schedules_dates.period:""}
														</TableCell>
														<TableCell>{schedules.type}</TableCell>
														<TableCell>
															{schedules.customer?schedules.customer.name:""}
														</TableCell>
														<TableCell>
															<Grid
																container
																direction="row"
																justifyContent="flex-start"
																alignItems="center"
																spacing={3}
															>
																<Grid item>
																	<DeleteIcon
																		fontSize="small"
																		style={{ cursor: "pointer" }}
																		onClick={() => removeSchedules(schedules)}
																	/>
																</Grid>
															</Grid>
														</TableCell>
													</TableRow>
												))
											)}
										</TableBody>
									</Table>
								</div>
								<Dialog
									TransitionComponent={Transition}
									onClose={handleClickClose}
									open={open}
									fullScreen
								>
									<RegisterSchedules /* loadService={() => {loadService()}} */ />
								</Dialog>
							</CardContent>
						)}
						<Divider />
					</Card>
				</div>
			</div>
			<div className="col-lg-12">
				<div className="card">
					<Card>
						<CardHeader title="Disponibilidades" action={<AddAvailability GetAvailability={() => {GetAvailability()}}  />} />
						<Divider />
						{loading || error ? (
							<CardContent align="center">
								{loading ? (
									<CircularProgress />
								) : (
									<div
										style={{
											textAlign: "center",
											color: "red",
											fontSize: 12,
										}}
									>
										{error}
									</div>
								)}
							</CardContent>
						) : (
							<CardContent className={classes.content}>
								<div className="table-responsive">
									<Table>
										<TableHead>
											<TableRow>
												<TableCell className={classes.nowrap}>
													Dia da semana (seg a dom)
												</TableCell>
												<TableCell className={classes.nowrap}>
													Hora de inicio
												</TableCell>
												<TableCell className={classes.nowrap}>
													Periodo
												</TableCell>
												<TableCell className={classes.nowrap}>
													Nome da sala
												</TableCell>
												{/* <TableCell className={classes.nowrap}>Status da sala</TableCell> */}
												<TableCell className={classes.nowrap}>
													Nome do serviço
												</TableCell>
												<TableCell className={classes.nowrap}></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{	
												(loadingAvailability.length === 0) ? <TableRow>
													<TableCell>Nenhuma disponibilidade inserida</TableCell>
												</TableRow>
												:loadingAvailability.map((av) => (
												<TableRow>
													<TableCell>{av.weekday}</TableCell>
													<TableCell>
														{moment(av.start_time).format("h:mm:ss a")}
													</TableCell>
													<TableCell>{av.period} Minutos</TableCell>
													<TableCell>
														{av.rooms && av.rooms.name ? (
															<Typography>{av.rooms.name}</Typography>
														) : (
															<Typography></Typography>
														)}
													</TableCell>
													{/* <TableCell>
														{av.rooms.active ? (
															<Typography>{av.rooms.active}</Typography>
														) : (
															<Typography></Typography>
														)}
													</TableCell> */}

													<TableCell>
														{av.services && av.services.name ? (
															<Typography>{av.services.name}</Typography>
														) : (
															<Typography></Typography>
														)}
													</TableCell>
													<TableCell>
														<RegisterSchedules avId={av.id} avWeekday={av.weekday} avPeriod={av.period} avStart_Time={av.start_time} />
													</TableCell>
													<TableCell>
														<Grid
															container
															direction="row"
															justifyContent="flex-start"
															alignItems="center"
															spacing={3}
														>
															<Grid item>
																<Button
																	fontSize="small"
																	style={{ cursor: "pointer" }}
																	onClick={() => registerSchedulesAv(av)}
																/>
															</Grid>
														</Grid>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						)}
						<Divider />

						<CardActions className={classes.actions}></CardActions>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default Schedules;
