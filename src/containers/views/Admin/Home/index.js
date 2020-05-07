import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  FormControlLabel,
  Checkbox,
  TextField,
  Switch,
  Button
} from '@material-ui/core'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import AddBoxIcon from '@material-ui/icons/AddBox'
import DeleteIcon from '@material-ui/icons/Delete'

import { makeStyles } from '@material-ui/core/styles'

import TabsAdmin from 'components/Admin/Common/TabsAdmin'

import pageHomeDucks from 'reducers/pagehome'

import InputImage from 'components/Admin/Common/InputImage'

const {
  getPageConfig,
  updateCheckbox,
  updatePageConfig
} = pageHomeDucks.creators

const useStyles = makeStyles(theme => ({
  actionsBanner: {
    '& svg': {
      '&:hover': {
        color    : theme.palette.primary.main,
        transform: 'scale(1.1)'
      },
      cursor      : 'pointer',
      marginBottom: 10
    },
    display      : 'flex',
    flexDirection: 'column',
    marginLeft   : 20
  },
  containerBanner: {
    alignItems: 'center',
    display   : 'flex'
  },
  formBanner: {
    border      : `solid 1px ${theme.palette.primary.light}`,
    flex        : 1,
    marginBottom: 20,
    padding     : 15
  }
}))

const PageHome = () => {
  const dispatch = useDispatch()
  const classes = useStyles()

  const {
    status,
    show_banner,
    show_brands,
    show_newsletter,
    show_services,
    show_testimonials,
    banners
  } = useSelector(state => state.page_home)

  const [ stateBanner, setStateBanner ] = useState(banners)

  useEffect(() => {
    if(status === 'NEW')
      dispatch(getPageConfig())
  }, [])

  // actions
  const _handleChangeCheckbox = ev => {
    dispatch(updateCheckbox(ev.target.name, ev.target.checked))
  }

  const _handleChangeBanners = (ev, index) => {
    if(ev.name === 'image')
      setStateBanner(stateBanner.map((item, itemIndex) => {
        if(itemIndex === index)
          return {
            ...item,
            [ev.name]: ev.file
          }
        else
          return item
      }))
    else if(ev.target.name === 'openAppoiment')
      setStateBanner(stateBanner.map((item, itemIndex) => {
        if(itemIndex === index)
          return {
            ...item,
            [ev.target.name]: ev.target.checked
          }
        else
          return item
      }))
    else
      setStateBanner(stateBanner.map((item, itemIndex) => {
        if(itemIndex === index)
          return {
            ...item,
            [ev.target.name]: ev.target.value
          }
        else
          return item
      }))
  }

  const _handleAddItemBammer = () => {
    setStateBanner([
      ...stateBanner,
      {
        desc         : '',
        image        : '',
        openAppoiment: true,
        position     : stateBanner.length,
        title        : '',
        url          : ''
      }
    ])
  }

  const _handleClickRemoveBanner = (index) => {
    setStateBanner(stateBanner.filter((item, itemIndex) => itemIndex !== index))
  }

  const _handleClickSave = () => {
    dispatch(updatePageConfig(stateBanner))
  }

  const actions = (<div>
    <Button
      color='primary'
      onClick={_handleClickSave}
      variant='contained'>Save</Button>
  </div>)

  return (
    <TabsAdmin
      tabActions={actions}
      tabContent={[
        <>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show_banner}
                  color='primary'
                  name='show_banner'
                  onChange={_handleChangeCheckbox} />
              }
              label='Show Banner' />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show_brands}
                  color='primary'
                  name='show_brands'
                  onChange={_handleChangeCheckbox} />
              }
              label='Show Brands' />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show_newsletter}
                  color='primary'
                  name='show_newsletter'
                  onChange={_handleChangeCheckbox} />
              }
              label='Show Newsletter' />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show_services}
                  color='primary'
                  name='show_services'
                  onChange={_handleChangeCheckbox} />
              }
              label='Show Services' />
          </div>

          <div>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show_testimonials}
                  color='primary'
                  name='show_testimonials'
                  onChange={_handleChangeCheckbox} />
              }
              label='Show Testimonials' />
          </div>

        </>

      ]}
      tabHeader={[
        'config'
      ]}
      tabName='Page Home' />
  )
}

export default PageHome
