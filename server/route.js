const cron = require("node-cron");
const router = require("express").Router();
const Data = require("./models/Data");
const XLSX = require("xlsx");

let datas = {
    device1: [0],
    device2: [0],
    device3: [0],
    device4: [0],
};

let device1_status = false;
let device2_status = false;
let device3_status = false;
let device4_status = false;
let all_not_on = false;

let temp_date = [0];
let humi_data = [0];

function checkStatus(d1, d2, d3, d4) {
    d1 == 0 && d2 == 0 && d3 == 0 && d4 == 0
        ? (all_not_on = true)
        : (all_not_on = false);
    d1 != 0 ? (device1_status = true) : (device1_status = false);
    d2 != 0 ? (device2_status = true) : (device2_status = false);
    d3 != 0 ? (device3_status = true) : (device3_status = false);
    d4 != 0 ? (device4_status = true) : (device4_status = false);
}

const downloadExcel = async (data) => {
    const writeBook = XLSX.utils.book_new(); // create book
    for (k in data) {
        // Object.keys(data).forEach((d, ind) => {
        //     console.log(data[d]);
        // });
        const writeSheet = XLSX.utils.json_to_sheet(data[k]);
        const newKeys = k.replaceAll("/", "_");
        XLSX.utils.book_append_sheet(writeBook, writeSheet, `${newKeys}`);
    }

    return (excelData = await XLSX.write(writeBook, {
        bookType: "xlsx",
        type: "buffer",
    }));
};

cron.schedule("*/5 * * * *", async () => {
    console.log("Save Data2DB");
    // avg
    device1 = datas.device1.slice(-1)[0];
    device2 = datas.device2.slice(-1)[0];
    device3 = datas.device3.slice(-1)[0];
    device4 = datas.device4.slice(-1)[0];
    checkStatus(device1, device2, device3, device4);
    avg =
        (device1 + device2 + device3 + device4) /
        (device1_status +
            device2_status +
            device3_status +
            device4_status +
            all_not_on);

    avg === 0
        ? (result = 0)
        : (result = (((1024 - avg) / 708.25) * 100).toFixed(2));
    // create data base
    await Data.create({
        humidity: humi_data.slice(-1)[0],
        temperature: temp_date.slice(-1)[0],
        soil_moisture: result,
    });
    // reset value
    temp_date = [0];
    humi_data = [0];
    datas = {
        device1: [0],
        device2: [0],
        device3: [0],
        device4: [0],
    };
});

router.get("/excel", async (req, res) => {
    let excelSheets = {};
    const datas = await Data.find();
    // defind date' key
    for (d of datas) {
        date = new Date(d.createdAt).toLocaleDateString();
        excelSheets[date] = [];
    }
    // check date and append to array
    for (j of datas) {
        date = new Date(j.createdAt).toLocaleDateString();
        keys = Object.keys(excelSheets);
        for (k of keys) {
            if (date == k) {
                rowData = {
                    เวลา: new Date(j.createdAt).toLocaleTimeString(),
                    ความชื้นในอากาศ: j.humidity,
                    อุณหภูมิอากาศ: j.temperature,
                    ความชื้นเฉลี่ยในดิน: j.soil_moisture,
                };
                excelSheets[k].push(rowData);
            }
        }
    }
    res.status(200).end(await downloadExcel(excelSheets));
});
router.get("/send", (req, res) => {
    device1 = datas.device1.slice(-1)[0];
    device2 = datas.device2.slice(-1)[0];
    device3 = datas.device3.slice(-1)[0];
    device4 = datas.device4.slice(-1)[0];
    console.log(device1, device2, device3, device4);
    checkStatus(device1, device2, device3, device4);
    console.log(device1_status, device2_status, device3_status, device4_status);
    avg =
        (device1 + device2 + device3 + device4) /
        (device1_status +
            device2_status +
            device3_status +
            device4_status +
            all_not_on);
    avg === 0
        ? (result = 0)
        : (result = (((1024 - avg) / 708.25) * 100).toFixed(2));
    res.status(200).json({
        humidity: humi_data.slice(-1)[0],
        temperature: temp_date.slice(-1)[0],
        soil_moisture: result,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        device1_status,
        device2_status,
        device3_status,
        device4_status,
    });
});

router.post("/recv", (req, res) => {
    const { soil_moisture, temperature, humidity, device } = req.body;
    datas[device].push(soil_moisture);
    if (device === "device1") {
        temp_date.push(temperature);
        humi_data.push(humidity);
    }
    res.status(200).json();
});

module.exports = router;
