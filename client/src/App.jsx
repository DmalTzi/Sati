import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [data, setDate] = useState([])

  async function recvDate(){
    const response = await axios.get("http://localhost:8080/api/send")
    setDate(response.data)
  }

  useEffect(()=>{
    const interval = setInterval(() => {
      recvDate()
    }, 1000);
    return () => clearInterval(interval);
  },[])

  return (
    <>
      <h1>Vite + React</h1>
      <p>วันที่ {data.date} เวลา {data.time}</p>
      <div className="card">
        <p>
          ความชื้นในอากาศ : {data.humidity}%
        </p>
        <p>
          อุณหภูมิ : {data.temperature}℃
        </p>
        <p>
          ความชื้นในดิน : {data.soli_moisture}
        </p>
      </div>
    </>
  )
}

export default App
