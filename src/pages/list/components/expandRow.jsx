import React from 'react'
import { visibleCondition } from 'src/libs/methods'
import { QueryBuilder } from 'src/libs/methods'
import List from 'src/pages/list'
import Getone from 'src/pages/Getone'

export const expandRowGenerator = (
  listData, params, listConfig, history, origin, expandState, set_state
) => {
  const expandRow = {
    renderer: (row, rowIndex) => {
      let expandAct = origin.acts.filter(
        x => x.type === 'Expand' &&
        visibleCondition(listData[rowIndex], x.act_visible_condition, params.inputs)
      )[0]
      let inputs = {}
      let search = {}

      if (expandAct) {
        inputs = QueryBuilder(listData[rowIndex], expandAct, listConfig, history)
        search = { search: inputs, pathname: expandAct.act }
        const typeContent = expandAct.act.split('/')[1]

        switch (typeContent) {
          case 'list':
            return (
              <div>
                <List
                  compo={true} location={search} history={history}
                  path={expandAct.act.split('/')[2]}
                  id_page={expandAct.act.split('/')[2]}
                />
              </div>
            )
          case 'getone':
            return (
              <div>
                <Getone
                  compo={true} location={search} history={history}
                  path={expandAct.act.split('/')[2]}
                  id_page={expandAct.act.split('/')[2]}
               />
              </div>
            )
          default:
            const openNotification = () => {
              notification.open({
                message: `type ${typeContent} not correct  `,
                description: 'use list or getone'
              })
            }
            return openNotification
        }
      }
    },
    showExpandColumn: true,
    expandByColumnOnly: true,
    expanded: expandState,
    onExpand: (row, isExpand, rowIndex, e) => {
      let expandAct = origin.acts.filter(x => x.type === 'Expand')[0]
      if (expandAct) {
        const copyExpandState = [...expandState]
        const rowId = row.id
        const indexRowToState = copyExpandState.findIndex(it => it === rowId)
        isExpand
        ? copyExpandState.includes(rowId)
          ? null
          : copyExpandState.push(row.id)
        : copyExpandState.splice(indexRowToState, 1)
        set_state({ expandState: copyExpandState })
      }
    }
  }
  return expandRow

}
