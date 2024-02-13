import { useState, useEffect } from 'react'
import axios from "axios"
import './App.css'

function App() {
  const [data, setDate] = useState([])

  async function recvDate(){
    const response = await axios.get(`${import.meta.env.VITE_APP_API}/api/send`)
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
      <h1>การปลูกพืชในโรงเรือน</h1>
      <p>วันที่ {data.date} เวลา {data.time}</p>
      <div className="card">
        <p>
          ความชื้นในอากาศ : {data.humidity}%
        </p>
        <p>
          อุณหภูมิ : {data.temperature}℃
        </p>
        <p>
          ความชื้นเฉลี่ยในดิน : {data.soil_moisture}%
        </p>
        <p>สถานะตัววัดความชื้นจุดที่ 1 : {String(data.device1_status)}</p>
        <p>สถานะตัววัดความชื้นจุดที่ 2 : {String(data.device2_status)}</p>
        <p>สถานะตัววัดความชื้นจุดที่ 3 : {String(data.device3_status)}</p>
        <p>สถานะตัววัดความชื้นจุดที่ 4 : {String(data.device4_status)}</p>
      </div>
    </>
  )
}

export default App
