"use client";

import { memo } from "react";

import { LayerType, Side, XYWH } from "@/types/canvas";
import { useSelf, useStorage } from "@/liveblocks.config";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

interface SelectionBoxProps {
  onResizeHandlePointerDown: (corner: Side, initialBounds: XYWH) => void;
}

const HANDLE_WIDTH = 8;

export const SelectionBox = memo(
  ({ onResizeHandlePointerDown }: SelectionBoxProps) => {
    const soleLayerId = useSelf((me) =>
      me.presence.selection.length === 1 ? me.presence.selection[0] : null
    );

    const isShowingHandles = useStorage(
      (root) =>
        soleLayerId && root.layers.get(soleLayerId)?.type !== LayerType.Path
    );

    const bounds = useSelectionBounds();

    if (!bounds) {
      return null;
    }

    const rect = {
      cardinal: ["nwse", "ns", "nesw", "ew", "nwse", "ns", "nesw", "ew"],
      boundsX: [
        bounds.x - HANDLE_WIDTH / 2,
        bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        bounds.x + bounds.width - HANDLE_WIDTH / 2,
        bounds.x + bounds.width - HANDLE_WIDTH / 2,
        bounds.x + bounds.width - HANDLE_WIDTH / 2,
        bounds.x + bounds.width / 2 - HANDLE_WIDTH / 2,
        bounds.x - HANDLE_WIDTH / 2,
        bounds.x - HANDLE_WIDTH / 2,
      ],
      boundsY: [
        bounds.y - HANDLE_WIDTH / 2,
        bounds.y - HANDLE_WIDTH / 2,
        bounds.y - HANDLE_WIDTH / 2,
        bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
        bounds.y + bounds.height - HANDLE_WIDTH / 2,
        bounds.y + bounds.height - HANDLE_WIDTH / 2,
        bounds.y + bounds.height - HANDLE_WIDTH / 2,
        bounds.y + bounds.height / 2 - HANDLE_WIDTH / 2,
      ],
      resizeSide: [
        Side.Top + Side.Left,
        Side.Top,
        Side.Top + Side.Right,
        Side.Right,
        Side.Bottom + Side.Right,
        Side.Bottom,
        Side.Bottom + Side.Left,
        Side.Left,
      ],
    };

    return (
      <>
        <rect
          className="fill-transparent stroke-blue-500 stroke-1 pointer-events-none"
          style={{
            transform: `translate(${bounds.x}px, ${bounds.y}px)`,
          }}
          x={0}
          y={0}
          width={bounds.width}
          height={bounds.height}
        />
        {isShowingHandles &&
          rect.cardinal.map((direction, i) => (
            <rect
              key={i}
              className="fill-white stroke-1 stroke-blue-500"
              x={0}
              y={0}
              style={{
                cursor: `${direction}-resize`,
                width: `${HANDLE_WIDTH}px`,
                height: `${HANDLE_WIDTH}px`,
                transform: `translate(${rect.boundsX[i]}px, ${rect.boundsY[i]}px)`,
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                onResizeHandlePointerDown(rect.resizeSide[i], bounds);
              }}
            />
          ))}
      </>
    );
  }
);

SelectionBox.displayName = "SelectionBox";
