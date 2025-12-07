import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Calendar, RefreshCw, ExternalLink, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SheetRow {
  id: number;
  imageUrl: string;
  authorized: string;
  status: string;
  publishDate: string;
}

export default function Schedule() {
  const [data, setData] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('fetch-google-sheet');
      
      if (error) {
        throw error;
      }

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result.data || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "載入失敗",
        description: error.message || "無法載入排程資料",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('已刊出') || lowerStatus.includes('完成') || lowerStatus.includes('done')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-success/20 text-success">
          <Check className="w-3 h-3" />
          {status}
        </span>
      );
    }
    if (lowerStatus.includes('待') || lowerStatus.includes('pending')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning">
          <Clock className="w-3 h-3" />
          {status}
        </span>
      );
    }
    if (lowerStatus.includes('取消') || lowerStatus.includes('cancel') || lowerStatus.includes('否')) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-destructive/20 text-destructive">
          <X className="w-3 h-3" />
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
        {status || '-'}
      </span>
    );
  };

  const getAuthorizedBadge = (authorized: string) => {
    const lower = authorized.toLowerCase();
    if (lower === '是' || lower === 'yes' || lower === 'true' || lower === '已授權') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-success/20 text-success">
          <Check className="w-3 h-3" />
          已授權
        </span>
      );
    }
    if (lower === '否' || lower === 'no' || lower === 'false') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-destructive/20 text-destructive">
          <X className="w-3 h-3" />
          未授權
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-secondary text-muted-foreground">
        {authorized || '-'}
      </span>
    );
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">文案排程</h1>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              重新載入
            </Button>
          </div>
          <p className="text-muted-foreground">從 Google Sheet 同步的發佈排程資料</p>
        </div>

        {/* Data Table */}
        <div className="bg-card rounded-2xl shadow-card overflow-hidden animate-slide-up">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <RefreshCw className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">暫無排程資料</p>
              <p className="text-muted-foreground">Google Sheet 中沒有找到資料</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">縮圖</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">受權刊出</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">刊登情況</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">刊出日期</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr 
                      key={row.id} 
                      className={`border-b border-border/50 hover:bg-secondary/30 transition-colors ${
                        index % 2 === 0 ? 'bg-card' : 'bg-secondary/10'
                      }`}
                    >
                      <td className="px-4 py-3">
                        {row.imageUrl ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                              <img 
                                src={row.imageUrl} 
                                alt="縮圖"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <a 
                              href={row.imageUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {getAuthorizedBadge(row.authorized)}
                      </td>
                      <td className="px-4 py-3">
                        {getStatusBadge(row.status)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-foreground">
                          {row.publishDate || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {!loading && data.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-sm text-muted-foreground">總數</p>
              <p className="text-2xl font-bold text-foreground">{data.length}</p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-sm text-muted-foreground">已授權</p>
              <p className="text-2xl font-bold text-success">
                {data.filter(d => ['是', 'yes', 'true', '已授權'].includes(d.authorized.toLowerCase())).length}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-sm text-muted-foreground">已刊出</p>
              <p className="text-2xl font-bold text-primary">
                {data.filter(d => d.status.toLowerCase().includes('已刊出') || d.status.toLowerCase().includes('完成')).length}
              </p>
            </div>
            <div className="bg-card rounded-xl p-4 shadow-card">
              <p className="text-sm text-muted-foreground">待刊出</p>
              <p className="text-2xl font-bold text-warning">
                {data.filter(d => d.status.toLowerCase().includes('待')).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
