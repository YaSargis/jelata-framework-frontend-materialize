import React from "react"
import { useDispatch } from 'react-redux'
import { actions } from '../reducer'

import { Layout, Button } from "antd"

let chatWTW = (((LaNg || {}).chatWTW ||{})[LnG || 'EN'] || 'Select in the chat list whom you would like to write')
let chatOCC = (((LaNg || {}).chatOCC ||{})[LnG || 'EN'] || 'or create a chat')
let chatCrGroup = (((LaNg || {}).chatCrGroup ||{})[LnG || 'EN'] || 'cretae a group')
let chatCrDialog = (((LaNg || {}).chatCrDialog ||{})[LnG || 'EN'] || 'create a dialog')


export const InitLayout = () => {
	const dispatch = useDispatch()

	return (
		<Layout style={styles.thirdLayout}>
			<div
				style={styles.containerInit}
				className="slide-in-elliptic-top-fwd"
			>
				<div style={styles.textCenter}>
					{chatWTW},
				</div>
				<div style={styles.textCenter}>{chatOCC}</div>
				<div>
					<Button
						style={styles.sider__btn}
						onClick={() => dispatch(actions.modalInit(true))}
						icon="usergroup-add"
					>
						{chatCrGroup}
					</Button>
					<Button
						style={styles.sider__btn}
						onClick={() => dispatch(actions.modalInitPerson(true))}
						icon="user-add"
					>
						{chatCrDialog}
					</Button>
				</div>
			</div>
		</Layout>
	)
}

const styles = {
  thirdLayout: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: `no-repeat url('./files/fon4.jpg')`,
    backgroundOrigin: "border-box",
    backgroundPosition: "center",
  },
  containerInit: {
    background: "#98cdfb",
    borderRadius: 10,
    padding: 40,
  },
  textCenter: {
    textAlign: 'center'
  },
  sider__btn: {
    margin: "16px auto",
    display: "block",
    width: 160,
  },
}