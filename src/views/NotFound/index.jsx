import { Link } from "react-router-dom"

const NotFound = () => {
   return (
      <h1 style={{margin: '50px 0', textAlign: 'center'}}>
         Página não encontrada :( <br></br><Link to={'/'} >Voltar para o melhor to-do-app do mundo</Link>
      </h1>
   )
}

export default NotFound