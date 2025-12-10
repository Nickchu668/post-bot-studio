import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ImageUploader } from "@/components/photo/ImageUploader";
import { AspectRatioSelector, AspectRatio } from "@/components/photo/AspectRatioSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles, Calendar, ArrowRight, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const WEBHOOK_URL = "https://hook.eu2.make.com/11slv9iujzflrr52e3uv6eb2ex947io7";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth(true); // Require authentication
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  // Show loading state while checking auth
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  const uploadImageToStorage = async (base64Image: string): Promise<string | null> => {
    try {
      // Convert base64 to blob
      const base64Data = base64Image.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      
      // Generate unique filename with user folder for RLS
      const userId = user?.id || 'anonymous';
      const fileName = `${userId}/photo_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) {
        console.error('Storage upload error:', error);
        return null;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('photos')
        .getPublicUrl(data.path);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image) {
      toast.error("請先上傳圖片");
      return;
    }

    if (!description.trim()) {
      toast.error("請輸入描述");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to storage first
      const imageUrl = await uploadImageToStorage(image);
      
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
          aspectRatio: aspectRatio,
          description: description.trim(),
          timestamp: new Date().toISOString(),
          type: "photo",
        }),
      });

      if (response.ok) {
        setUploadedImageUrl(imageUrl);
        setIsSuccess(true);
        toast.success("已成功送出！");
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast.error("送出失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueUpload = () => {
    setImage(null);
    setDescription("");
    setIsSuccess(false);
    setUploadedImageUrl(null);
  };

  // Success state view
  if (isSuccess && uploadedImageUrl) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-2xl mx-auto">
          <div className="text-center space-y-6 animate-fade-in">
            {/* Success header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">上傳完成！</h1>
              <p className="text-muted-foreground">圖片已成功儲存，資料已發送至處理系統</p>
            </div>

            {/* Uploaded image preview */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="w-full max-w-md mx-auto rounded-xl object-cover aspect-square"
              />
            </div>

            {/* Next step info */}
            <div className="bg-card rounded-xl p-4 flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">下一步：安排刊出時間</p>
                <p className="text-sm text-muted-foreground">前往文案排程設定發佈日期和時間</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex-1"
                onClick={() => navigate('/schedule')}
              >
                <Calendar className="w-5 h-5" />
                前往文案排程
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleContinueUpload}
              >
                <ImagePlus className="w-5 h-5" />
                繼續上傳圖片
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">相片出POST</h1>
          </div>
          <p className="text-muted-foreground">上傳圖片並讓 AI 為您自動生成社交媒體貼文</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up">
            <ImageUploader
              image={image}
              aspectRatio={aspectRatio}
              onImageChange={setImage}
            />
          </div>

          {/* Aspect Ratio - only show when image is uploaded */}
          {image && (
            <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <AspectRatioSelector
                value={aspectRatio}
                onChange={setAspectRatio}
              />
            </div>
          )}

          {/* Description */}
          <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label className="text-sm font-medium text-foreground block mb-3">
              簡短描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="輸入關於這張圖片的描述..."
              className="min-h-[120px] bg-secondary border-border resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Submit Button */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !image || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  處理中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  送出
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
