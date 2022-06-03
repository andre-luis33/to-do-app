import './style.css'

import { useState } from 'react'

const defaultJobs = [
   {
      id: 1,
      title: 'Lavar Louça',
      done: false,
   },
   {
      id: 2,
      title: 'Estudar para a prova',
      done: false,
   }
]


const App = () => {
   const storedJobs = localStorage.getItem('jobs')

   const [jobs, setJobs] = useState(storedJobs ? JSON.parse(storedJobs) : defaultJobs)
   const [inputValue, setInputValue] = useState('')

   const pushJob = (job) => {
      let lastJobId = jobs.length ? [...jobs].pop().id : 0
      let newJob = {
         id: lastJobId+1,
         title: job,
         done: false,
      }
      
      let newJobs = [...jobs, newJob]
      setJobs(newJobs)
      localStorage.setItem('jobs', JSON.stringify(newJobs))
   }

   const submitJob = () => {
      if(inputValue == '') {
         alert('Preencha um to-do')
         return
      }

      pushJob(inputValue)
      setInputValue('')
   }

   const deleteJob = id => {
      const jobsAfterDelete = jobs.filter(job => job.id != id)
      setJobs(jobsAfterDelete)
      localStorage.setItem('jobs', JSON.stringify(jobsAfterDelete))
   }
   
   const doJob = id => {
      let i = jobs.findIndex(job => job.id == id)
      
      let jobsCloned = [...jobs]
      jobsCloned[i].done = true

      setJobs(jobsCloned)
      localStorage.setItem('jobs', JSON.stringify(jobsCloned))
   }
   
   const undoJob = id => {
      let i = jobs.findIndex(job => job.id == id)
      
      let jobsCloned = [...jobs]
      jobsCloned[i].done = false

      setJobs(jobsCloned)
      localStorage.setItem('jobs', JSON.stringify(jobsCloned))
   }

   return (
      <main className="bg-dark">
         <div className="container">
            <div className="title pt-5 text-center">
               <h1>To Do List <span className='count-jobs'>{jobs.length}</span></h1>
            </div>

            <div className="form-row my-3 w-100">
               <div className="col-md-11">
                  <input type="text" className="form-control" placeholder='Digite um novo to-do' value={inputValue} 
                     onChange={e => setInputValue(e.target.value)} 
                     onKeyUp={e => e.key == 'Enter' ? submitJob() : ''}
                  / >
               </div>
               <div className="col-md-1">
                  <button className='btn btn-success' onClick={submitJob}>Adicionar</button>
               </div>
            </div>

            <hr />

            <div className="jobs">
               <ul>
                  {jobs.map(job => {
                     return (
                        <li key={job.id}>
                           <div className="title-wrapper">
                              {/* <span class="start-time">10/05/2022 - 15:11</span> */}
                              <span className={job.done ? 'job-done' : ''}>#{job.id} - {job.title}</span>
                           </div>
                           <div>
                              {
                                 job.done ? 
                                    <button className="btn btn-warning mr-2" onClick={_ => undoJob(job.id)}>Desmarcar</button>
                                 :
                                    <button className="btn btn-primary mr-2" onClick={_ => doJob(job.id)}>Concluído</button>
                              }
                              
                              <button className="btn btn-danger" onClick={_ => deleteJob(job.id)}>Apagar</button>
                           </div>
                        </li>
                     )
                  })}
               </ul>
            </div>
         </div>
      </main>
   )
}

export default App