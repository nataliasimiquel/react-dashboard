import {
  Card, CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import AuthContext from "../../contexts/AuthContext";
import ClientContext from "../../contexts/ClientContext";
import RegisterService from "../Component/RegisterService";
import EditServices from './../Component/EditServices';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 0,
  },
  header: {
      height: "20",
  }
}));
  
export default function Service (props) {

  const classes = useStyles();

  const {className, loading = false, error = null } = props;
  const {currentUser} = React.useContext(AuthContext);
  const {apiRequest} = React.useContext(ClientContext);

  const [loadingServices, setLoadingServices] = React.useState([]);
  const [success, setSucess] = React.useState(undefined);
  const [alert, setAlert] = React.useState(undefined);
  const [errorMessage, setErrorMessage] = React.useState("");

  const getError = (err) => {
    setErrorMessage(err.message)
  }

  const removeServices = (value) => {
    apiRequest("PATCH", `/services/${value.id}/deactivate/${currentUser.companyProfiles[0].company_id}`)
    .then((res) => {
      let removedServices = loadingServices.filter((item) => item !== value);
      setLoadingServices(removedServices);
    })
    .catch((err) => {
      });
  };  


  const loadService = () => {

    if (success === 1) {
      setAlert(1)   
    }
    if (success === 2) {
        setAlert(2)   
    }
    apiRequest("GET", `/services/list/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setLoadingServices(res);
      })
      .catch((err) => {
      });
  };

  React.useEffect(() => {
    loadService();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    loadService();
  }, [success]);

  return (
    <div>
      {
        alert &&  ((alert === 1)
          ? <Alert severity="success">Sucesso!</Alert>
          : <Alert severity="error">{errorMessage || "error"}</Alert>
        ) 
      }
      <Card className={clsx(className)}>
        <CardHeader className={classes.header} action={<RegisterService
          getError={(err) => getError(err)} loadService={() => {loadService()}}
          setAlert={setAlert}  setSucess={setSucess} 
        />} title="Serviços" />
        <Divider />
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
                      <TableCell>OPÇÕES</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingServices.length === 0 ? (
                      <div/>
                      ) : (
                      loadingServices.map((service) => (
                        <TableRow>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <Grid container direction="row" justifyContent="flex-start" alignItems="center" spacing={3}>
                              <Grid item>
                                <EditServices service={service} />
                              </Grid>
                              <Grid item>
                                <DeleteIcon
                                  fontSize="small"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => removeServices(service)}
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
          </CardContent>
        )}
        <Divider />
      </Card>
    </div>
  );
};
