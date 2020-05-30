import React from 'react'

import store, { history } from './store/configureStore'
import createRoutes from './routes'
import Root from './containers/Root'

const routes = createRoutes(history, null, store)

export default () => <Root store={store}>{routes}</Root>
