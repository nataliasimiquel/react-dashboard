import React from 'react'
import { Colors } from '../../../util/Util'
import { Typography } from '@material-ui/core'

const TableTitle = (props) => (
    <Typography 
        style={{ 
            fontSize: 32,
            fontWeight: "bolder",
            color: Colors.primary,
            fontFamily: "sans-serif",
        }}
    >
        {props.title}
    </Typography>
)

export default TableTitle