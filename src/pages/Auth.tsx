import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().email({ message: "請輸入有效的電子郵件地址" });
const passwordSchema = z.string().min(6, { message: "密碼至少需要6個字元" });

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = (): boolean => {
    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return false;
      }
    }

    try {
      passwordSchema.parse(password);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return false;
      }
    }

    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("電子郵件或密碼錯誤");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("登入成功！");
      } else {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        
        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("此電子郵件已被註冊");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("註冊成功！請登入。");
        setIsLogin(true);
      }
    } catch (error) {
      toast.error("發生錯誤，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">
            {isLogin ? "登入" : "註冊"}
          </CardTitle>
          <CardDescription>
            {isLogin ? "登入以使用發文功能" : "建立新帳號"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">電子郵件</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密碼</Label>
              <Input
                id="password"
                type="password"
                placeholder="至少6個字元"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "處理中..." : isLogin ? "登入" : "註冊"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground underline"
              disabled={loading}
            >
              {isLogin ? "還沒有帳號？點此註冊" : "已有帳號？點此登入"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
