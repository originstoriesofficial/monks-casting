import React, { ReactNode } from 'react';
import Image from 'next/image';
import CustomDiv from './CustomDiv';

interface MonksCastingFrameProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export const MonksCastingFrame: React.FC<MonksCastingFrameProps> = ({ 
  children, 
  title ,
    className = "",
}) => {
  return (
    <div className={`w-full max-w-xl mx-auto relative ${className} `}>
      {/* Main content box with art-deco border */}
      <div className="relative py-4">
        {/* Border Frame */}
        <div className="relative aspect-square">
            <Image src="/images/rect_monk.svg" alt="Art deco border" width={1000} height={150} />
          
          {/* Main content area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3/4 h-3/4  flex flex-col items-left justify-between p-4">
              {title && (
                <div>
                 <CustomDiv text={title}/>
                </div>
              )}
              <div className="w-full flex-1 flex items-center justify-center">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
