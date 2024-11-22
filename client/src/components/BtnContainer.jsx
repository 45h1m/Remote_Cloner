import React, { useEffect, useState, useContext, useRef } from "react";
import RemoteBtn from "./RemoteBtn";
import Spacer from "./Spacer";
import { WebSocketContext } from "../contexts/WebSocketContext";

const AddLogo = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
    </svg>
);

const CloseLogo = () => (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
    </svg>
);

const LoadingLogo = () => (
    <svg width={"30px"} height={"30px"} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <g transform="rotate(0 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(30 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(60 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(90 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(120 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(150 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(180 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(210 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(240 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s" repeatCount="indefinite"></animate>
            </rect>
        </g>
        <g transform="rotate(270 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.16666666666666666s"
                    repeatCount="indefinite"
                ></animate>
            </rect>
        </g>
        <g transform="rotate(300 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate
                    attributeName="opacity"
                    values="1;0"
                    keyTimes="0;1"
                    dur="1s"
                    begin="-0.08333333333333333s"
                    repeatCount="indefinite"
                ></animate>
            </rect>
        </g>
        <g transform="rotate(330 50 50)">
            <rect x="46" y="5" rx="4" ry="10" width="8" height="20" fill="#ffffff">
                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
            </rect>
        </g>
    </svg>
);

let remoteBtns = [
    { label: "Power", hex: null },
    { label: "Mute", hex: null },
    { label: "Menu", hex: null },
    { label: "Back", hex: null },
    { label: "1", hex: null },
    { label: "2", hex: null },
    { label: "3", hex: null },
    { label: "4", hex: null },
    { label: "5", hex: null },
    { label: "6", hex: null },
    { label: "7", hex: null },
    { label: "8", hex: null },
    { label: "9", hex: null },
    { label: "0", hex: null },
    { label: "Vol +", hex: null },
    { label: "Vol -", hex: null },
    { label: "Ch +", hex: null },
    { label: "Ch -", hex: null },
    { label: "Up", hex: null },
    { label: "Down", hex: null },
    { label: "Left", hex: null },
    { label: "Rignt", hex: null },
    { label: "Ok", hex: null },
];

