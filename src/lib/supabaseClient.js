import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_REMOTE_URL;
const supabaseAnonKey = import.meta.env.VITE_REMOTE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signInAnonymously = async function(captchaToken) {
    const { data, error } =  await supabase.auth.signInAnonymously({
        options: { captchaToken }
    })

    if (error) {
        throw error;
    }

    const accessToken = data.session.access_token;

    if (!accessToken) {
        throw Error("Response missing accessToken");
    }

    return accessToken;
}

function mapSupabaseError(error, response, fallbackMessage) {
    if (!error) return {message: '', status: 200, ok: true}

    const status = response.status
    const rawMessage = error.message || response.statusText

    if (rawMessage.includes('row-level security')) {
        return {
            message: 'You do not have permission to perform this action.',
            status,
            ok: false
        }
    }

    if (status === 429) {
        return {
            message: 'Too many requests. Please wait a moment and try again.',
            status,
            ok: false
        }
    }

    if (status === 401) {
        return {
            message: 'The user you provided is not valid. Please clear page data and refresh page.',
            status,
            ok: false
        }
    }

    if (status === 400 && rawMessage.toLowerCase().includes('invalid jwt')) {
        return {
            message: 'Your session has expired. Please refresh the page and try again.',
            status,
            ok: false
        }
    }

    if (status === 400 && rawMessage.toLowerCase().includes('captcha')) {
        return {
            message: 'Captcha verification failed. Please try solving it again.',
            status,
            ok: false
        }
    }

    const safeMessage =
        rawMessage && rawMessage.length < 160
            ? rawMessage
            : fallbackMessage

    return {
        message: safeMessage,
        status,
        ok: false
    }
}

export function useSupabaseError() {

    function wrapResult(result, fallbackMessage) {
        const {data, error, response} = result;
        return mapSupabaseError(error, response, fallbackMessage)
    }

    return {
        wrapResult,
    }
}