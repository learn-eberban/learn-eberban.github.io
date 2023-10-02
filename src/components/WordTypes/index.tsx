import { useEffect, useState } from "react";
import ReactFlow, {useReactFlow, useStore, ReactFlowProvider} from "reactflow";
import "reactflow/dist/base.css";
import CustomNode from "./Node";

const layer1 = 25;
const layer2 = 125;
const layer3 = 225;
const layer4 = 325;

const createNode = (
    id: string,
    type: "input" | "default" | "output",
    label: string,
    centre: { x: number, y: number },
) => {
    const nodeWidth = 125;
    return {
        id,
        type: "custom", // please use our custom dark-mode-compatible node
        data: { label, type },
        position: { x: centre.x - (nodeWidth / 2), y: centre.y },
        style: { width: `${nodeWidth}px` },
    };
};

const nodes = [
    createNode("1", "input", "Word Types",          { x: 400, y: layer1 }),
    createNode("2", "output", "Particles",          { x: 200, y: layer2 }),
    createNode("3", "default", "Content Words",     { x: 600, y: layer2 }),
    createNode("4", "output", "Roots",              { x: 400, y: layer3 }),
    createNode("5", "output", "Borrowings",         { x: 500, y: layer4 }),
    createNode("6", "output", "Freeform Variables", { x: 700, y: layer4 }),
    createNode("7", "output", "Compounds",          { x: 800, y: layer3 }),
];

const nodeTypes = { custom: CustomNode };

const edges = [
    { id: "1-2", source: "1", target: "2", type: "smoothstep" },
    { id: "1-3", source: "1", target: "3", type: "smoothstep" },
    { id: "3-4", source: "3", target: "4", type: "smoothstep" },
    { id: "3-5", source: "3", target: "5", type: "smoothstep" },
    { id: "3-6", source: "3", target: "6", type: "smoothstep" },
    { id: "3-7", source: "3", target: "7", type: "smoothstep" },
];

function Flow() {
    // Add ReactFlow-responsiveness. It's not included by default!
    const reactFlowWidth = useStore((state: { width: any }) => state.width);
    const reactFlowHeight = useStore((state: { height: any }) => state.height);
    const { fitView } = useReactFlow();
    useEffect(() => {
      fitView();
    }, [reactFlowWidth, reactFlowHeight]);

    const options = {
        autoPanOnNodeDrag: false,
        connectOnClick: false,
        elementsSelectable: false,
        fitView: true,
        fitViewOptions: {minZoom: 0.4},
        nodesConnectable: false,
        panOnDrag: false,
        preventScrolling: false,
        zoomOnPinch: false,
        zoomOnScroll: false,
    };

    return ( 
        <div className="w-full h-48 md:h-96 my-2">
            <ReactFlow 
                nodes={nodes}
                nodeTypes={nodeTypes}
                edges={edges}
                {...options}
                proOptions={{hideAttribution: true}}
            />
        </div>
    );
}

export default function FlowWithProvider(props) {
    return <ReactFlowProvider><Flow {...props} /></ReactFlowProvider>
}
