import PropTypes from 'prop-types';
import React from 'react';
import './FileUploader.scss';

var propTypes = {
    baseColor: PropTypes.string,
    activeColor: PropTypes.string
},

defaultProps = {
    baseColor: 'gray',
    activeColor: 'green',
    overlayColor: 'rgba(255,255,255,0.3)'
};

class FileUploader extends React.Component {
constructor(props) {
    super(props);
    
    this.state = {
        active: false,
        fileSrc: '',
        loaded: false
    }
    
    this.onDragEnter  = this.onDragEnter.bind(this);
    this.onDragLeave  = this.onDragLeave.bind(this);
    this.onDrop       = this.onDrop.bind(this);
    this.onFileChange = this.onFileChange.bind(this);
}

onDragEnter(e) {
    this.setState({ active: true });
}

onDragLeave(e) {
    this.setState({ active: false });
}

onDragOver(e) { 
    e.preventDefault(); 
}

onDrop(e) {
    e.preventDefault();
    this.setState({ active: false });
    this.onFileChange(e, e.dataTransfer.files[0]);
}

onFileChange(e, file) {
    var file = file || e.target.files[0],
        reader = new FileReader();
    
    reader.onload = (e) => {
        this.setState({ 
            fileSrc: reader.result, 
            fileType: file.type,
            loaded: true 
        }); 

        // this.props.onChange(reader.result)
        this.props.onChange(file)
    }
    
    reader.readAsDataURL(file);
    }

getFileObject() {
    return this.refs.input.files[0];
}

getFileString() {
    return this.state.fileSrc;
}

render() {
    let state = this.state,
        props = this.props,
        labelClass  = `uploader ${state.fileType && state.fileType.match(/image-*/) && 'loaded'}`,
        borderColor = state.active ? props.activeColor : props.baseColor,
        iconColor   = state.active 
            ? props.activeColor
            : (state.fileType && state.fileType.match(/image-*/)) 
                ? props.overlayColor 
                : props.baseColor;
    
    return (
        <label 
            className={labelClass}
            onDragEnter={this.onDragEnter}
            onDragLeave={this.onDragLeave} 
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            style={{outlineColor: borderColor, ...this.props.style}}>
                {
                    props.type === "video"
                    ? (props.fileSrc || state.fileSrc) &&
                        <video src={props.fileSrc || state.fileSrc} height="100%"></video>
                    : (props.fileSrc || state.fileSrc) &&
                    (
                        state.fileType && state.fileType.match(/image-*/) ||
                        props.fileType && props.fileType.match(/image-*/)
                    )
                    ? <img src={props.fileSrc || state.fileSrc} className={'loaded'}/>
                    : props.value
                        ? <span style={{color: 'green', fontWeight: 'bold'}}>{props.label} - Submetido</span>
                        : props.label
                }
                <i className="icon icon-upload" style={{ color: iconColor }}></i>
                <input type="file" accept={props.type === "video" ? "video/*" : '*'} onChange={this.onFileChange} ref="input" />
        </label>
    );
}
}

FileUploader.propTypes = propTypes;
FileUploader.defaultProps = defaultProps;

export default FileUploader;