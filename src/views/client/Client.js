import { Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import DeleteClient from './../Component/DeleteClient';
import EditClient from './../Component/EditClient';
import RegisterClient from "./../Component/RegisterClient";


const useStyles = makeStyles((theme) => ({
    content: {
        padding: 0,
    },
    header: {
        height: "20",
    }
}));
  
export default function Client (props) {

    const classes = useStyles();

    const {className, loading = false, error = null} = props;
    const {currentUser} = React.useContext(AuthContext);
    const {apiRequest} = React.useContext(ClientContext);

    const [loadingClient, setLoadingClient] = React.useState([]);
    const [success, setSucess] = React.useState(undefined);
    const [alert, setAlert] = React.useState(undefined);
    const [errorMessage, setErrorMessage] = React.useState("");

    const getError = (err) => {
        console.log((err.message))
        setErrorMessage(err.message)
    }
    
    const loadClient = () => {

        if (success === 1) {
            setAlert(1)   
        }
        if (success === 2) {
            setAlert(2)   
        }

        apiRequest("GET", `/customer/all/${currentUser.companyProfiles[0].company_id}`)
        .then((res) => {
            setLoadingClient(res);   
        })
        .catch((err) => {
            console.log("erro", err);
        });
    }; 

    React.useEffect(() => {
        loadClient();
    },[]); // eslint-disable-line react-hooks/exhaustive-deps

    React.useEffect(() => {
        loadClient();
    },[success]); // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
        <div>
            {
                alert &&  ((alert === 1)
                    ? <Alert severity="success">Sucesso!</Alert>
                    : <Alert severity="error">{errorMessage || "error"}</Alert>
                ) 
            }
           
            <Card className={clsx(className)}>
                <CardHeader className={classes.header} 
                    action={<RegisterClient
                    getError={(err) => getError(err)} 
                    loadClient={() => {loadClient()}}
                    setAlert={setAlert}  setSucess={setSucess} 
                    />} title="CLIENTES"
                />
                <Divider/>
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
                <CardContent className={classes.content}>
                    <div className="table-responsive">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>NOME</TableCell>
                                    <TableCell>CPF</TableCell>
                                    <TableCell>EMAIL</TableCell>
                                    <TableCell>TELEFONE</TableCell>
                                    <TableCell>OPÇÕES</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingClient.map(client => (
                                    <TableRow>
                                        <TableCell>{client.name}</TableCell>
                                        <TableCell>{client.cpf}</TableCell>
                                        <TableCell>{client.email}</TableCell>
                                        <TableCell>{client.phone}</TableCell>
                                        <TableCell>
                                            <Grid container justifyContent="flex-start" alignItems="center">
                                                <Grid item>
                                                    <EditClient setAlert={setAlert} client={client} loadClient={() => {loadClient()}} setSucess={setSucess} /> 
                                                </Grid>
                                                <Grid item>
                                                    <DeleteClient setSucess={setSucess} setAlert={setAlert} loadClient={() => {loadClient()}}  company_id={client.id} isOpen={false}/>
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
                <Divider/>
            </Card>
        </div>
    );
};