import React, { useEffect } from "react";
import { useDispatch } from 'react-redux'
import Helmet from "react-helmet";
import { api } from "src/defaults";
import ErrorBoundary from "src/pages/error-boundary";
import { get_chat_id } from "src/redux/actions/user";

import enhance from "./enhance";
import MainFrame from "./components/main-frame";
import ControlPanel from "./components/control-panel";
import ModalInitGroupChat from "./components/modal-init";
import ModalInitPersonChat from "./components/modal-initPerson";

import { InitLayout } from "./components/initial-layout";
import { SiderChat } from "./components/siderChat";
import { Layout, Button, Drawer, Avatar } from "antd";
const { Content, Header } = Layout;


let chatControlPanel = (((LaNg || {}).chatControlPanel ||{})[LnG || 'EN'] || 'Chat control panel')
let ChaT = (((LaNg || {}).ChaT ||{})[LnG || 'EN'] || 'Chat')
const Chat = ({
  set_state,
  carouselRef,
  openDrawerPanel,
  chatId,
  chatName,
  chatPhotoUri
}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(get_chat_id())
  }, [])

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{ChaT}</title>
      </Helmet>
      <Layout style={styles.mainLayout}>
        <SiderChat />
        {chatId ? (
          <Layout style={styles.secondLayout}>
            <Header style={styles.header}>
              <div style={styles.header__nameChat}>
                <span style={{ paddingRight: 10 }}>
                  {chatPhotoUri ? (
                    <Avatar
                      src={api._url + chatPhotoUri}
                      size={42}
                      className="chat__avatar"
                    />
                  ) : (
                    <Avatar
                      icon="question"
                      size={42}
                      className="chat__avatar"
                    />
                  )}
                </span>
                {chatName}
              </div>
              <Button onClick={() => set_state({ openDrawerPanel: true })}>
				  {chatControlPanel}
              </Button>
            </Header>
            <Content>
              <MainFrame />
              <Drawer
                title={chatControlPanel}
                onClose={() => set_state({ openDrawerPanel: false })}
                visible={openDrawerPanel}
                width={516}
              >
                <ControlPanel
                  chatId={chatId}
                  setStateUpComp={set_state}
                />
              </Drawer>
            </Content>
          </Layout>
        ) : <InitLayout /> }

          <ModalInitGroupChat
            set_stateUpComponent={set_state}
            carouselRef={carouselRef}
          />
          <ModalInitPersonChat
            set_stateUpComponent={set_state}
          />
      </Layout>
    </ErrorBoundary>
  );
};

const styles = {
  mainLayout: {
    height: "100%",
  },
  secondLayout: {
    backgroundColor: "white",
  },
  sider__icon: {
    position: "absolute",
    top: 25,
    left: 20,
    color: "aliceblue",
  },
  header: {
    backgroundColor: "#4486c5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header__nameChat: {
    color: "aliceblue",
    fontSize: 25,
  },
};

export default enhance(Chat);
