import './style.css'

import { useState } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'

import { useNavigate } from 'react-router-dom'

import { Button, Modal } from 'react-bootstrap'
import { hotjar } from 'react-hotjar'


const formatDate = dateObject => {
   console.log(dateObject.getDay())

   const day   = ("0"+dateObject.getDay()).slice(-2)
   const month = ("0"+(dateObject.getMonth()+1)).slice(-2)
   const year  = dateObject.getFullYear()
   
   const hour = ("0"+dateObject.getHours()).slice(-2)
   const minutes = ("0"+dateObject.getMinutes()).slice(-2)

   return `${day}/${month}/${year} - ${hour}:${minutes}`
}

const defaultJobs = [
   {
      id: 1,
      title: 'Lavar Louça',
      done: false,
      createdAt: formatDate(new Date())
   },
   {
      id: 2,
      title: 'Estudar para a prova',
      done: false,
      createdAt: formatDate(new Date())
   }
]

const IS_DARK_MODE = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
const IS_MOBILE    = window.innerWidth < 768

const App = () => {
   const storedJobs = localStorage.getItem('jobs')

   let preferedTheme = localStorage.getItem('theme')
   if(!preferedTheme) {
      preferedTheme = IS_DARK_MODE ? 'dark' : 'light'
   }

   const btnOnlyMobile = IS_MOBILE ? 'btn-sm' : ''

   const [theme, setTheme] = useState(preferedTheme)
   const [jobs, setJobs] = useState(storedJobs ? JSON.parse(storedJobs) : defaultJobs)
   const [inputValue, setInputValue] = useState('')
   const [show, setShow] = useState(false)

   const handleShow = () => setShow(true)
   const handleClose = () => {
      setShow(false)
      navigate('/', { replace: true })
      hotjar.stateChange('/')
   }

   const [currentJobTitle, setCurrentJobTitle] = useState('')
   const [currentCreatedAt, setCurrentCreatedAt] = useState('')

   const navigate = useNavigate()

   const pushJob = (job) => {
      let lastJobId = jobs.length ? [...jobs].pop().id : 0
      let newJob = {
         id: lastJobId+1,
         title: job,
         done: false,
         createdAt: formatDate(new Date())
      }
      
      let newJobs = [...jobs, newJob]
      setJobs(newJobs)
      localStorage.setItem('jobs', JSON.stringify(newJobs))
   }

   const submitJob = () => {
      if(inputValue === '') {
         alert('Preencha um to-do')
         return
      }

      pushJob(inputValue)
      setInputValue('')
   }

   const viewJob = jobId => {
      const { id, title, createdAt } = jobs.find(job => job.id === jobId)
      handleShow()
      setCurrentJobTitle(`#${id} - ${title}`)
      setCurrentCreatedAt(createdAt)
      navigate(`/?id=${id}`, { replace: true })
      hotjar.stateChange(`/?id=${id}`)
   }

   const deleteJob = id => {
      const jobsAfterDelete = jobs.filter(job => job.id != id)
      setJobs(jobsAfterDelete)
      localStorage.setItem('jobs', JSON.stringify(jobsAfterDelete))
   }
   
   const doJob = id => {
      let i = jobs.findIndex(job => job.id === id)
      
      let jobsCloned = [...jobs]
      jobsCloned[i].done = true

      setJobs(jobsCloned)
      localStorage.setItem('jobs', JSON.stringify(jobsCloned))
   }
   
   const undoJob = id => {
      let i = jobs.findIndex(job => job.id === id)
      
      let jobsCloned = [...jobs]
      jobsCloned[i].done = false

      setJobs(jobsCloned)
      localStorage.setItem('jobs', JSON.stringify(jobsCloned))
   }

   const handleThemeClick = () => {
      if(theme === 'dark') {
         setTheme('light')
         localStorage.setItem('theme', 'light')
      } else {
         setTheme('dark')
         localStorage.setItem('theme', 'dark')
      }
   }

   return (
      <main className={theme === 'dark' ? 'dark' : 'light'}>
         <div className="container">
            <span id="theme-icon" onClick={handleThemeClick}>
               {theme === 'light' ? <FaMoon /> : <FaSun />}
               
            </span>
            <div className="title pt-5 text-center">
               <h1>To Do List <span className='count-jobs'>{jobs.length}</span></h1>
            </div>

            <div className="form-row my-3 w-100 input-container">
               <div className="col-md-11">
                  <input type="text" className="form-control" placeholder='Digite um novo to-do' value={inputValue} maxLength="50"
                     onChange={e => setInputValue(e.target.value)} 
                     onKeyUp={e => e.key === 'Enter' ? submitJob() : ''}
                  / >
               </div>
               <div className="col-md-1">
                  <button className='btn btn-success btn-submit-job' onClick={submitJob}>Adicionar</button>
               </div>
            </div>

            <hr />

            <div className="jobs">
               <ul>
                  {jobs.map(job => {
                     return (
                        <li key={job.id}>
                           <div className="title-wrapper">
                              <span className="start-time">{job.createdAt}</span>
                              <span className={job.done ? 'job-done' : ''}>#{job.id} - {job.title}</span>
                           </div>
                           <div className="btn-wrapper">
                              <button className={`btn ${btnOnlyMobile} btn-info mr-2`} onClick={_ => viewJob(job.id)}>Ver</button>
                              {
                                 job.done ? 
                                    <button className={`btn ${btnOnlyMobile} btn-warning mr-2`} onClick={_ => undoJob(job.id)}>Desmarcar</button>
                                 :
                                    <button className={`btn ${btnOnlyMobile} btn-primary mr-2`} onClick={_ => doJob(job.id)}>Concluído</button>
                              }
                              
                              <button className={`btn ${btnOnlyMobile} btn-danger`} onClick={_ => deleteJob(job.id)}>Apagar</button>
                           </div>
                        </li>
                     )
                  })}
               </ul>
            </div>
         </div>

         <Modal show={show} onHide={handleClose}>
            <Modal.Header>
               <Modal.Title>Mais Informações</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <p>
                  {currentJobTitle}
               </p>
               <i>Criado em {currentCreatedAt}</i>
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={handleClose}>
                  Fechar
               </Button>
            </Modal.Footer>
         </Modal>

      </main>
   )
}

export default App