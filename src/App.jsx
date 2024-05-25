import { useState } from 'react'
import './App.css'
import MinContent from './component/MinContent';
import Container from '@mui/material/Container';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='appmin'>
      <Container maxWidth="xl">

        <MinContent/>

      </Container>
    </div>
  )
}

export default App
