import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import Navbar from "./components/Navbar";
import DeviceStatus from "./components/DeviceStatus";

function App() {
    const [data, setDate] = useState([]);

    async function recvDate() {
        const response = await axios.get(
            `${import.meta.env.VITE_APP_API}/send`
        );
        console.log(response);
        setDate(response.data);
    }

    async function downloadExcelFile(response, category) {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_APP_API}/excel`,
                {
                    responseType: "blob", // Set responseType to 'blob' to receive binary data.
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = `ExcelSatiFile.xlsx`; // Set the desired filename.
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading Excel file: ", error);
        }
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
                <button className="btn" onClick={downloadExcelFile}>
                    ดาวน์โหลดข้อมูลนักเรียนในระบบ
                </button>
            </div>
        </>
    );
}

export default App;
