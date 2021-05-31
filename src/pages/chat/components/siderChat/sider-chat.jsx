import React from "react";
import { useDispatch } from "react-redux";
import { actions } from '../../reducer'
import { Tooltip, Icon, Layout } from "antd";
import { MenuChat } from "./menu";

const { Sider } = Layout;

let chatCrGroup = (((LaNg || {}).chatCrGroup ||{})[LnG || 'EN'] || 'Create a group')
let chatCrDialog = (((LaNg || {}).chatCrDialog ||{})[LnG || 'EN'] || 'cretae a dialog')
let chatLists = (((LaNg || {}).chatLists ||{})[LnG || 'EN'] || 'Chat lists')
export const SiderChat = () => {
  const dispatch = useDispatch()

  return (
    <Sider width={300} style={styles.sider}>
      <div
        style={styles.container_actions}
      >
        <Tooltip title={chatCrGroup}>
          <Icon
            style={styles.icon}
            onClick={() => dispatch(actions.modalInit(true))}
            type="usergroup-add"
          />
        </Tooltip>
        <Tooltip title={chatCrDialog}>
          <Icon
            style={styles.icon}
            type="user-add"
            onClick={() => dispatch(actions.modalInitPerson(true))}
          />
        </Tooltip>
      </div>
      <div style={styles.dividerSider}>{chatLists}</div>
      <MenuChat />         
    </Sider>
  )
}

const styles = {
  sider: {
    backgroundColor: "#3e4f5f",
  },
  container_actions: {
    color: "white",
    height: 64,
    backgroundColor: "#3e4f5f",
    borderRight: "#c1c1c1",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  icon: {
    fontSize: 30,
    backgroundColor: "white",
    color: "black",
    borderRadius: 10,
    padding: 5,
  },
  dividerSider: {
    background: "#fff",
    display: "block",
    textAlign: "center",
    borderRight: "1px solid #c1c1c1",
    borderBottom: "1px solid #c1c1c1",
    padding: "5px",
  }
}