const BtnContainer = () => {
    const [btnConfig, setBtnConfig] = useState(false);
    const [remoteName, setRemoteName] = useState("New Remote");
    const [selectedBtn, setSelectedBtn] = useState(0);
    const [allBtns, setAllBtns] = useState(remoteBtns);
    const [newBtnName, setNewBtnName] = useState("new Button name");
    const [newHex, setNewHex] = useState(null);
    const [irReceived, setIrReceived] = useState(false);
    const [valueCounts, setValueCounts] = useState({});
    const [handlingNewValue, setHandlingNewValue] = useState(false);
    const [finishedHandlingNewValue, setFinishedHandlingNewValue] = useState(false);
    const [handlingProgress, setHandlingProgress] = useState(0);
    const [remotesFromRepo, setRemotesFromRepo] = useState([]);
    const [fetchingRemotes, setFetchingRemotes] = useState(false);
    const [selectedOnlineRemote, setSelectedOnlineRemote] = useState("no-remotes");

    let { log, sendMsg, socket, socketState } = useContext(WebSocketContext);

    const fileInput = useRef();

    const remoteRepoURL = "https://raw.githubusercontent.com/45h1m/statics/refs/heads/main/angryRemote/remote-list.json";

    const fetchRemotesFromRepo = async () => {
        try {
            setFetchingRemotes(true);

            const res = await fetch(remoteRepoURL);

            if (!res.ok) {
                return log("[ERROR]: Failed fetching remotes.");
            }

            const json = await res.json();

            console.log(json);

            setRemotesFromRepo(json);
            setFetchingRemotes(false);
        } catch (error) {
            setFetchingRemotes(false);
            log("[ERROR-FETCHING-REMOTE]: " + error);
        }
    };

    const fetchOnlineRemoteAndInit = async () => {
        if (selectedOnlineRemote === "no-remotes") return;
        setFetchingRemotes(true);

        try {
            log("[APP]: Fetching remote: " + selectedOnlineRemote);
            const res = await fetch(selectedOnlineRemote);

            if (!res.ok) {
                return log("[ERROR]: Failed fetching remote: " + selectedOnlineRemote);
            }

            const json = await res.json();

            log("[APP] Remote fetched: " + selectedOnlineRemote);

            setSelectedBtn(0);
            setAllBtns(json.btns);
            setRemoteName(json.title);

            log("[APP]: Remote updated");
            setFetchingRemotes(false);
        } catch (error) {
            log("[ERROR]: Fething remote: " + error);
            setFetchingRemotes(false);
        }
    };

    useEffect(() => {
        fetchOnlineRemoteAndInit();
    }, [selectedOnlineRemote]);

    useEffect(() => {
        fetchRemotesFromRepo();
    }, []);

    useEffect(() => {
        setNewBtnName(allBtns[selectedBtn].label);
        setNewHex(allBtns[selectedBtn].hex);
    }, [selectedBtn]);

    const handleNewValue = (value) => {
        !handlingNewValue && setHandlingNewValue(true);
        setValueCounts((prevCounts) => {
            const updatedCounts = { ...prevCounts, [value]: (prevCounts[value] || 0) + 1 };

            return updatedCounts;
        });
        setHandlingProgress(valueCounts[value]);

        if (valueCounts[value] > 4) {
            setIrReceived(true);
            setNewHex(value);
            setTimeout(() => {
                setHandlingNewValue(false);
                setFinishedHandlingNewValue(true);
            }, 3000);

            setValueCounts({});
        }
    };

    if (socketState === "Connected") {
        socket.onmessage = (e) => {
            log("[SERVER] " + e.data);

            if (e.data.match("RX")) {
                !irReceived && handleNewValue(e.data.split("RX")[1].toUpperCase());
                // setNewHex(e.data.split("RX")[1].toUpperCase());
            }
        };
    }

    const resetIRReceiveFunction = () => {
        setIrReceived(false);
        setHandlingNewValue(true);
        setFinishedHandlingNewValue(false);
        setHandlingProgress(0);
    };

    const closeHandler = () => {
        console.log("ok");
        setBtnConfig(!btnConfig);
    };

    const showBtnConfig = ({ index }) => {
        setIrReceived(false);
        setNewHex(allBtns[index].hex);
        setNewBtnName(allBtns[index].label);
        setSelectedBtn(index);

        setFinishedHandlingNewValue(false);

        setBtnConfig(true);
    };

    const saveBtns = () => {
        const btns = [...allBtns];

        btns[selectedBtn].label = newBtnName;
        btns[selectedBtn].hex = newHex;

        setAllBtns(btns);

        setBtnConfig(false);

        resetIRReceiveFunction();
    };

    const deleteBtn = () => {
        const btns = [...allBtns];

        btns.splice(selectedBtn, 1);
        setSelectedBtn(0);
        setAllBtns(btns);
        setBtnConfig(false);

        resetIRReceiveFunction();
    };

    const addBtn = () => {
        setAllBtns((prev) => [...prev, { label: "New Button", hex: null }]);

        setSelectedBtn(allBtns.length);

        setTimeout(() => {
            setBtnConfig(true);
        }, 700);
    };

    const btnClickHandler = ({ index }) => {
        log("Btn clicked: " + index);

        if (!allBtns[index].hex) {
            log("No hex for button " + index);
            setSelectedBtn(index);
            setBtnConfig(true);
            return;
        }

        sendMsg("T" + allBtns[index].hex);
    };

    const exportRemote = () => {
        log("exporting remote");

        const jsonData = {
            title: remoteName,
            btns: allBtns,
        };

        log(remoteName);

        let jsonString = JSON.stringify(jsonData);
        let blob = new Blob([jsonString], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = url;
        link.download = remoteName + ".json";
        link.click();
        URL.revokeObjectURL(url);
    };

    const importRemote = () => {
        log("Uploading file");
        fileInput.current.click();

        fileInput.current.oninput = (e) => {
            const file = e.target.files[0];

            if (!file) {
                log("No file selected");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                log("file loaded");
                const content = e.target.result;
                try {
                    const data = JSON.parse(content);
                    log("file parsed: ");
                    log(data);

                    setSelectedBtn(0);
                    setAllBtns(data.btns);
                    setRemoteName(data.title);

                    log("Remote updated");
                } catch (error) {
                    log("Error parsing file");
                    log(error);
                }
            };

            reader.readAsText(file);
        };
    };

    return (
        <div className="p-4 w-full max-w-md mx-auto">
            <div className="flex items-center justify-end pb-5">
                <div className="flex items-center gap-2">
                    {fetchingRemotes && <LoadingLogo />}
                    <select onChange={(e) => setSelectedOnlineRemote(e.target.value)} className="bg-slate-800 p-2 rounded-lg outline-none pr-2 mr-2">
                        <option value="no-remotes">Online Remotes</option>
                        {remotesFromRepo.length > 0
                            ? remotesFromRepo.map((remote, index) => (
                                  <option key={index} value={remote.remoteURL}>
                                      {remote.remoteName}
                                  </option>
                              ))
                            : ""}
                    </select>
                </div>
            </div>
            <div className="bg-slate-800 p-2 rounded-lg flex gap-2 flex-wrap justify-stretch">
                <input
                    onChange={(e) => setRemoteName(e.target.value)}
                    type="text"
                    value={remoteName}
                    className="px-4 py-2 bg-transparent rounded-lg focus:bg-slate-800"
                />
                {allBtns.map((btn, index) => (
                    <RemoteBtn
                        key={index}
                        label={btn.label}
                        index={index}
                        onclick={btnClickHandler}
                        oncontext={showBtnConfig}
                        ready={btn.label && btn.hex}
                    />
                ))}
                <button className="bg-slate-800 p-4 rounded-lg text-sm max-w-sm border-2 border-dashed border-slate-600" onClick={addBtn}>
                    <AddLogo />
                </button>
            </div>

            <div
                className={`btn-configure-page ${
                    btnConfig ? "" : "hidden"
                } fixed top-0 left-0 z-20 flex backdrop-blur-sm w-full h-full justify-center items-center p-3`}
            >
                <div onClick={() => setBtnConfig(false)} className="clickArea fixed top-0 left-0 w-full h-full"></div>
                <div className="container max-w-md bg-slate-800 p-4 rounded-lg shadow-2xl">
                    <div className="flex justify-between items-center pb-5 pt-2 px-1">
                        <h4>Configure Button</h4>

                        <button onClick={closeHandler}>
                            <CloseLogo />
                        </button>
                    </div>

                    <div className="border-2 border-slate-700 rounded-lg p-2">
                        <p className="text-sm opacity-50 pl-1 pb-3">Decoded HEX value</p>
                        <div className="flex items-center gap-2 pb-4">
                            <input
                                type="text"
                                placeholder="Waiting for IR signal value.."
                                value={newHex ? newHex : ""}
                                onChange={(e) => setNewHex(e.target.value)}
                                className="p-2 pl-3 bg-slate-900 rounded-lg text-white w-full"
                            />
                            {irReceived ? "" : <LoadingLogo />}
                        </div>

                        {(handlingNewValue || irReceived) && (
                            <div className="relative border-2 border-blue-800 p-1 px-2 rounded-md text-blue-50">
                                <div
                                    className={`absolute top-0 left-0 h-full bg-blue-900 -z-10 transition-all duration-200`}
                                    style={{ width: `${20 * handlingProgress}%` }}
                                ></div>
                                <p className="text-center">{irReceived ? "SUCCESS ✅" : "Receiving.. Keep pressing same button.."}</p>
                            </div>
                        )}

                        {!handlingNewValue && !irReceived && (
                            <p className="text-orange-300/80 pl-2">Point remote towards IR receiver & press the button you want to clone</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 pt-4">
                        <div>
                            <p className="text-sm opacity-50 pl-1 pb-3">Button label</p>
                            <input
                                type="text"
                                value={newBtnName}
                                onChange={(e) => setNewBtnName(e.target.value)}
                                className="p-2 pl-4 bg-slate-900 rounded-lg text-white"
                            />
                        </div>
                        <Spacer />
                        <div className="flex gap-2 justify-end pt-4">
                            <button className="py-2 px-3 bg-red-800 rounded-lg" onClick={deleteBtn}>
                                Delete
                            </button>
                            <button className="py-2 px-3 bg-blue-500 rounded-lg" onClick={saveBtns}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sticky bottom-0 w-full flex gap-2 py-2 items-center bg-slate-900 pl-2">
                <input type="file" accept=".arem" ref={fileInput} className="hidden" />
                <button className="bg-slate-700 px-4 py-2 rounded-lg text-sm max-w-sm" onClick={importRemote}>
                    Import
                </button>
                <p className="opacity-50">Remote or</p>
                <button className="bg-slate-700 px-4 py-2 rounded-lg text-sm max-w-sm" onClick={exportRemote}>
                    Export
                </button>
                <p className="opacity-50">This Remote</p>
            </div>
        </div>
    );
};

export default BtnContainer;
