import { useTooltipStore } from '@/components/providers/TooltipProvider';
import { useShallow } from 'zustand/react/shallow';

export function useTooltipActions() {
  return useTooltipStore( useShallow( ( state ) => ( {
    showTooltip: state.showTooltip,
    hideTooltip: state.hideTooltip,
    moveTooltip: state.moveTooltip,
  } ) ) );
}

export function useTooltipState() {
  return useTooltipStore( useShallow( ( state ) => ( {
    visible: state.visible,
    x: state.x,
    y: state.y,
    content: state.content,
  } ) ) );
}
