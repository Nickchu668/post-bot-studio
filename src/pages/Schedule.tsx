import { Layout } from "@/components/layout/Layout";
import { Calendar, Clock, Sparkles, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Schedule() {
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">文案排程</h1>
          </div>
          <p className="text-muted-foreground">管理您的社交媒體發佈排程</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-card rounded-2xl p-8 shadow-card animate-slide-up">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">即將推出</h2>
            <p className="text-muted-foreground mb-6 max-w-sm">
              文案排程功能正在開發中，讓您輕鬆管理發佈時間！
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
              "日曆視圖管理所有排程貼文",
              "設定自動發佈時間",
              "批量排程多篇貼文",
              "AI 建議最佳發佈時間",
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

        {/* Sample Schedule Items */}
        <div className="mt-8 space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">排程預覽</h3>
            <Button variant="outline" size="sm" disabled>
              <Plus className="w-4 h-4" />
              新增排程
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { time: "09:00", date: "明天", status: "待發佈" },
              { time: "12:30", date: "後天", status: "待發佈" },
              { time: "18:00", date: "12月7日", status: "待發佈" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border opacity-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.date}</p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
