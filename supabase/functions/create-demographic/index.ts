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

type Demographics = {
    gender: string,
    age: string,
    ethnicity: string,
    income: string,
    education: string,
    movement: string,
    dog: string,
    children: string,
    garden: string,
}

function serverError(message) {
    return new Response(
        JSON.stringify({ error: message }),
        {
            status: 500,
            headers: { "Content-Type": "application/json" },
        }
    );
}

Deno.serve(async (req) => {
    const commonHeaders = makeCommonHeaders(req)
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: commonHeaders });
    }
    if (req.method !== "POST") {
        return new Response("Method not allowed", {
            status: 405,
            headers: commonHeaders,
        });
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

    let sentDemographics: Demographics;

    try {
        sentDemographics = await req.json();
    } catch {
        return new Response(
            JSON.stringify({ error: "Invalid JSON body" }),
            {
                status: 400,
                headers: commonHeaders,
            }
        );
    }

    const personId = crypto.randomUUID();

    const demographics = [
        {demographic: 'global', demographic_value: 'global', person_id: personId},
        {demographic: 'gender', demographic_value: sentDemographics.gender, person_id: personId},
        {demographic: 'age', demographic_value: sentDemographics.age, person_id: personId},
        {demographic: 'ethnicity', demographic_value: sentDemographics.ethnicity, person_id: personId},
        {demographic: 'education', demographic_value: sentDemographics.education, person_id: personId},
        {demographic: 'income', demographic_value: sentDemographics.income, person_id: personId},
        {demographic: 'movement', demographic_value: sentDemographics.movement, person_id: personId},
        {demographic: 'dog', demographic_value: sentDemographics.dog, person_id: personId},
        {demographic: 'children', demographic_value: sentDemographics.children, person_id: personId},
        {demographic: 'garden', demographic_value: sentDemographics.garden, person_id: personId},
    ].filter((obj) => obj.demographic_value != 'not-selected');

    const { error: insertPersonError } = await supabase.from('person')
        .insert({person_id: personId})
        .select()
        .single()

    if (insertPersonError) {
        return serverError(insertPersonError);
    } else {
        const {error: insertDemographicsError} = await supabase.from('person_demographics')
            .insert(demographics)

        if (insertDemographicsError) {
            return serverError(insertDemographicsError);
        } else {
            return new Response(
                JSON.stringify({personId: personId}),
                { headers: commonHeaders},
            )
        }
    }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-demographic' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"gender":"male"}'

*/
