import "jsr:@supabase/functions-js/edge-runtime.d.ts"

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
    let json: unknown;

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

    const response : NextResponse = {
        nextQuestion: '',
        nextHabitat1: 1,
        nextHabitat2: 2
    }

    return new Response(
        JSON.stringify(response),
        { headers: { "Content-Type": "application/json" } },
    )
})

