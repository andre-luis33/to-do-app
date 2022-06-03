import { createBrowserHistory } from 'history'
import Router from './router'

const history = createBrowserHistory();


const App = () => {
   return <>
      <Router history={history} />
   </>
}

export default App