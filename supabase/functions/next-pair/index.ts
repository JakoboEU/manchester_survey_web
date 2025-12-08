import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "jsr:@supabase/supabase-js";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type HabitatRank = {
    habitatWinner: number;
    habitatLoser: number;
}

type Body = {
    personId: string;
    battle?: HabitatRank;
}

type NextResponse = {
    nextQuestion: string;
    nextHabitat1: number;
    nextHabitat2: number;
}

function isBody(value: unknown): value is Body {
    if (typeof value !== "object" || value === null) return false;
    const v = value as { personId?: unknown };
    return typeof v.personId === "string" && v.personId.trim().length > 0;
}

/*
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/next-pair' --header 'Content-Type: application/json' --data '{"personId":"123"}'
 */
Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }
    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405,
            headers: corsHeaders,
        });
    }

    let json: Body;

    try {
        json = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid JSON body" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    if (!isBody(json)) {
        return new Response(
            JSON.stringify({ error: "personId is required" }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: req.headers.get('Authorization')!,
            },
        },
    })

    const { data: personExists, error: fetchPersonError } = await supabase
        .from('person')
        .select('person_id')
        .eq('person_id', json.personId)
        .maybeSingle()

    if (fetchPersonError) {
        throw fetchPersonError
    }

    if (!personExists) {
        return new Response(
            JSON.stringify({ error: `Person ${json.personId} does not exist` }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const questions = ['biodiversity', 'safety', 'living']
    const randomQuestionIndex = Math.floor(Math.random() * questions.length);

    const habitats = [0,1,2,3,4,5,6,7,8]
    const randomHabitatIndex1 = Math.floor(Math.random() * habitats.length);
    let randomHabitatIndex2 = null

    do {
        randomHabitatIndex2 = Math.floor(Math.random() * habitats.length);
    } while (randomHabitatIndex1 === randomHabitatIndex2);

    const response : NextResponse = {
        nextQuestion: questions[randomQuestionIndex],
        nextHabitat1: habitats[randomHabitatIndex1],
        nextHabitat2: habitats[randomHabitatIndex2],
    }

    return new Response(
        JSON.stringify(response),
        { headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
        }},
    )
})

