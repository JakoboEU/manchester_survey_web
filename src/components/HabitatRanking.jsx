import React, { useState }  from "react";
import { supabase } from "../lib/supabaseClient";

function HabitatRanking({personId}) {

    const [error, setError] = useState(null);

    function parseNextPair(nextPair) {
        return nextPair.then(result => {
            const { data, error } = result;
            if (error) {
                setError(error)
            }
            const {nextQuestion, nextHabitat1, nextHabitat2} = data;
            if (!nextQuestion || !nextHabitat1 || !nextHabitat2) {
                setError(`Missing variables for next pair ${data}`)
            }
            setError(null);
            return {nextQuestion: nextQuestion, nextHabitat1: nextHabitat1, nextHabitat2: nextHabitat2}
        })
    }

    const [rankHabitat, setRankHabitat] = useState(() => {
        const nextPair = supabase.functions.invoke("next-pair", {body: {personId: personId}});
        return parseNextPair(nextPair);
    });

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