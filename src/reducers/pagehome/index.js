import produce from 'immer'
import { takeEvery } from 'redux-saga/effects'
import base from 'reducers/base'

import {
  getPageConfig,
  updatePageConfig,
  watchPageHomeServer
} from './sagas'

export default base({
  initialState: {
    _id                : null,
    banners            : [],
    message_desc       : '',
    message_icon       : '',
    message_image      : '',
    message_left       : '',
    message_link       : '',
    message_title      : '',
    openAppoimentGlobal: false,
    services           : [],
    show_banner        : false,
    show_brands        : false,
    show_newsletter    : false,
    show_services      : false,
    show_testimonials  : false,
    testimonials       : []
  },
  namespace: 'nod_services',
  store    : 'page_home'
}).extend({
  creators: ({ types }) => ({
    addNewItemBanner        : () => ({ type: types.ADD_ITEM_BANNER }),
    getPageConfig           : () => ({ type: types.FETCH }),
    openAppoiment           : () => ({ type: types.UPDATE_OPEN_APPOIMENT }),
    removeBannerItem        : index => ({ index, type: types.REMOVE_ITEM_BANNER }),
    updateBannersData       : (data, index) => ({ data, index, type: types.UPDATE_DATA_BANNERS }),
    updateCheckbox          : (name, data) => ({ data, name, type: types.UPDATE_CHECKBOX }),
    updatePageConfig        : payload => ({ payload, type: types.UPDATE_CONFIG }),
    updatePositionBannerItem: (orientation, position) => ({ orientation, position, type: types.UPDATE_POSITION_BANNER })
  }),
  reducer: (state, action, { types }) =>
    produce(state, draft  => {
      switch (action.type) {
        case types.UPDATE_CHECKBOX:
          draft[action.name] = action.data

          return
        case types.ADD_ITEM_BANNER:
          draft.banners = [
            ...draft.banners,
            {
              desc         : '',
              image        : '',
              openAppoiment: true,
              position     : state.banners.length,
              title        : '',
              url          : ''
            }
          ]

          return
        case types.UPDATE_POSITION_BANNER:
          const order = [
            ...state.banners.map((item) => {
              if(action.orientation === 'up')
                if((action.position - 1) === item.position)
                  if((action.position - 1) === 0) {
                    return {
                      ...item,
                      position: 1
                    }
                  } else {
                    return {
                      ...item,
                      position: item.position + 1
                    }
                  }
                else if(action.position === item.position)
                  return {
                    ...item,
                    position: item.position - 1
                  }
                else
                  return item
              else
              if(action.position === item.position)
                return {
                  ...item,
                  position: item.position + 1
                }
              else if((action.position + 1) === item.position)
                return {
                  ...item,
                  position: item.position - 1
                }
              else
                return item
            })
          ]

          draft.banners = order.sort((a, b) => (a.position > b.position) ? 1 : -1)

          return
        case types.REMOVE_ITEM_BANNER:
          draft.banners = draft.banners.filter((item, index) => action.index !== index).map((item, index) => ({
            ...item,
            position: index
          }))

          return

        case types.UPDATE_DATA_BANNERS:
          draft.banners = draft.banners.map((item, index) => {
            if(action.index === index)
              return {
                ...item,
                ...action.data
              }
            else
              return item
          })

          return

        case types.UPDATE_OPEN_APPOIMENT:

          draft.openAppoimentGlobal = !draft.openAppoimentGlobal

          return
        default:
          return
      }
    }),
  sagas: duck => ({
    getPageConfig   : getPageConfig(duck),
    updatePageConfig: updatePageConfig(duck)
  }),
  selectors: ({ store }) => ({
    getAllCheckbox: state => {
      const {
        show_banner,
        show_brands,
        show_newsletter,
        show_services,
        show_testimonials,
        _id
      } = state[store]

      return {
        _id,
        show_banner,
        show_brands,
        show_newsletter,
        show_services,
        show_testimonials
      }
    },
    getStatus: state => state[store].status
  }),
  takes: (duck) => [
    takeEvery(duck.types.FETCH, duck.sagas.getPageConfig),
    takeEvery(duck.types.UPDATE_CONFIG, duck.sagas.updatePageConfig),
    watchPageHomeServer(duck)
  ],
  types: [
    'UPDATE_CHECKBOX',
    'ADD_ITEM_BANNER',
    'UPDATE_POSITION_BANNER',
    'REMOVE_ITEM_BANNER',
    'UPDATE_DATA_BANNERS',
    'UPDATE_CONFIG',
    'UPDATE_OPEN_APPOIMENT'
  ]
})
