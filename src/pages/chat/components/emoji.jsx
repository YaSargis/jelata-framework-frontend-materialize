import React from 'react';
import { Popover, Icon } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';


let Search = (((LaNg || {}).Search ||{})[LnG || 'EN'] || 'Search...')
let Clean = (((LaNg || {}).Clean ||{})[LnG || 'EN'] || 'Clean')
let emNotFound = (((LaNg || {}).emNotFound ||{})[LnG || 'EN'] || 'Emoji not found')
let emSkinText = (((LaNg || {}).emSkinText ||{})[LnG || 'EN'] || 'Emoji not found')
let searchResult = (((LaNg || {}).searchResult ||{})[LnG || 'EN'] || 'search result')
let emComUsed = (((LaNg || {}).emComUsed ||{})[LnG || 'EN'] || 'Commonly used')
let emPp = (((LaNg || {}).emPp ||{})[LnG || 'EN'] || 'People')
let emNt = (((LaNg || {}).emNt ||{})[LnG || 'EN'] || 'Nature')
let emFoDr = (((LaNg || {}).emFoDr ||{})[LnG || 'EN'] || 'Food & Drink')
let emAct = (((LaNg || {}).emAct ||{})[LnG || 'EN'] || 'Activity')
let emTrPl = (((LaNg || {}).emTrPl ||{})[LnG || 'EN'] || 'Travel & Places')
let emObj = (((LaNg || {}).emObj ||{})[LnG || 'EN'] || 'Objects')
let emSym = (((LaNg || {}).emSym ||{})[LnG || 'EN'] || 'Symbols')
let emFlags = (((LaNg || {}).emFlags ||{})[LnG || 'EN'] || 'Flags')


const Emoji = ({visiblePicker, setStateUpComp, addEmoji}) => {
  return <Popover
    trigger='click'
    visible={visiblePicker}
    onVisibleChange={(e) => setStateUpComp({visiblePicker: e})}
    content={
      <Picker
        emojiSize={24}
        title=''
        style={styles.editor__picker}
        onSelect={event => {
          addEmoji(event);
          setStateUpComp({visiblePicker: false});
        }}
        i18n={{
          search: Search,
          clear: Clean, // Accessible label on "clear" button
          notfound: emNotFound,
          skintext: emSkinText,
          categories: {
            search: searchResult,
            recent: emComUsed,
            people: emPp,
            nature: emNt,
            foods: emFoDr,
            activity: emAct,
            places: emTrPl,
            objects: emObj,
            symbols: emSym,
            flags: emFlags,
            custom: 'Custom',
          },
          categorieslabel: 'Emoji categories', // Accessible title for the list of categories
          skintones: {
            1: 'Default Skin Tone',
            2: 'Light Skin Tone',
            3: 'Medium-Light Skin Tone',
            4: 'Medium Skin Tone',
            5: 'Medium-Dark Skin Tone',
            6: 'Dark Skin Tone',
          },
        }} 
      />}
  >
    <Icon 
      type="smile" 
      style={styles.editor__icon}
      onClick={() => setStateUpComp({visiblePicker: !visiblePicker})}
    />
  </Popover>
};

const styles = {
  editor__picker: {
    position: 'absolute',
    bottom: 0,
    left: -320
  },
  editor__icon: {
    fontSize: 24,
    color: '#1b90fa',
    marginLeft: 30
  },
}

export default Emoji;