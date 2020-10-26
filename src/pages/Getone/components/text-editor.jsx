import React from 'react';
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill, {Quill} from 'react-quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

const toolbarOptions = [
	['bold', 'italic', 'underline', 'strike'],                // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],                             // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],            // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],                    // outdent/indent
    [{ 'direction': 'rtl' }],                                                 // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],    // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],                    // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean'], 
    ['link','image']                                                        
];

class TextEditor extends React.Component {
        constructor(props) {
            super(props)
            this.state = { text: props.currentText };
            this.handleChange = this.handleChange.bind(this);
            this.modules = {
                toolbar:toolbarOptions,
                imageResize: {}
            };
        }
    
        handleChange(value) {
            this.setState({ text: value })
            this.props.onChangeInput(value, this.props.localConfig)
        }
    
        render() {
            return (
                <div>
                    <ReactQuill 
                        value={this.state.text}
                        onChange={this.handleChange}
                        formats={this.formats}
                        modules={this.modules} />
                </div>
            );
        }
	}
	
    export default TextEditor;