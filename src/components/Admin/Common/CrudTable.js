import React, { useState, useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import {
  Container,
  Grid,
  Typography,
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
  TextField
} from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

import Table from 'components/Admin/Common/Table'
import InputImage from './InputImage'

const styles = makeStyles(theme => (
  {
    btnAdd: {
      marginLeft: theme.spacing(3)
    },
    container: {
      paddingBottom: 20,
      paddingTop   : 20
    },
    title: {
      color: theme.palette.primary.main
    },
    titleContent: {
      alignItems  : 'flex-end',
      display     : 'flex',
      marginBottom: theme.spacing(3)
    }
  }
))

const CrudTable = props => {
  const {
    title,
    btnAdd,
    table: {
      rows,
      columns,
      pagination,
      onRemove,
      onEdit,
      modalRemoveMessage,
      withRemove = false,
      withEdit = false
    } = {},
    modalAdd: {
      cancel: modalAddCancel = 'Cancel',
      confirm: modalAddConfirm = 'Confirm',
      form: modalAddForm = [],
      title: titleModalAdd = 'New',
      onConfirm: onConfirmModalAdd = () => {}
    } = {},
    modalEdit: {
      cancel: modalEditCancel = 'Cancel',
      confirm: modalEditConfirm = 'Confirm',
      data: dataModalEdit = {},
      form: modalEditForm = [],
      title: titleModalEdit = 'New',
      onReset: onResetEdit = () => {},
      onConfirm: onConfirmModalEdit = () => { }
    } = {}
  } = props

  const classes = styles()
  const { handleSubmit, control, errors, setValue, clearError } = useForm()

  const [ openModalNew, setOpenModalNew ] = useState(false)
  const [ openModalEdit, setOpenModalEdit ] = useState(false)
  const [ dataEdit, setDataEdit ] = useState(null)

  useEffect(() => {
    if(Object.keys(dataModalEdit).length)
      setDataEdit(dataModalEdit)
  }, [ dataModalEdit ])

  useEffect(() => {
    if(dataEdit && Object.keys(dataEdit).length)
      setOpenModalEdit(true)
      // modalEditForm.map(({ name, type }) => {
      //   if(type === 'image')
      //     setValue(name, dataModalEdit[name])
      // })
  }, [ dataEdit ])

  const onSubmit = data => {
    onConfirmModalAdd(data)
    _handleClickToggleModalNew()
  }

  const onSubmitUpdate = data => {
    onConfirmModalEdit({ ...data, id: dataModalEdit._id })
    _handleClickToggleModalEdit()
  }

  const _handleChangeImage = ({ name, file }) => {
    clearError([ name ])
    setValue(name, file)
  }

  const _handleClickToggleModalNew = () => {
    setOpenModalNew(!openModalNew)
  }

  const _handleClickToggleModalEdit = () => {
    if(openModalEdit)
      setOpenModalEdit(false)
  }

  const _onExitedModalEdit = () => {
    if(openModalEdit) {
      setDataEdit(null)
      onResetEdit(true)
    }
  }

  const _handleClickEdit = id => {
    onEdit(id)
    // setOpenModalEdit(!openModalEdit)
  }

  return (
    <Container
      maxWidth={false}
      style={{
        backgroundColor: '#fff'
      }}>
      <Grid className={classes.container} container>
        <div className={classes.titleContent}>
          {
            title && <Typography className={classes.title} variant='h5'>{title}</Typography>
          }
          {
            btnAdd ?
              <Button
                className={classes.btnAdd}
                color='primary'
                onClick={_handleClickToggleModalNew}
                size='small'
                variant='outlined'>{btnAdd}</Button> : null
          }
        </div>
        <Grid container>
          <Grid item xs>
            <Table
              columns={columns}
              modalRemoveMessage={modalRemoveMessage}
              onEdit={_handleClickEdit}
              onRemove={onRemove}
              pagination={pagination}
              rows={rows}
              withActions
              withEdit={withEdit}
              withPagination
              withRemove={withRemove} />
          </Grid>
        </Grid>
      </Grid>

      {/* modals */}
      {/* new */}
      <Dialog
        // fullScreen={true}
        onClose={_handleClickToggleModalNew}
        open={openModalNew}>
        <DialogTitle>{titleModalAdd}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            {
              modalAddForm.map((input, index) => {
                switch (input.type) {
                  case 'image':

                    return (
                      <div
                        key={`${input.name}-${index}`}>
                        <InputImage
                          error={Boolean(errors[input.name])}
                          helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                          key={`${input.name}-${index}`}
                          name={input.name}
                          onImage={_handleChangeImage} />
                        <Controller

                          as={
                            <TextField
                              fullWidth
                              label={input.label}
                              margin='dense'
                              style={{
                                display: 'none'
                              }}
                              type='hidden' />}
                          control={control}
                          defaultValue=''
                          name={input.name}
                          rules={{ required: input.required }} />
                      </div>
                    )
                  case 'text':

                    return (
                      <Controller
                        as={
                          <TextField
                            error={Boolean(errors[input.name])}
                            fullWidth
                            helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                            label={input.label}
                            margin='dense' />}
                        control={control}
                        defaultValue=''
                        key={`${input.name}-${index}`}
                        name={input.name}
                        rules={{ required: input.required }} />
                    )

                  case 'textarea':

                    return (
                      <Controller
                        as={
                          <TextField
                            error={Boolean(errors[input.name])}
                            fullWidth
                            helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                            inputProps={{
                              maxLength: input.maxLength ? input.maxLength : 'auto'
                            }}
                            label={input.label}
                            margin='dense'
                            multiline
                            rows={4} />}
                        control={control}
                        defaultValue=''
                        key={`${input.name}-${index}`}
                        name={input.name}
                        rules={{  required: input.required }} />
                    )
                  default:
                    return
                }
              })
            }
          </DialogContent>
          <DialogActions>
            <Button autoFocus color='primary' onClick={_handleClickToggleModalNew}>
              {modalAddCancel}
            </Button>

            <Button autoFocus color='primary' type='submit'>
              {modalAddConfirm}
            </Button>

          </DialogActions>
        </form>
      </Dialog>
      {/* edit */}
      <Dialog
        // fullScreen={true}
        onClose={_handleClickToggleModalEdit}
        onExited={_onExitedModalEdit}
        open={openModalEdit}>
        <DialogTitle>{titleModalEdit}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmitUpdate)}>
          <DialogContent>
            {
              dataEdit &&
              modalEditForm.map((input, index) => {
                switch (input.type) {
                  case 'image':

                    return (
                      <div
                        key={`${input.name}-${index}`}>
                        <InputImage
                          data={dataModalEdit[input.name]}
                          error={Boolean(errors[input.name])}
                          helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                          key={`${input.name}-${index}`}
                          name={input.name}
                          onImage={_handleChangeImage} />
                        <Controller
                          as={
                            <TextField
                              fullWidth
                              label={input.label}
                              margin='dense'
                              style={{
                                display: 'none'
                              }}
                              type='hidden' />}
                          control={control}
                          defaultValue={dataModalEdit[input.name]}
                          name={input.name}
                          rules={{ required: input.required }} />
                      </div>
                    )
                  case 'text':

                    return (
                      <Controller
                        as={
                          <TextField
                            error={Boolean(errors[input.name])}
                            fullWidth
                            helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                            label={input.label}
                            margin='dense' />}
                        control={control}
                        defaultValue={dataModalEdit[input.name]}
                        key={`${input.name}-${index}`}
                        name={input.name}
                        rules={{ required: input.required }} />
                    )

                  case 'textarea':

                    return (
                      <Controller
                        as={
                          <TextField
                            error={Boolean(errors[input.name])}
                            fullWidth
                            helperText={(errors[input.name] && errors[input.name].type === 'required') ? 'Your input is required' : ''}
                            label={input.label}
                            margin='dense'
                            multiline
                            rows={4} />}
                        control={control}
                        defaultValue={dataModalEdit[input.name]}
                        key={`${input.name}-${index}`}
                        name={input.name}
                        rules={{ required: input.required }} />
                    )
                  default:
                    return
                }
              })
            }
          </DialogContent>
          <DialogActions>
            <Button autoFocus color='primary' onClick={_handleClickToggleModalEdit}>
              {modalEditCancel}
            </Button>

            <Button autoFocus color='primary' type='submit'>
              {modalEditConfirm}
            </Button>

          </DialogActions>
        </form>
      </Dialog>
    </Container>
  )
}

export default CrudTable
