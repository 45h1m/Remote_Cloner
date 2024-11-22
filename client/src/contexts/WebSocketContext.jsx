import { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

// const host = "powertracker-production.up.railway.app";
const host = '172.217.28.1';

let socket = null;

export const WebSocketProvider = (props) => {
    let [socketState, setSocketState] = useState("Connecting..");
    let [logs, setLogs] = useState("::::LOGS::::\n");
    let [debug, setDebug] = useState(false);

    useEffect(() => {
        connectSocket();
    }, []);

    const connectSocket = () => {
        const address = "ws:/" + "/" + host + ":81";
        log(">>>>github/45h1m<<<<");
        log("Trying to connect socket");
        log(address);

        socket = new WebSocket(address);

        socket.onopen = (e) => {
            setSocketState("Connected");
            log("[socket] openned ");
        };
        socket.onclose = (e) => {
            setSocketState("Disconnected");
            socket.close();
            log("[socket] closed");
        };
        socket.onerror = (e) => {
            log("[socket] error: " + e);
            socket.close();
        };

        socket.onmessage = (e) => {
            log("[SERVER]: "+ e.data);

            if (e.data.match("realtimeBuffer")) {
                // setRealtimeData(JSON.parse(e.data).realtimeBuffer)
            } else if (e.data.match("update")) {
                
            }
        };
    };

    const sendMsg = (msg) => {
        socket.send(msg);
        log("sent: " + msg);
    };

    const log = (msg) => {
        console.log(msg);
        setLogs((prev) => (prev += "\n" + msg));
    };

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                socketState,
                setSocketState,
                connectSocket,
                logs,
                setLogs,
                sendMsg,
                debug,
                setDebug,
                log,
                host
            }}
        >
            {props.children}
        </WebSocketContext.Provider>
    );
};
