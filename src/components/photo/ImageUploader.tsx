import { useRef, useState, useCallback } from "react";
import { Upload, Camera, X, ImageIcon, Move } from "lucide-react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cropPosition, setCropPosition] = useState({ x: 50, y: 50 });
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target?.result as string);
        setCropPosition({ x: 50, y: 50 });
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

  const handleCropMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingCrop(true);
  }, []);

  const handleCropMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDraggingCrop || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCropPosition({
      x: Math.max(15, Math.min(85, x)),
      y: Math.max(15, Math.min(85, y)),
    });
  }, [isDraggingCrop]);

  const handleCropMouseUp = useCallback(() => {
    setIsDraggingCrop(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingCrop(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDraggingCrop || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    
    setCropPosition({
      x: Math.max(15, Math.min(85, x)),
      y: Math.max(15, Math.min(85, y)),
    });
  }, [isDraggingCrop]);

  const handleTouchEnd = useCallback(() => {
    setIsDraggingCrop(false);
  }, []);

  // Calculate crop overlay dimensions based on aspect ratio
  const getCropDimensions = () => {
    const ratio = aspectRatioValues[aspectRatio];
    if (ratio >= 1) {
      return { width: 65, height: 65 / ratio };
    } else {
      return { width: 50 * ratio, height: 80 };
    }
  };

  const cropDimensions = getCropDimensions();

  return (
    <div className="space-y-4">
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 bg-card/50"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary/80 flex items-center justify-center">
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
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                選擇檔案
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => cameraInputRef.current?.click()}
                className="gap-2"
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
        <div className="space-y-3">
          {/* Image container with crop overlay */}
          <div 
            ref={containerRef}
            className="relative bg-secondary/30 rounded-2xl overflow-hidden select-none"
            onMouseMove={handleCropMouseMove}
            onMouseUp={handleCropMouseUp}
            onMouseLeave={handleCropMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full aspect-[4/3]">
              {/* Background image */}
              <img
                src={image}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
              />
              
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/60" />
              
              {/* Crop frame - draggable */}
              <div 
                className={cn(
                  "absolute border-2 border-cyan-400 cursor-move transition-shadow",
                  isDraggingCrop && "shadow-[0_0_20px_rgba(0,255,255,0.5)]"
                )}
                style={{
                  width: `${cropDimensions.width}%`,
                  height: `${cropDimensions.height}%`,
                  left: `${cropPosition.x - cropDimensions.width / 2}%`,
                  top: `${cropPosition.y - cropDimensions.height / 2}%`,
                }}
                onMouseDown={handleCropMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* Corner handles */}
                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-3 border-l-3 border-cyan-400 bg-cyan-400/20" />
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-3 border-r-3 border-cyan-400 bg-cyan-400/20" />
                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-3 border-l-3 border-cyan-400 bg-cyan-400/20" />
                <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-3 border-r-3 border-cyan-400 bg-cyan-400/20" />
                
                {/* Center move indicator */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/40 rounded-full p-2">
                    <Move className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
                
                {/* Clear crop area showing the image */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: `${100 / (cropDimensions.width / 100)}% ${100 / (cropDimensions.height / 100)}%`,
                    backgroundPosition: `${(cropPosition.x - cropDimensions.width / 2) / (100 - cropDimensions.width) * 100}% ${(cropPosition.y - cropDimensions.height / 2) / (100 - cropDimensions.height) * 100}%`,
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
          
          {/* Change image button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Upload className="w-4 h-4 mr-2" />
            更換圖片
          </Button>
          
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
