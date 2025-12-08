import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_REMOTE_URL;
const supabaseAnonKey = import.meta.env.VITE_REMOTE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInAnonymously = function(captchaToken) {
    const { data, error } = supabase.auth.signInAnonymously({
        options: { captchaToken }
    })
}
