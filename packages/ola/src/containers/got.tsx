import React, { useRef } from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AutoSize from "react-virtualized-auto-sizer";
import { Tree, TreeApi } from "../components/Tree/index";
import { Node } from "./node";
import { MyData, useBackend } from "./backend";
interface ExampleProps {
  foundIndex: number;
  // Other props of the Example component
}
// export function GotLineage() {
const GotLineage: React.FC<ExampleProps> = ({ foundIndex }) => {
  const backend = useBackend();
  const rootElement = useRef<HTMLDivElement | null>(null);
  return (
    <div ref={rootElement} style={{ height: "100%", width: "100%" }}>
      <AutoSize>
        {(props: any) => (
          <Tree
            ref={(tree) => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              global.tree = tree;
            }}
            className="react-aborist"
            data={backend.data}
            getChildren="children"
            isOpen="isOpen"
            // disableDrop={(d: MyData) => d.name === "House Arryn"}
            hideRoot
            indent={24}
            onMove={backend.onMove}
            onToggle={backend.onToggle}
            onEdit={backend.onEdit}
            rowHeight={22}
            width={props.width}
            height={props.height}
            onClick={(e) => 
              console.log(e,backend,"clicked the tree")
            }
            onContextMenu={() => console.log("context menu the tree")}
            dndRootElement={undefined}
            foundIndex={foundIndex}
          >
            {Node}
          </Tree>
        )}
      </AutoSize>
    </div>
  );
}
export default GotLineage