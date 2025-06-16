// src/react-rating-stars-component.d.ts
declare module 'react-rating-stars-component' {
  import * as React from 'react';

  export interface ReactStarsProps {
    count?: number;
    value?: number;
    onChange?: (newRating: number) => void;
    size?: number;
    isHalf?: boolean;
    edit?: boolean;
    activeColor?: string;
  }

  const ReactStars: React.FC<ReactStarsProps>;
  export default ReactStars;
}
