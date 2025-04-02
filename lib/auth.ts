
import { supabase } from "./supabaseclient";

export const signIn = async (email: string, password: string, router: any) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Invalid email or password.");
    } else if (error.message.includes("Email not confirmed")) {
      throw new Error("Please verify your email before logging in.");
    } else {
      throw new Error("Login failed. Please try again later.");
    }
  }

  router.push("/home"); // Redirect after login
};

export const signUp = async (email: string, password: string) => {
  if (!email || !password) {
    throw new Error("Email and password are required.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.includes("User already registered")) {
      throw new Error("An account with this email already exists.");
    } else {
      throw new Error("Signup failed. Please try again.");
    }
  }
};

  

  export const signOut = async (router:any) => {
    await supabase.auth.signOut();
    router.push("/"); // Redirect to login after logout
  };
  

  
  export const signInWithGoogle = async () => {
    const {  error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/home`, // Redirect to dashboard after login
      },
    });
  
    if (error) throw error;
  };
  export const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };
  