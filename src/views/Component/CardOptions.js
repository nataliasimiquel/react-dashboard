import { Button, Card, CircularProgress, Divider, Grid, IconButton, InputAdornment, Table, TableBody, TableCell, TableHead, TableRow, TextField, Toolbar, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import InputField from "../../commons/InputField";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";
import FileUploader from "./FileUploader/FileUploader";
import DeleteIcon from "@material-ui/icons/Delete";

export default function CardOptions(props) {
	const {apiRequest} = React.useContext(ClientContext);

    const [loadFileError, setLoadFileError] = React.useState(null)
	const [loadFile, setLoadFile] = React.useState(false)

    const onLoadFile = (event, curr) => {
		setLoadFile(true)
		setLoadFileError(null)

		let formData = new FormData();
		formData.append("File", event)

		apiRequest("POST", `/contents/file/admin-products`, formData)
		.then(res => {
			if(!res.file) throw new Error("Falha ao salvar imagem");
            props.setData(data => [
                ...data.filter(item => item.attributes.some(att => !curr.attributes.includes(att))),
                {...curr, image: res.file},
            ])
			setLoadFile(false)
		})
		.catch((err) => {
			setLoadFileError(err)
			setLoadFile(false)
		})
	}

    const handleChangeData = (event, curr) => {
        const name = event.target.name;
        const value = event.target.value;
        props.setData(data => [
            ...data.filter(item => item.attributes.some(att => !curr.attributes.includes(att))),
            {...curr, [name]: value},
        ])
	};

    return (
        <Card 
            variant="outlined"
            style={{
                margin: 5,
                borderRadius: 10,
                padding: "20px 20px 20px 20px",
            }}
        >
            <Grid
                container 
                direction="row"
            >
                <Grid 
                    item
                    xs={4} sm={4} md={1}
                >
                    <div style={{padding: "5px 0px 5px 8px"}}>
                        {props.icon}
                    </div>
                </Grid>
                <Grid 
                    item
                    xs={8} sm={8} md={8}
                >
                    <Grid container direction="column">
                        <Grid item>
                            <Typography 
                                variant="h6"
                                style={{ 
                                    //marginLeft: 10,
                                    marginBottom: 5,
                                    fontWeight: "bolder",
                                    color: Colors.primary,
                                }}
                            >
                                {props.title}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography 
                                variant="body1"
                                style={{ 
                                    //marginLeft: 10,
                                    marginBottom: 5,
                                }}
                            >
                                {props.body}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={1}></Grid>
                <Grid 
                    item
                    xs={12} sm={12} md={2}
                >
                    <Button 
                        fullWidth
                        color="primary" 
                        variant="contained"
                        style={{marginTop:5, borderRadius:15}}
                        onClick={props.onClick}
                    >
                        {props.button}
                    </Button>
                </Grid>
            </Grid>
            {
                (props.data &&
                props.data.length>0)
                ? <Divider style={{marginTop:5}}/>
                : <div></div>
            }
            {
               (props.data &&
               props.data.length>0)
                ? <Grid
                    container 
                    direction="row"
                >
                    <Grid 
                        item 
                        xs={12} sm={12} md={12}
                    >
                        <div className="table-responsive">
                            <Toolbar>
                                <Typography 
                                    variant="subtitle1"
                                    style={{ 
                                        marginTop: 20,
                                        fontWeight: "bolder",
                                    }}
                                >
                                    {props.titleList}
                                </Typography>
                            </Toolbar>
                            <Table style={{overflowX: 'auto'}}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell 
                                            style={{
                                                fontSize: 16, 
                                                fontWeight: "bold",
                                                color: Colors.primary,
                                            }}
                                        >
                                            Foto
                                        </TableCell>
                                        <TableCell 
                                            style={{
                                                fontSize: 16, 
                                                fontWeight: "bold",
                                                color: Colors.primary,
                                            }}
                                        >
                                            Variações
                                        </TableCell>
                                        <TableCell 
                                            style={{
                                                fontSize: 16, 
                                                fontWeight: "bold",
                                                color: Colors.primary,
                                            }}
                                        >
                                            Preço
                                        </TableCell>
                                        <TableCell 
                                            style={{
                                                fontSize: 16, 
                                                fontWeight: "bold",
                                                color: Colors.primary,
                                            }}
                                        >
                                            Peso
                                        </TableCell>
                                         <TableCell 
                                            style={{
                                                fontSize: 16, 
                                                fontWeight: "bold",
                                                color: Colors.primary,
                                            }}
                                        >
                                            
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.data &&
                                        props.data
                                        .sort((a,b) => a.simpleTitle > b.simpleTitle?1:-1)
                                        .map((item, itemIndex) => { 
                                            return(
                                                <TableRow 
                                                    style={(itemIndex % 2 === 0)
                                                        ?{backgroundColor: "#f7f7f7"}
                                                        :{backgroundColor: "white"}
                                                    }
                                                >
                                                    <TableCell> 
                                                        {/* <img 
                                                            src={item.image} 
                                                            style={{
                                                                width: 130, 
                                                                height: 130, 
                                                                objectFit: 'contain'
                                                            }} 
                                                        /> */}

                                                        <FileUploader
                                                            onChange={(e) => {onLoadFile(e, item)}}
                                                            label={"+ imagem JPEG/PNG"}
                                                            style={{width: 65, height: 65}}
                                                        />
                                                        {
                                                            loadFileError && 
                                                            <div style={{fontSize: 10, color: 'red'}}>{loadFileError}</div>
                                                        }
                                                    </TableCell>
                                                    <TableCell style={{fontSize: 14}}>  
                                                        {item.simpleTitle}
                                                    </TableCell>
                                                    <TableCell>  
                                                        <InputField
                                                            mask="money"
                                                            name="price"
                                                            label="Preço"
                                                            style={{maxWidth: 180}}
                                                            value={{...item}.price}
                                                            onChange={(e) => {handleChangeData(e, item)}}
                                                        />
                                                    </TableCell>
                                                    <TableCell>  
                                                        <TextField 
                                                            fullWidth
                                                            type="number" 
                                                            name="nVlPeso" 
                                                            variant="outlined" 
                                                            style={{maxWidth: 180}}
                                                            value={{...item}.nVlPeso}
                                                            InputLabelProps={{ shrink: true }}
                                                            onChange={(e) => {handleChangeData(e, item)}}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">Kg</InputAdornment>,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{
                                                        fontWeight: 'bold',
                                                        opacity: 0.75, 
                                                        whiteSpace: 'nowrap', 
                                                        fontSize: 16, 
                                                        color: '#4a4a4a'
                                                    }}>
                                                        <Tooltip title="Deletar">
                                                            <IconButton disabled={props.loadingRemoveCustomization} onClick={() => {
                                                                props.removeProductCustomization(item)
                                                            }}>
                                                                {
                                                                    (props.loadingRemoveCustomization && (item.id === props.customizationToRemoveId))
                                                                    ? <CircularProgress />
                                                                    :
                                                                    <DeleteIcon 
                                                                        fontSize="medium"
                                                                        style={{cursor:'pointer', color: 'black'}} 
                                                                    />
                                                                }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </TableRow>
                                                )
                                            })
                                    }
                                </TableBody>
                            </Table>
                        </div>
                    </Grid>
                </Grid>
                : <div></div>
            }
        </Card>
    )
}