import React from 'react';
import { debounce } from 'lodash';

function findBaseTooltipElement(element) {
  const elementStyle = getComputedStyle(element);
  if (isStyleWithEllipsis(elementStyle)) {
    return isOverflowX(element) ? element : null;
  }
  if (isStyleWithClamp(elementStyle)) {
    return isOverflowY(element) ? element : null;
  }
  return element.parentElement ? findBaseTooltipElement(element.parentElement) : null;
}

const isStyleWithEllipsis = (style) => style.overflowX === 'hidden' &&
  style.textOverflow === 'ellipsis' &&
  style.whiteSpace === 'nowrap';

const isStyleWithClamp = (style) => style['-webkit-line-clamp'] > 0;

const isOverflowX = (element) => element.offsetWidth < element.scrollWidth;

const isOverflowY = (element) => element.offsetHeight < element.scrollHeight;

export const EllipsisTooltips = React.memo(({
  debounceTimeMilliseconds = 300,
  onShowTooltip
}) => {
  const tooltipBaseElement = React.useRef(null);

  const defineTooltipBaseElement = React.useCallback(debounce((element) => {
    const baseElement = findBaseTooltipElement(element);
    tooltipBaseElement.current = baseElement;
    onShowTooltip?.(baseElement);
  }, debounceTimeMilliseconds), []);
  
  const setHoveredElement = React.useCallback((hoveredElement) => {
    if (tooltipBaseElement.current && tooltipBaseElement.current !== hoveredElement && !tooltipBaseElement.current.contains(hoveredElement)) {
      defineTooltipBaseElement.cancel();
      tooltipBaseElement.current = null;
      onShowTooltip?.(null);
    }
    defineTooltipBaseElement(hoveredElement);
  }, [onShowTooltip, defineTooltipBaseElement]);

  React.useEffect(() => {
    const mouseOverHandler = (e) => setHoveredElement(e.target);

    document.addEventListener('mouseover', mouseOverHandler);
    return () => {
      document.removeEventListener('mouseover', mouseOverHandler);    
    }
  }, [setHoveredElement]);

  return null;
});

