import { createBrowserHistory } from 'history'
import { hotjar } from 'react-hotjar';
import Router from './router'

const history = createBrowserHistory();

const hjid = 3005834 // hotjar id
const hjsv = 6 // hotjar snippet version

hotjar.initialize(hjid, hjsv);
hotjar.identify('USER_ID', { userProperty: 'value' });

const App = () => {
   return <>
      <Router history={history} />
   </>
}

export default App