import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import Logs from './components/Logs'
import Spacer from './components/Spacer'
import BtnContainer from './components/BtnContainer'

function App() {

  return (
    
    <div className='w-full min-h-screen bg-slate-900 text-white flex flex-col'>

      <Header/>

      <BtnContainer/>

      <Spacer/>

      <Logs/>

    </div>
  )
}

export default App
