import { memo, useCallback } from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import EquipmentCard from './EquipmentCard';
import type { EquipmentListProps, Echipament } from '@/features/equipment/types';

function EquipmentList({ echipamente, onEdit, onDelete }: EquipmentListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const updateSize = () => {
      setWidth(node.offsetWidth);
      setHeight(node.offsetHeight);
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    // Wait one frame to ensure the container has dimensions when first displayed
    requestAnimationFrame(updateSize);
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const eq: Echipament = echipamente[index];
      return (
        <div style={style} className="p-2">
          <EquipmentCard
            key={eq.id}
            echipament={eq}
            onEdit={(val: Echipament | string) => {
              if (typeof val === 'object') {
                onEdit?.(val);
              } else {
                onEdit?.(eq);
              }
            }}
            onDelete={() => onDelete?.(eq.id)}
          />
        </div>
      );
    },
    [echipamente, onEdit, onDelete]
  );

  if (echipamente.length === 0) {
    return (
      <div className="mt-10 text-center text-sm text-gray-500">
        Nu există echipamente înregistrate.
      </div>
    );
  }

  const ITEM_HEIGHT = 190;

  return (
    <div ref={containerRef} className="h-[60vh] max-h-[600px]">
      {width > 0 && height > 0 && (
        <List
          height={height}
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
