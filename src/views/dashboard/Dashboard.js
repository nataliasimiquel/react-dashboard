import {
  Card, CardActions, CardContent, CardHeader, CircularProgress, Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow, Typography
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import React from "react";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
  content: {
    padding: 0,
  },
  inner: {
    minWidth: 800,
  },
  statusContainer: {
    display: "flex",
    alignItems: "center",
  },
  status: {},
  actions: {
    justifyContent: "flex-end",
  },
  nowrap: {},
}));

export default function Dashboard(props) {
  const { className, loading = false, error = null } = props;
  const classes = useStyles();
  
  const {currentUser} = React.useContext(AuthContext);
  const { apiRequest } = React.useContext(ClientContext);

  const [endingProducts, setEndingProducts] = React.useState([]);
  const [expiration, setExpiration] = React.useState([]);
  const [dailySale, setDailySale] = React.useState([]);

  const loadEndingProducts = () => {
    apiRequest("GET", `/stock/ending-products/${currentUser.companyProfiles[0].company_id}`)
      .then((res) => {
        setEndingProducts(res)
      })
      .catch((err) => {
        console.log("nao conseguiu carregar os produtos que estão acabando", err);
      });
  }

  const stockExpiration = () => {
    apiRequest("GET", `/stock/validate-stock-expiration/${currentUser.companyProfiles[0].company_id}`)
    .then((res) => {
      setExpiration(res)
    })
    .catch((err) => {
      console.log("nao conseguiu carregar os estoques q vao vencer", err);
    });
  }

  const getDailySale = () => {
    apiRequest("GET", `/stock/sale-of/date/by/${currentUser.companyProfiles[0].company_id}`)
    .then((res) => {
      setDailySale(res)
    })
    .catch((err) => {
      console.log("nao conseguiu carregar os estoques q vao vencer", err);
    });
  }

  React.useEffect(() => {
    getDailySale();
    stockExpiration()
    loadEndingProducts()
  },[]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div>
        <Typography variant="h5">Fridom Dashboard</Typography>
      </div>

      <div className="row">
        <div className="col-md-6 col-sm-6 col-lg-6 col-xl-3">
          <div className="card dash-widget">
            <div className="card-body">
              <span className="dash-widget-icon">
                <i className="fa fa-usd"></i>
              </span>
              <div className="dash-widget-info">
                <h3>${dailySale}</h3>
                <span>Renda diária</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <div className="card">
            <Card className={clsx(classes.root, className)}>
              <CardHeader title="Produtos a vencer (7 dias)" />
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
                          <TableCell className={classes.nowrap}>Id Stock</TableCell>
                          <TableCell className={classes.nowrap}>Produto</TableCell>
                          <TableCell className={classes.nowrap}>Data de Vencimento</TableCell>
                          <TableCell className={classes.nowrap}>Expirou</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {expiration.map(e => (
                        <TableRow>
                          <TableCell>{e.id}</TableCell>
                          <TableCell>{e.product.toLowerCase()}</TableCell>
                          <TableCell>{moment(e.due_date).format('L')}</TableCell>
                          {
                            e.spoiled === true 
                            ? <TableCell>Já expirou</TableCell>
                            : <TableCell>Não expirou</TableCell>
                          }
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

        <div className="col-lg-6">
          <div className="card">
            <Card className={clsx(classes.root, className)}>
              <CardHeader title="Produtos com estoque acabando (faixa de 15%)" />
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
                          <TableCell className={classes.nowrap}>Id Stock</TableCell>
                          <TableCell className={classes.nowrap}>Produto</TableCell>
                          <TableCell className={classes.nowrap}>Quantia</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {endingProducts.map(ep => (
                        <TableRow>
                          <TableCell>{ep.id}</TableCell>
                          <TableCell>{ep.product.name.toLowerCase()}</TableCell>
                          <TableCell>{ep.amount} restante</TableCell>
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
    </div>
  );
}
