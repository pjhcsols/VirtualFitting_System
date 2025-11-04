import { GlassButton } from "@/shared/components/glass-button";
import React from 'react';

type SoldOutButtonProps = {
  onClick: (e: React.MouseEvent) => void; 
};

function SoldOutButton({ onClick }: SoldOutButtonProps) {
  return (
    <GlassButton 
        onClick={onClick as unknown as () => void} 
        width="100%" 
        size="medium" 
    >
      SOLD OUT
    </GlassButton>
  );
}

export { SoldOutButton };