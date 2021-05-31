import React from 'react';
import { Form, Input, Button, Icon, Tooltip, Modal } from 'antd';
import { compose, withStateHandlers, withHandlers } from 'recompose';
//import { MyIcons } from 'src/libs/icons';
const { TextArea } = Input;

import Emoji from './emoji';

let writeMessage = (((LaNg || {}).writeMessage ||{})[LnG || 'EN'] || 'Write a message')
let FilE = (((LaNg || {}).FilE ||{})[LnG || 'EN'] || 'File')
let chatChFile = (((LaNg || {}).chatChFile ||{})[LnG || 'EN'] || 'Choose the file')
let chatChImage = (((LaNg || {}).chatChImage ||{})[LnG || 'EN'] || 'Choose the image')
let sendComment = (((LaNg || {}).sendComment ||{})[LnG || 'EN'] || 'Send')


const Editor = ({ 
	onChange, onSubmit, submitting, value, set_state, visiblePicker, refForm, 
	refFormImg, answerComment, addEmoji, setStateUpComp, handleChangeImg
}) => {
	return (
		<div>
			{answerComment ? (
					<div style={styles.comment}>
						<Icon type='message' style={{fontSize: 20, marginLeft: 20}} />
						<div style={{display: 'flex', alignItems: 'center'}}>
							<div style={styles.comments__itemAuthor}>{answerComment.login}</div>
							<div style={{marginRight: 50}}>{answerComment.text === '' ? FilE : answerComment.text.length > 25 ? answerComment.text.slice(0, 25).concat('...') : answerComment.text}</div>
						</div>
						<Icon 
							type='close' 
							style={{fontSize: 15, marginRight: 20, cursor: 'pointer'}}
							onClick={() => setStateUpComp({answerComment: null})}  
						/>
					</div>
				)
				: null
			}
			<Form>
				<div style={{margin: '0 auto', maxWidth: 800}}>
					<Form.Item>
						<TextArea 
							onChange={onChange} 
							value={value} 
							style={styles.editor__textarea} 
							autoSize={{maxRows: 6}}
							placeholder={writeMessage+'...'}
							onPressEnter={e => {
								if(e.keyCode == 13 && e.shiftKey == false) {
									e.preventDefault();
									onSubmit();
								}
							}}
						/>
					</Form.Item>
				</div>
			</Form>
			<div style={{margin: '0 auto', maxWidth: 800, textAlign: 'right'}}>
				<Form.Item>
					<span style={{position: 'absolute', left: -130, top: -5}}>
						<Tooltip title={chatChImage}>
							<form ref={refFormImg}>
								<label htmlFor="image-input" style={{width: 30, height: 30, cursor: 'pointer'}}>
									<Icon
										type='picture'
										style={{fontSize: 25, color: '#1b90fa'}}
									/>
								</label>
								<input
									id='image-input'
									accept='image/*'
									style={{display: 'none'}}
									type='file'
									onChange={(event) => handleChangeImg(event)}
								/>
							</form>
						</Tooltip>
					</span>
					<span className="editor__icon" style={{ position: 'absolute', left: -80, top: -7}}>
						<Tooltip title={chatChFile}>
							<form ref={refForm}>
								<label htmlFor="file-input" style={{width: 30, height: 30, cursor: 'pointer'}}>
									<Icon
										component='clip'
										style={{fontSize: 25}}
									/>
								</label>
								<input
									multiple
									id='file-input'
									style={{display: 'none'}}
									type='file'
									onChange={(event)=> onSubmit(event.target.files, '', 'files')}
								/>
							</form>
						</Tooltip>
					</span>
					<span style={styles.editor__iconContainer}>
						<Emoji
							visiblePicker={visiblePicker}
							setStateUpComp={set_state}
							addEmoji={addEmoji}
						/>        
					</span>
					 
					<Button htmlType="submit" loading={submitting} onClick={() => onSubmit()} type="primary">
						{sendComment}
					</Button>
				</Form.Item>
			</div>                  
			
		</div>
	)
};

const enhance = compose(
  withStateHandlers(
    ({
      inState = {
        visiblePicker: false,
      }
    }) => ({
      visiblePicker: inState.visiblePicker,
    }),
    {
      set_state: state => obj => {
        let _state = {...state},
            keys = _.keys(obj);
        keys.map(key => _state[key ] = obj[key]);
        return _state;
      }
    }
  ),
  withHandlers({
    handleChangeImg: ({set_state, onSubmit}) => event => {
      const reader = new FileReader;
      reader.addEventListener("load", function () {
        set_state({imageUrl: reader.result})
      }, false);
      const file = event.target.files[0];
      if(file) {
        reader.readAsDataURL(file);
      }
      onSubmit(event.target.files, '', 'image');
    }
  })
);

const styles = {
  comment: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    maxWidth: 800,
    borderRadius: 10,
    backgroundColor: '#99cdf8',
    position: 'absolute',
    left: '50%', 
    top: -30,
    transform: 'translate(-50%, 0)'
  },
  editor__textarea: {
    maxWidth: 800,
    margin: '0 auto'
  },
  editor__iconContainer: {    
    position: 'absolute',
    top: -7,
    left: -70
  },
  comments__itemAuthor: {
    margin: '0 10px 0 50px',
    color: 'aliceblue',
    fontSize: 14,
    backgroundColor: '#4586c2',
    padding: '0 4px',
    borderRadius: 10,
  },
};

export default enhance(Editor);