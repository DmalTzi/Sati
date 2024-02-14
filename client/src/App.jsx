import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import DeviceStatus from "./components/DeviceStatus";

function App() {
    const [data, setDate] = useState([]);

    async function recvDate() {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API}/api/send`
        );
        console.log(response)
        setDate(response.data);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            recvDate();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="card">
                    <p>
                        วันที่ {data.date} เวลา {data.time}
                    </p>
                    <p>ความชื้นในอากาศ : {data.humidity}%</p>
                    <p>อุณหภูมิอากาศ : {data.temperature}℃</p>
                    <p>ความชื้นเฉลี่ยในดิน : {data.soil_moisture}%</p>
                </div>
                <div className="device-container">
                    <div className="device-sub-container">
                        <DeviceStatus
                            label={"สถานะตัววัดความชื้นจุดที่ 1"}
                            status={data.device1_status}
                        />
                        <DeviceStatus
                            label={"สถานะตัววัดความชื้นจุดที่ 2"}
                            status={data.device2_status}
                        />
                    </div>
                    <div className="device-sub-container">
                        <DeviceStatus
                            label={"สถานะตัววัดความชื้นจุดที่ 3"}
                            status={data.device3_status}
                        />
                        <DeviceStatus
                            label={"สถานะตัววัดความชื้นจุดที่ 4"}
                            status={data.device4_status}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default App;
