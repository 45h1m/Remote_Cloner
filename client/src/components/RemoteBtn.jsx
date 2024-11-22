import React from "react";

const RemoteBtn = ({ onclick, label = "Remote Button", oncontext, ready = true, index }) => {
    label = label.length > 15 ? label.slice(0, 15) + ".." : label;

    return (
        <button
            className={`bg-blue-500 p-4 rounded-lg text-sm max-w-sm grow ${!ready ? "border-b-4 border-orange-500" : ""}`}
            onClick={(e) => {
                onclick({index});
            }}
            onContextMenu={(e) => {
                e.preventDefault();
                oncontext({index});
            }}
        >
            {label}
        </button>
    );
};

export default RemoteBtn;
