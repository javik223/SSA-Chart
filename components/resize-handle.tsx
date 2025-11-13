'use client';

import { useState, useRef, useEffect, memo } from 'react';
import { useChartStore } from '@/store/useChartStore';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ResizeHandle = memo(function ResizeHandle() {
  const previewWidth = useChartStore((state) => state.previewWidth);
  const setPreviewWidth = useChartStore((state) => state.setPreviewWidth);

  const [isResizing, setIsResizing] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = previewWidth;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startXRef.current;
      const newWidth = Math.max(300, startWidthRef.current + deltaX);
      setPreviewWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, setPreviewWidth]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        'absolute bottom-0 right-0 w-6 h-6 cursor-ew-resize',
        'hover:bg-zinc-100 active:bg-zinc-200',
        'flex items-center justify-center group transition-colors'
      )}
      title='Drag to resize width'
    >
      <GripVertical
        className={cn(
          'w-4 h-4 text-zinc-400 group-hover:text-zinc-600 rotate-90'
        )}
      />
    </div>
  );
});
