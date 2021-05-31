import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { List, Avatar, Icon } from "antd";
import { api } from "src/defaults";
import { set_chat_id } from "src/redux/actions/user";
import { actions } from '../../reducer'


let chatCrNM = (((LaNg || {}).chatCrNM ||{})[LnG || 'EN'] || 'Chat is created. Yet no message')
let fileOrImage = (((LaNg || {}).fileOrImage ||{})[LnG || 'EN'] || 'file/image')
let YoU = (((LaNg || {}).YoU ||{})[LnG || 'EN'] || 'you are')


export const MenuChat = () => {
  const dispatch = useDispatch()
  const chatId = useSelector(state => state.user.chatId)
  const listChats = useSelector(state => state.chat.listChats)

  useEffect(() => {
    dispatch(actions.requestListChats())
  }, [])

  return (
    <List
      style={styles.sider__list}
      itemLayout="horizontal"
      dataSource={listChats}
      renderItem={(item) => {
        const colorItem = chatId === item.id ? "#98cdfb" : "aliceblue";
        const colorText = chatId === item.id && styles.choicedItem;
        return (
          <List.Item
            className="chat__menuItem"
            style={{ ...styles.sider__listItem, backgroundColor: colorItem }}
            onClick={() => dispatch(set_chat_id(item.id))}
          >
            <List.Item.Meta
              avatar={
                item.photo?.length > 0 ? (
                  <Avatar
                    size={42}
                    className="chat__avatar"
                    src={api._url + item.photo[0].uri}
                  />
                ) : item.dialog_type_name === "group" ? (
                  <Avatar
                    size={42}
                    style={styles.list_avatarIcon}
                    icon="team"
                  />
                ) : (
                  <Avatar
                    size={42}
                    style={styles.list_avatarIcon}
                    icon="user"
                  />
                )
              }
              title={
                <div style={{ fontSize: 18, ...colorText }}>
                  <span>
                    {item.dialog_type_name === "group" && (
                      <Icon type="team" style={{ paddingRight: 10 }} />
                    )}
                    {item.title}
                  </span>
                  {item.unreaded > 0 && (
                    <span style={styles.title__unreaded}>{item.unreaded}</span>
                  )}
                </div>
              }
              description={
                item.last_message === null ? (
					chatCrNM
                ) : (
                  <div>
                    <span style={styles.description_whom}>
                      {item.last_message.ismine
                        ? YoU
                        : item.last_message.login}
                      :{" "}
                    </span>
                    <span>
                      {item.last_message.message_text === ""
                        ? fileOrImage
                        : item.last_message.message_text.length > 79
                        ? item.last_message.message_text
                            .slice(0, 79)
                            .concat("...")
                        : item.last_message.message_text}
                    </span>
                  </div>
                )
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

const styles = {
  sider__list: {
    borderRight: "1px solid #c1c1c1",
    overflow: "auto",
    maxHeight: "calc(100vh - 116px)",
  },
  choicedItem: {
    padding: "0 10px 0",
    backgroundColor: "#4586c2",
    color: "white",
    display: "inline",
    borderRadius: 10,
  },
  sider__listItem: {
    borderBottom: "1px solid grey",
  },
  list_avatarIcon: {
    marginLeft: 5,
  },
  title__unreaded: {
    color: "aliceblue",
    position: "absolute",
    right: 30,
    padding: "1px 7px",
    backgroundColor: "grey",
    borderRadius: "50%",
  },
  description_whom: { color: "blue" },
};
