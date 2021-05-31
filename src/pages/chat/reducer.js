import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  statusModalInit: false,
  statusModalInitPerson: false,
  listChats: []
}

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    modalInit(state, { payload }) {
      state.statusModalInit = payload
    },
    modalInitPerson(state, { payload }) {
      state.statusModalInitPerson = payload
    },
    listChats(state, { payload }) {
      state.listChats = payload
    },
    requestListChats(state) {state}
  }
})

export const { actions, reducer } = chatSlice