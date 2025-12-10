import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ArrowLeft, Calendar, ExternalLink, Instagram, Facebook, Youtube, MapPin, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface SheetRow {
  id: number;
  rowIndex: number;
  imageUrl: string;
  authorized: string;
  status: string;
  publishDate: string;
  source: string;
  ig: string;
  fb: string;
  yt: string;
  content: string;
  aiContent: string;
  location: string;
}

export default function ScheduleEdit() {
  const { loading: authLoading } = useAuth(true); // Require authentication
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<SheetRow | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: result, error } = await supabase.functions.invoke('fetch-google-sheet');
        
        if (error) throw error;
        if (result.error) throw new Error(result.error);

        const row = result.data?.find((r: SheetRow) => r.id === parseInt(id || '0'));
        if (row) {
          setData(row);
        } else {
          toast({
            title: "找不到資料",
            description: "無法找到指定的排程項目",
            variant: "destructive",
          });
          navigate('/schedule');
        }
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

    fetchData();
  }, [id, navigate, toast]);

  const isVideo = (url: string) => {
    return url.includes('video') || url.includes('.mp4') || url.includes('.mov') || url.includes('youtube') || url.includes('youtu.be');
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!data) {
    return (
      <Layout>
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          <p className="text-muted-foreground">找不到資料</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/schedule')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回排程
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">排程詳情</h1>
          </div>
        </div>

        <div className="grid gap-6 animate-slide-up">
          {/* Media Preview */}
          <div className="bg-card rounded-2xl shadow-card overflow-hidden">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">媒體預覽</h2>
            </div>
            <div className="p-4">
              {data.imageUrl ? (
                <div className="relative">
                  {isVideo(data.imageUrl) ? (
                    <video 
                      src={data.imageUrl} 
                      controls 
                      className="w-full max-h-[400px] object-contain rounded-lg bg-secondary"
                    />
                  ) : (
                    <img 
                      src={data.imageUrl} 
                      alt="媒體預覽"
                      className="w-full max-h-[400px] object-contain rounded-lg bg-secondary"
                    />
                  )}
                  <a 
                    href={data.imageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute top-2 right-2 p-2 bg-background/80 rounded-lg hover:bg-background transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="h-48 bg-secondary rounded-lg flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="bg-card rounded-2xl shadow-card p-4">
              <h2 className="font-semibold text-foreground mb-4">基本資訊</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">來源:</span>
                  <span className="text-sm text-foreground">{data.source || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">地點:</span>
                  <span className="text-sm text-foreground">{data.location || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">刊出日期:</span>
                  <span className="text-sm text-foreground">{data.publishDate || '-'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">授權狀態:</span>
                  <span className={`text-sm ${data.authorized === '是' ? 'text-success' : 'text-destructive'}`}>
                    {data.authorized || '-'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">刊登情況:</span>
                  <span className="text-sm text-foreground">{data.status || '-'}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card rounded-2xl shadow-card p-4">
              <h2 className="font-semibold text-foreground mb-4">社交平台連結</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span className="text-sm text-muted-foreground">IG:</span>
                  {data.ig ? (
                    <a href={data.ig} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                      {data.ig}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Facebook className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-muted-foreground">FB:</span>
                  {data.fb ? (
                    <a href={data.fb} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                      {data.fb}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span className="text-sm text-muted-foreground">YT:</span>
                  {data.yt ? (
                    <a href={data.yt} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                      {data.yt}
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {(data.content || data.aiContent) && (
            <div className="bg-card rounded-2xl shadow-card p-4">
              <h2 className="font-semibold text-foreground mb-4">內容</h2>
              {data.content && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">簡單內容:</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{data.content}</p>
                </div>
              )}
              {data.aiContent && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">AI 完整內容:</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{data.aiContent}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
