import { Layout } from "@/components/layout/Layout";
import { Video, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VideoPost() {
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Video className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">影片出POST</h1>
          </div>
          <p className="text-muted-foreground">上傳影片並讓 AI 為您自動生成社交媒體貼文</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card animate-slide-up">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
              <Video className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">即將推出</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              影片自動發佈功能正在開發中，敬請期待！
            </p>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">開發中</span>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="mt-8 space-y-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h3 className="text-lg font-semibold text-foreground">預計功能</h3>
          <div className="grid gap-3">
            {[
              "支援多種影片格式 (MP4, MOV, WebM)",
              "自動生成影片封面圖",
              "AI 分析影片內容生成描述",
              "影片尺寸自動調整",
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border"
              >
                <div className="w-2 h-2 rounded-full gradient-primary" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
