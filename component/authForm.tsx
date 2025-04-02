"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signIn, signInWithGoogle, signUp } from "@/lib/auth";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";


export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
  
    try {
      if (isLogin) {
        await signIn(email, password, router);
        toast.success("Login successful!");
      } else {
        await signUp(email, password);
        toast.success("Signup successful! Please check your email to confirm your account before logging in.");
        setIsLogin(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast.error(err.message);
      } else {
        setError("An unknown error occurred.");
        toast.error("An unknown error occurred.");
      }
    }
  };
  


  return (
    <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
    <div className="min-h-screen flex items-center justify-center  p-4 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-purple-300/20 to-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-tr from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"></div>
      </div>
      <div className="w-full max-w-[420px] space-y-6">
      <div className="flex justify-center">
          <div className=" h-[60px] rounded-md flex items-center justify-center animate-fade-in">
            {/* <Image
              src="/logo.svg"
              alt="Logo"
              width={200}
              height={200}
              priority
            /> */}
            <div className="flex text-2xl">

            Screen Generator
            </div>
          </div>
        </div>
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden animate-slide-up">
        {/* <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div> */}
        <CardHeader className="space-y-2 text-center pb-2 text-3xl font-medium">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit}    className="space-y-4"
              suppressHydrationWarning>
      <div className="space-y-2">
                <Label
                 
                  className="text-sm font-medium text-[#1D2939]"
                >
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary/70 transition-colors duration-300">
                    <Mail className="h-5 w-5" />
                    </div>
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required   className="h-12 pl-10 pr-4 rounded-xl transition-all duration-300 border-slate-200 bg-white/50 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary/40 focus-visible:border-primary group-hover:border-primary/50"/>
        </div>
        </div>
        <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label

                    className="text-sm font-medium text-[#1D2939]"
                  >
                    Password
                  </Label>
                </div>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-primary/70 transition-colors duration-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input 
  type={showPassword ? "text" : "password"}  // Change based on state
  className="h-12 pl-10 pr-12 rounded-xl transition-all duration-300 border-slate-200 bg-white/50 focus-visible:ring-2 focus-visible:ring-offset-0 focus-visible:ring-primary/40 focus-visible:border-primary group-hover:border-primary/50"
  placeholder="Password" 
  value={password} 
  onChange={(e) => setPassword(e.target.value)} 
  required 
/>
        <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors duration-300"
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  </div>
                  </div>
        <button type="submit"   className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px]">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
    
      <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Or continue with</span>
            </div>
          </div>

          <Button
  variant="outline"
  className="w-full border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 py-3"
  onClick={signInWithGoogle}
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
    <path d="M1 1h22v22H1z" fill="none" />
  </svg>
  <span className="text-gray-700 font-medium">Sign in with Google</span>
</Button>

          <CardFooter className="flex flex-col  border-t border-gray-50 bg-gray-50/50">
          <Button
            variant="link"
            className="w-full text-gray-600 hover:text-gray-900"
            onClick={() => setIsLogin(!isLogin)}
            // disabled={isLoading}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </Button>
        </CardFooter>
        </CardContent>
    
 
    </Card>
    </div>
    </div>
    </div>
  );
}
