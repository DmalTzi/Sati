import React from "react";

function DeviceStatus({ status, label }) {
    return (
        <>
            {status ? (
                <div className="device-status-card green">
                    <p>{label}</p>
                </div>
            ) : (
                <div className="device-status-card red">
                    <p>{label}</p>
                </div>
            )}
        </>
    );
}

export default DeviceStatus;
