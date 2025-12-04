import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { ImageUploader } from "@/components/photo/ImageUploader";
import { AspectRatioSelector, AspectRatio } from "@/components/photo/AspectRatioSelector";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Sparkles, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const WEBHOOK_URL = "https://hook.eu2.make.com/11slv9iujzflrr52e3uv6eb2ex947io7";

export default function Index() {
  const [image, setImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("square");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: image,
          aspectRatio: aspectRatio,
          description: description.trim(),
          timestamp: new Date().toISOString(),
          type: "photo",
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("已成功送出！");
        
        // Reset after animation
        setTimeout(() => {
          setImage(null);
          setDescription("");
          setIsSuccess(false);
        }, 2000);
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast.error("送出失敗，請稍後再試");
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {/* Aspect Ratio */}
          <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <AspectRatioSelector
              value={aspectRatio}
              onChange={setAspectRatio}
            />
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl p-5 shadow-card animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <label className="text-sm font-medium text-foreground block mb-3">
              簡短描述
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="輸入關於這張圖片的簡短描述，AI 將為您生成完整貼文..."
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
              className="w-full"
              disabled={isSubmitting || !image || !description.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  處理中...
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  已送出！
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  送出生成
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
