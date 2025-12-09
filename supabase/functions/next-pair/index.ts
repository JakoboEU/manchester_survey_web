/* global Deno */
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import {createClient} from "jsr:@supabase/supabase-js";

const allowedOrigins = [
    "https://citynaturechoices.org",
    "https://www.citynaturechoices.org",
    "http://localhost:5173",
];

export function makeCommonHeaders(request) {
    const origin = request.headers.get("Origin");
    const safeOrigin =
        origin && allowedOrigins.includes(origin)
            ? origin
            : "https://citynaturechoices.org"; // sensible default / fallback

    return {
        "Access-Control-Allow-Origin": safeOrigin,
        "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Vary": "Origin",
        "Content-Type": "application/json",
    };
}

type HabitatRank = {
    question: string
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

type DatabaseResponse = {
    question_id: string;
    habitat1_id: number;
    habitat2_id: number;
}

function isBody(value: unknown): value is Body {
    if (typeof value !== "object" || value === null) return false;
    const v = value as { personId?: unknown };
    return typeof v.personId === "string" && v.personId.trim().length > 0;
}

const K = 24
/*
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/next-pair' --header 'Content-Type: application/json' --data '{"personId":"123"}'
 */
Deno.serve(async (req) => {
    const commonHeaders = makeCommonHeaders(req);
    if (req.method === "OPTIONS") {
        return new Response("ok", {headers: commonHeaders});
    }
    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405,
            headers: commonHeaders,
        });
    }

    let json: Body;

    try {
        json = await req.json();
    } catch {
        return new Response(
            JSON.stringify({error: "Invalid JSON body"}),
            {
                status: 400,
                headers: commonHeaders,
            }
        );
    }

    if (!isBody(json)) {
        return new Response(
            JSON.stringify({error: "personId is required"}),
            {
                status: 400,
                headers: commonHeaders,
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

    const {data: personExists, error: fetchPersonError} = await supabase
        .from('person')
        .select('person_id')
        .eq('person_id', json.personId)
        .maybeSingle()

    if (fetchPersonError) {
        throw fetchPersonError
    }

    if (!personExists) {
        return new Response(
            JSON.stringify({error: `Person ${json.personId} does not exist`}),
            {
                status: 401,
                headers: commonHeaders,
            }
        );
    }

    if (json.battle) {
        const {error} = await supabase.rpc("apply_habitat_elo_rpc", {
            p_person_id: json.personId,
            p_question_id: json.battle.question,
            p_winner_id: json.battle.habitatWinner,
            p_loser_id: json.battle.habitatLoser,
            p_k: K,
        });
        if (error) return new Response(JSON.stringify({ok: false, error: error.message}), {
            status: 500,
            headers: commonHeaders,
        });
    }

    const {data, error} = await supabase.rpc("next_pair_for_person", {
        p_person_id: json.personId,
    });

    if (error) return new Response(JSON.stringify({ok: false, error: error.message}), {
        status: 500,
        headers: commonHeaders
    });

    const response: NextResponse = Math.random() < 0.5
        ? {
            nextQuestion: data[0].question_id,
            nextHabitat1: data[0].habitat1_id,
            nextHabitat2: data[0].habitat2_id,
        }
        : {
            nextQuestion: data[0].question_id,
            nextHabitat1: data[0].habitat2_id,
            nextHabitat2: data[0].habitat1_id,
        };
    console.log(data);
    console.log(response);

    return new Response(
        JSON.stringify(response), { headers: commonHeaders},
    )
})

