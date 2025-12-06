import { useRef, useState } from "react";
import { Upload, Camera, X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AspectRatio } from "./AspectRatioSelector";

interface ImageUploaderProps {
  image: string | null;
  aspectRatio: AspectRatio;
  onImageChange: (image: string | null) => void;
}

const aspectRatioValues = {
  horizontal: 16 / 9,
  square: 1,
  vertical: 9 / 16,
};

export function ImageUploader({ image, aspectRatio, onImageChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Calculate crop overlay dimensions based on aspect ratio
  const getCropOverlayStyle = () => {
    const ratio = aspectRatioValues[aspectRatio];
    if (ratio >= 1) {
      // Horizontal or square - width is 100%, height is proportional
      return {
        width: '70%',
        height: `${70 / ratio}%`,
      };
    } else {
      // Vertical - height is 100%, width is proportional
      return {
        width: `${70 * ratio}%`,
        height: '90%',
      };
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">上傳圖片</label>
      
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-card"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">拖放圖片到這裡</p>
              <p className="text-sm text-muted-foreground mt-1">或使用下方按鈕選擇</p>
            </div>
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4" />
                選擇檔案
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-4 h-4" />
                拍攝相片
              </Button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative bg-card rounded-xl overflow-hidden">
            {/* Image container with overlay */}
            <div className="relative w-full aspect-[4/3] bg-secondary">
              <img
                src={image}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Dark overlay outside crop area */}
              <div className="absolute inset-0 bg-black/50" />
              
              {/* Crop frame overlay */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-cyan-400 bg-transparent"
                style={getCropOverlayStyle()}
              >
                {/* Corner handles */}
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
                
                {/* Clear the crop area */}
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: 'inset(0)',
                  }}
                />
              </div>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
        </div>
      )}
    </div>
  );
}
