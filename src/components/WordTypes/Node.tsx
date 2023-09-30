import { memo } from "react";
import { Handle as ReactFlowHandle, Position } from "reactflow";

function Handle({ type }: { type: "source" | "target"}) {
    return (
        <ReactFlowHandle 
            className={"bg-gray-900 dark:bg-white"}
            isConnectable={false}
            type={type}
            position={type === "source" ? Position.Bottom : Position.Top}
        />
    );
}

function Node({ data }) {
    return (
        <div className="py-2 shadow-md rounded-md bg-white dark:bg-gray-900 border-2 border-stone-400">
            <div className="text-center">{data.label}</div>
            {["input", "default"].includes(data.type) && <Handle type="source" />}
            {["output", "default"].includes(data.type) && <Handle type="target" />}
        </div>
  );
}

export default memo(Node);
