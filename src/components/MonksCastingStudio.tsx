import React from 'react';
import { MonksCastingFrame } from './MonksCastingFrame';
import CustomMonkButton from './CustomMonkButton';
import CustomMonkInput from './CustomInput';

interface MonksCastingStudioProps {
  step: 'input' | 'image' | 'details' | 'breakdown';
  tokenId?: string;
  setTokenId?: (value: string) => void;
  onSubmit?: () => void;
  loading?: boolean;
  upscaledImage?: string | null;
  children?: React.ReactNode;
}

const MonksCastingStudio: React.FC<MonksCastingStudioProps> = ({
  step,
  tokenId = '',
  setTokenId,
  onSubmit,
  loading = false,
  upscaledImage,
  children
}) => {
  let content;
  let title;

  switch (step) {
    case 'input':
      content = (
        <div className="w-full flex flex-col items-center gap-4">
          <CustomMonkInput
            type="number"
            placeholder="Enter Token ID"          
            value={tokenId}
            onChange={(e) => setTokenId && setTokenId(e.target.value)}
          />
          {tokenId &&<CustomMonkButton
            onClick={onSubmit}
            disabled={!tokenId || loading}
            className="px-6 py-3   font-semibold rounded-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            text={loading? "Loading..." : "Submit"}
              textClassName="text-[15px] font-secondary text-[#D6C5AC]"
          />}
            
         
        </div>
      );
      break;
    
    case 'image':
      title = "Enhanced MØNK";
      content = upscaledImage ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={upscaledImage}
            alt="Upscaled Character"
            className="max-w-full max-h-[80%] object-contain rounded-lg border border-amber-200/50"
          />
        </div>
      ) : null;
      break;
    
    case 'details':
        title = "Enhanced MØNK";
        content = children;
            break;
    case 'breakdown':
      content = children;
      title =  "Character Breakdown";
      break;
  }

  console.log({ content, title,upscaledImage,step})

  return (
    <MonksCastingFrame title={title}>
      {content}
    </MonksCastingFrame>
  );
};

export default MonksCastingStudio;