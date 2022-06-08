import {
    Button,
    Divider, Grid, IconButton, Table, TableBody, TableCell,
    TableHead, TableRow, Toolbar, Tooltip
} from "@material-ui/core";
import { Colors } from "../../../util/Util";
import TableTitle from "../../Component/custom/TableTitle";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";


export default function CustomTable (props) {
return (
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
                    <TableTitle title={props.title}/>
                </Grid>
                <Grid item xs={12} sm={12} md={3}></Grid>
                <Grid item xs={12} sm={12} md={3}>
                    {
                        (props.buttonFunction && props.buttonBody)
                        ? <Button 
                            fullWidth
                            color="primary" 
                            variant="contained" 
                            onClick={() => { props.handleOpen() }}
                            style={{ padding: '10px 0px 10px 0px', borderRadius:8 }}
                        >
                            {props.buttonBody}
                        </Button>
                        : <div></div>
                    }
                </Grid>
            </Grid>
        </Toolbar>

        <Divider/>
        
        <Table 
            style={{
                overflowX: 'auto', 
                marginTop: "0.5%"
            }}
        >
            <TableHead>
                <TableRow>
                {
                    (
                        (!props.listHeader) ||
                        (props.listHeader.length === 0 )
                    )
                    ? <TableCell 
                        style={{
                            fontSize: 18, 
                            color: Colors.primary
                        }}
                    >
                        Sem resultados dentro da lista
                    </TableCell>
                    : props.listHeader.map((title) => (
                        <TableCell 
                            style={{
                                fontSize: 18, 
                                color: Colors.primary
                            }}
                        >
                            {title} 
                        </TableCell>
                    ))
                }
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    (
                        (!props.listBody) ||
                        (props.listBody.length === 0 )
                    )
                    ? <TableRow>
                        <TableCell style={{fontSize: 18, color: Colors.primary}}>
                            Sem resultados dentro da lista
                        </TableCell>
                    </TableRow>
                    : props.listBody.map((item) => (
                        <TableRow>
                            {
                                item.map(i => (
                                    (i === "edit")
                                    ? <TableCell style={{fontSize: 18, color: Colors.primary}}>
                                        <Tooltip title="Editar">
                                            <IconButton 
                                                onClick={() => {
                                                    props.handleOpenEdit(item);
                                                }} 
                                            >
                                                <EditIcon
                                                    fontSize="medium" 
                                                    style={{cursor:'pointer', color: 'black'}} 
                                                />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    : (i === "delete")
                                        ? <TableCell style={{fontSize: 18, color: Colors.primary}}>
                                            <Tooltip title="Deletar">
                                                <IconButton 
                                                    onClick={() => {
                                                        props.handleOpenDelete(item)
                                                    }}
                                                >
                                                    <DeleteIcon 
                                                        fontSize="medium"
                                                        style={{cursor:'pointer', color: 'black'}} 
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                        : (i && i.key && i.key === "image")
                                        ?
                                        <TableCell gutterBottom style={{fontSize: 16, color: 'black'}}>
                                            {console.log({i})}
                                            <img src={i.value} style={{width:100, height:100}} />
                                        </TableCell>
                                        : 
                                        <TableCell gutterBottom style={{fontSize: 16, color: 'black'}}>
                                            {i}
                                        </TableCell>
                                ))
                            }
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  );
};

