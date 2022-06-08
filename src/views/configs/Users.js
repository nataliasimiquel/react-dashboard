import {
    Button, Card, CardContent, CircularProgress, Divider, Grid, Modal, Table, TableBody, TableCell,
    TableFooter,
    TableHead, TablePagination, TableRow, TextField, Toolbar, Typography
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import PropTypes from 'prop-types';
import InputField from '../../commons/InputField';
import AppContext from '../../contexts/AppContext';
import ClientContext from '../../contexts/ClientContext';
import { Colors, formatCpf } from '../../util/Util';
import TableTitle from '../Component/custom/TableTitle';
import FileDownload from 'js-file-download';
import TablePaginationActions from '../Component/custom/TablePaginationActions'

const Users = (props) => {
	const { loading = false, error = null } = props;

    const [users, setUsers] = React.useState([])
    const [profiles, setProfiles] = React.useState([])
    const [addingUser, setAddingUser] = React.useState(null)

    const [loadingUsers, setLoadingUsers] = React.useState(false)
    const [loadingSave, setLoadingSave] = React.useState(false)
    const [loadingExcel, setLoadingExcel] = React.useState(false)

    const [alert, setAlert] = React.useState(undefined);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const {apiRequest} = React.useContext(ClientContext)
    const {message} = React.useContext(AppContext)

    const loadUsers = () => {
        setLoadingUsers(true)

        apiRequest("GET", "/users/list")
        .then(res => {
            setLoadingUsers(false)
            setUsers(res)
        })
        .catch(err => {
            setLoadingUsers(false)
            message.error(err.message)
        })
    }
    
    const saveUser = () => {
        setLoadingSave(true)
        
        apiRequest("POST", "/users/save", addingUser)
        .then(res => {
            setLoadingSave(false)
            setAddingUser(null)
            loadUsers()
        })
        .catch(err => {
            setLoadingSave(false)
            message.error(err.message)
        })
    }

    const excelGenerete = () => {
        setLoadingExcel(true)

        apiRequest("POST", "/users/excel/generate", {}, true)
        .then(res => {
            FileDownload(res.data, res.filename || 'fridom.xlsx')
            setLoadingExcel(false)
        })
        .catch(err => {
            setLoadingExcel(false)
            console.log("erro dentro de excelGenerete",err.message)
        })
    }

    function createData(name, email, cpf, phone) {
        return { name, email, cpf, phone};
    }
      
    const rows = [
        ...users.map((user) => (
            createData(user.name, user.email, user.cpf, user.phone) 
        ))
    ].sort((a, b) => (a.email < b.email ? -1 : 1));

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

    React.useEffect(() => {
        loadUsers()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return <div>
        {
            alert &&  ((alert === 1)
            ? <Alert severity="success">Sucesso!</Alert>
            : <Alert severity="error">{errorMessage || "error"}</Alert>
            ) 
        }

        <Card style={{marginTop:"2%"}}>
            {loadingUsers || error ? (
                <CardContent align="center">
                    {loadingUsers ? (
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
                                <TableTitle title={"Usuários"}/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={3}></Grid>
                            <Grid item xs={12} sm={12} md={3}>
                                <Button 
                                    fullWidth
                                    color="primary" 
                                    variant="contained" 
                                    disabled={loadingExcel}
                                    onClick={() => {excelGenerete()}}
                                    style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
                                >
                                    Gerar Excel
                                </Button>
                            </Grid>
                        </Grid>
                    </Toolbar>
                    <Divider/>
                    <Table style={{overflowX: 'auto', marginTop: "0.5%"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{fontSize: 18, color: Colors.primary}}>Nome</TableCell>
                                <TableCell style={{fontSize: 18, color: Colors.primary}}>Email</TableCell>
                                <TableCell style={{fontSize: 18, color: Colors.primary}}>Cpf</TableCell>
                                <TableCell style={{fontSize: 18, color: Colors.primary}}>Telefone</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            (users.length === 0) ? <TableRow>
                                <TableCell style={{
                                    fontWeight: 'bold',
                                    opacity: 0.75, 
                                    whiteSpace: 'nowrap', 
                                    fontSize: 16, 
                                    color: '#4a4a4a'
                                }}>
                                    <Typography style={{color: 'black'}}>
                                        Nenhum usuário encontrada
                                    </Typography>
                                </TableCell>
                            </TableRow>
                            : (rowsPerPage > 0
                                ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                : rows
                            ).map(user => (
                                <TableRow>
                                    <TableCell style={{
                                        fontWeight: 'bold',
                                        opacity: 0.75, 
                                        whiteSpace: 'nowrap', 
                                        fontSize: 16, 
                                        color: '#4a4a4a'
                                    }}>
                                        <Typography style={{color: 'black'}}>
                                            {user.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell style={{
                                        fontWeight: 'bold',
                                        opacity: 0.75, 
                                        whiteSpace: 'nowrap', 
                                        fontSize: 16, 
                                        color: '#4a4a4a'
                                    }}>
                                        {user.email}
                                    </TableCell>
                                    <TableCell style={{
                                        fontWeight: 'bold',
                                        opacity: 0.75, 
                                        whiteSpace: 'nowrap', 
                                        fontSize: 16, 
                                        color: '#4a4a4a'
                                    }}>
                                        {formatCpf(user.cpf)}
                                    </TableCell>
                                    <TableCell style={{
                                        fontWeight: 'bold',
                                        opacity: 0.75, 
                                        whiteSpace: 'nowrap', 
                                        fontSize: 16, 
                                        color: '#4a4a4a'
                                    }}>
                                        {user.phone}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow> )
                        }
                        </TableBody>
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
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                            />
                        </TableFooter>
                    </Table>
                </div>
            )}
        </Card>

        <Modal 
            open={Boolean(addingUser)}
            onClose={e => setAddingUser(null)}
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
                    onClick={e => setAddingUser(null)} 
                    style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
                />

                <Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography 
                            fullWidth
                            variant="h5"
                            style={{ color: Colors.primary, width: "90%" }}
                        >
                            Cadastrar usuário
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container style={{margin:"5%"}} xs={12} sm={12} md={12} spacing={2}>
                    <Grid item xs={12} sm={12} md={12}>
                        <TextField
                            fullWidth
                            name="name" 
                            label="Usuário"
                            variant="outlined" 
                            style={{width:"90%"}} 
                            value={{...addingUser}.username}
                            onChange={e => setAddingUser({...addingUser, username: e.target.value})}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        <InputField 
                            fullWidth
                            label="Perfil"
                            component="select"
                            style={{width:"90%"}} 
                            value={{...addingUser}.profile_id}
                            options={profiles.map(p => ({text: p.name, value: p.id}))}
                            onChange={e => setAddingUser({...addingUser, profile_id: e.target.value})}
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
                            disabled={loadingSave} 
                            onClick={saveUser} 
                        >
                            SALVAR
                        </Button>
                    </Grid>
                </Grid>

            </div>
        </Modal>

    </div>
}

export default Users