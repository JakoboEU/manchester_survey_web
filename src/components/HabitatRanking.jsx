import React, { useState, useEffect }  from "react";
import { supabase } from "../lib/supabaseClient";

function HabitatRanking({personId}) {

    const [error, setError] = useState(null);
    const [rankHabitat, setRankHabitat] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadNextPair(pairSubmission) {
            setLoading(true);
            setError(null);

            try {
                const { data, error } = await supabase.functions.invoke("next-pair", {
                    body: pairSubmission,
                });

                if (error) {
                    throw error;
                }

                const { nextQuestion, nextHabitat1, nextHabitat2 } = data ?? {};

                if (!nextQuestion || !nextHabitat1 || !nextHabitat2) {
                    throw new Error(`Missing variables for next pair ${JSON.stringify(data)}`);
                }

                if (!cancelled) {
                    setRankHabitat({ nextQuestion, nextHabitat1, nextHabitat2 });
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.message ?? "Unknown error");
                    setRankHabitat(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadNextPair( { personId });

        return () => {
            cancelled = true;
        };
    }, [personId]);

    return (
        <div className="habitat-ranking card-body p-4">
            <h1 className="h4 mb-3 text-center">City Nature Choices</h1>
            {error ? (
                <div className="alert alert-danger">
                    {error}
                </div>
            ) : (
                <>
                    <p className="mb-4">
                        Click the photo in which space seems like it would support more kinds of wildlife
                        (birds, pollinators, plants)?
                    </p>

                    <img
                        alt="Habitat image to compare A"
                        className="habitat-ranking card-img"
                        src="./images/habitat/1/1.jpg"
                    />
                    <hr />
                    <img
                        alt="Habitat image to compare B"
                        className="habitat-ranking card-img"
                        src="./images/habitat/2/1.jpg"
                    />
                </>
            )}
        </div>
    )
}

export default HabitatRanking;