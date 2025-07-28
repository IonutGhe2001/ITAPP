import { memo } from "react";
import { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from "react-window";
import EquipmentCard from "./EquipmentCard";
import type { EquipmentListProps, Echipament } from "@/features/equipment/types";


function EquipmentList({
  echipamente,
  onEdit,
  onDelete,
}: EquipmentListProps) {
    const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (echipamente.length === 0) {
    return (
      <div className="text-center text-sm text-gray-500 mt-10">
        Nu există echipamente înregistrate.
      </div>
    );
  }

 const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const eq: Echipament = echipamente[index];
    return (
      <div style={style} className="p-2">
        <EquipmentCard
          key={eq.id}
          echipament={eq}
          onEdit={(val: Echipament | string) => {
            if (typeof val === "object") {
              onEdit?.(val);
            } else {
              onEdit?.(eq);
            }
          }}
          onDelete={() => onDelete?.(eq.id)}
        />
     </div>
    );
  };

  const ITEM_HEIGHT = 190;

  return (
    <div ref={containerRef} className="h-[600px]">
      {width > 0 && (
        <List
          height={600}
          width={width}
          itemCount={echipamente.length}
          itemSize={ITEM_HEIGHT}
          overscanCount={5}
        >
          {Row}
        </List>
      )}
    </div>
  );
}

export default memo(EquipmentList);
