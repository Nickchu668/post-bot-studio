import { Layout } from "@/components/layout/Layout";
import { Settings, BarChart3, Users, Zap, TrendingUp, ImageIcon, Video, Calendar } from "lucide-react";

const stats = [
  { label: "已發佈貼文", value: "0", icon: ImageIcon, color: "text-primary" },
  { label: "排程中", value: "0", icon: Calendar, color: "text-warning" },
  { label: "總觀看次數", value: "0", icon: TrendingUp, color: "text-success" },
  { label: "互動率", value: "0%", icon: Users, color: "text-primary" },
];

const recentActivity = [
  { action: "系統啟動", time: "剛剛", icon: Zap },
  { action: "準備就緒", time: "剛剛", icon: Settings },
];

export default function Dashboard() {
  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">控制台</h1>
          </div>
          <p className="text-muted-foreground">監控您的社交媒體表現和管理設定</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card rounded-2xl p-5 shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">快速操作</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "新增相片", icon: ImageIcon, href: "/" },
              { label: "新增影片", icon: Video, href: "/video" },
              { label: "排程管理", icon: Calendar, href: "/schedule" },
              { label: "系統設定", icon: Settings, href: "#" },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <action.icon className="w-6 h-6 text-primary" />
                <span className="text-sm font-medium text-foreground">{action.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-2xl p-6 shadow-card animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">最近活動</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/50"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <activity.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 p-4 rounded-xl bg-secondary/30 border border-border animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm">系統狀態：正常運作</span>
            <span className="ml-auto text-xs">app-panel v1.0.0</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}
