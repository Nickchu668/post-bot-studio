import { useRef, useState, useCallback, useEffect } from "react";
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

type DragMode = 'none' | 'move' | 'resize-tl' | 'resize-tr' | 'resize-bl' | 'resize-br';

export function ImageUploader({ image, aspectRatio, onImageChange }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Crop box state: position and size in percentage
  const [cropBox, setCropBox] = useState({ x: 20, y: 15, width: 60, height: 70 });
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0, box: cropBox });

  // Reset crop box when aspect ratio changes
  useEffect(() => {
    const ratio = aspectRatioValues[aspectRatio];
    let width: number, height: number;
    
    if (ratio >= 1) {
      width = 70;
      height = width / ratio;
    } else {
      height = 80;
      width = height * ratio;
    }
    
    setCropBox({
      x: (100 - width) / 2,
      y: (100 - height) / 2,
      width,
      height,
    });
  }, [aspectRatio]);

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

  const getClientPos = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = useCallback((mode: DragMode, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const pos = getClientPos(e);
    setDragMode(mode);
    setDragStart({ x: pos.x, y: pos.y, box: { ...cropBox } });
  }, [cropBox]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (dragMode === 'none' || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const pos = getClientPos(e);
    const deltaX = ((pos.x - dragStart.x) / rect.width) * 100;
    const deltaY = ((pos.y - dragStart.y) / rect.height) * 100;
    const ratio = aspectRatioValues[aspectRatio];
    
    if (dragMode === 'move') {
      // Move the crop box
      const newX = Math.max(0, Math.min(100 - dragStart.box.width, dragStart.box.x + deltaX));
      const newY = Math.max(0, Math.min(100 - dragStart.box.height, dragStart.box.y + deltaY));
      setCropBox(prev => ({ ...prev, x: newX, y: newY }));
    } else {
      // Resize from corners while maintaining aspect ratio
      let newWidth = dragStart.box.width;
      let newHeight = dragStart.box.height;
      let newX = dragStart.box.x;
      let newY = dragStart.box.y;
      
      if (dragMode === 'resize-br') {
        newWidth = Math.max(20, Math.min(100 - dragStart.box.x, dragStart.box.width + deltaX));
        newHeight = newWidth / ratio;
        if (newY + newHeight > 100) {
          newHeight = 100 - newY;
          newWidth = newHeight * ratio;
        }
      } else if (dragMode === 'resize-bl') {
        newWidth = Math.max(20, dragStart.box.width - deltaX);
        newHeight = newWidth / ratio;
        newX = dragStart.box.x + dragStart.box.width - newWidth;
        if (newX < 0) {
          newX = 0;
          newWidth = dragStart.box.x + dragStart.box.width;
          newHeight = newWidth / ratio;
        }
        if (newY + newHeight > 100) {
          newHeight = 100 - newY;
          newWidth = newHeight * ratio;
          newX = dragStart.box.x + dragStart.box.width - newWidth;
        }
      } else if (dragMode === 'resize-tr') {
        newWidth = Math.max(20, Math.min(100 - dragStart.box.x, dragStart.box.width + deltaX));
        newHeight = newWidth / ratio;
        newY = dragStart.box.y + dragStart.box.height - newHeight;
        if (newY < 0) {
          newY = 0;
          newHeight = dragStart.box.y + dragStart.box.height;
          newWidth = newHeight * ratio;
        }
      } else if (dragMode === 'resize-tl') {
        newWidth = Math.max(20, dragStart.box.width - deltaX);
        newHeight = newWidth / ratio;
        newX = dragStart.box.x + dragStart.box.width - newWidth;
        newY = dragStart.box.y + dragStart.box.height - newHeight;
        if (newX < 0) {
          newX = 0;
          newWidth = dragStart.box.x + dragStart.box.width;
          newHeight = newWidth / ratio;
          newY = dragStart.box.y + dragStart.box.height - newHeight;
        }
        if (newY < 0) {
          newY = 0;
          newHeight = dragStart.box.y + dragStart.box.height;
          newWidth = newHeight * ratio;
          newX = dragStart.box.x + dragStart.box.width - newWidth;
        }
      }
      
      setCropBox({ x: newX, y: newY, width: newWidth, height: newHeight });
    }
  }, [dragMode, dragStart, aspectRatio]);

  const handleEnd = useCallback(() => {
    setDragMode('none');
  }, []);

  return (
    <div className="space-y-4">
      {!image ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-card/30"
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-secondary/50 flex items-center justify-center">
              <ImageIcon className="w-7 h-7 text-muted-foreground" />
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
            className="relative bg-card rounded-2xl overflow-hidden select-none"
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            <div className="relative w-full aspect-[4/3]">
              {/* Background image - dimmed */}
              <img
                src={image}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover brightness-50"
                draggable={false}
              />
              
              {/* Crop frame - shows clear image */}
              <div 
                className="absolute overflow-hidden cursor-move"
                style={{
                  left: `${cropBox.x}%`,
                  top: `${cropBox.y}%`,
                  width: `${cropBox.width}%`,
                  height: `${cropBox.height}%`,
                }}
                onMouseDown={(e) => handleStart('move', e)}
                onTouchStart={(e) => handleStart('move', e)}
              >
                {/* Clear image inside crop area */}
                <img
                  src={image}
                  alt="Crop preview"
                  className="absolute object-cover pointer-events-none"
                  style={{
                    width: `${100 / (cropBox.width / 100)}%`,
                    height: `${100 / (cropBox.height / 100)}%`,
                    left: `-${cropBox.x / (cropBox.width / 100)}%`,
                    top: `-${cropBox.y / (cropBox.height / 100)}%`,
                  }}
                  draggable={false}
                />
                
                {/* Dashed border */}
                <div className="absolute inset-0 border-2 border-dashed border-white pointer-events-none" />
              </div>
              
              {/* Corner handles - outside crop div for better hit area */}
              {/* Top-left */}
              <div 
                className="absolute w-4 h-4 cursor-nwse-resize z-10 flex items-center justify-center"
                style={{
                  left: `calc(${cropBox.x}% - 8px)`,
                  top: `calc(${cropBox.y}% - 8px)`,
                }}
                onMouseDown={(e) => handleStart('resize-tl', e)}
                onTouchStart={(e) => handleStart('resize-tl', e)}
              >
                <div className="w-3 h-3 border-2 border-white bg-transparent" />
              </div>
              
              {/* Top-right */}
              <div 
                className="absolute w-4 h-4 cursor-nesw-resize z-10 flex items-center justify-center"
                style={{
                  left: `calc(${cropBox.x + cropBox.width}% - 8px)`,
                  top: `calc(${cropBox.y}% - 8px)`,
                }}
                onMouseDown={(e) => handleStart('resize-tr', e)}
                onTouchStart={(e) => handleStart('resize-tr', e)}
              >
                <div className="w-3 h-3 border-2 border-white bg-transparent" />
              </div>
              
              {/* Bottom-left */}
              <div 
                className="absolute w-4 h-4 cursor-nesw-resize z-10 flex items-center justify-center"
                style={{
                  left: `calc(${cropBox.x}% - 8px)`,
                  top: `calc(${cropBox.y + cropBox.height}% - 8px)`,
                }}
                onMouseDown={(e) => handleStart('resize-bl', e)}
                onTouchStart={(e) => handleStart('resize-bl', e)}
              >
                <div className="w-3 h-3 border-2 border-white bg-transparent" />
              </div>
              
              {/* Bottom-right */}
              <div 
                className="absolute w-4 h-4 cursor-nwse-resize z-10 flex items-center justify-center"
                style={{
                  left: `calc(${cropBox.x + cropBox.width}% - 8px)`,
                  top: `calc(${cropBox.y + cropBox.height}% - 8px)`,
                }}
                onMouseDown={(e) => handleStart('resize-br', e)}
                onTouchStart={(e) => handleStart('resize-br', e)}
              >
                <div className="w-3 h-3 border-2 border-white bg-transparent" />
              </div>
            </div>
            
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white hover:bg-destructive transition-colors z-10"
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
