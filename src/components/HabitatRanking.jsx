import React, { useState, useEffect }  from "react";
import { supabase } from "../lib/supabaseClient";

function HabitatRanking({personId}) {
    const HOLDING_IMAGE = "./images/holding.png"
    const [error, setError] = useState(null);
    const [rankHabitat, setRankHabitat] = useState(null);

    const [habitatImage1, setHabitatImage1] = useState(HOLDING_IMAGE);
    const [habitatImage2, setHabitatImage2] = useState(HOLDING_IMAGE);
    const [question, setQuestion] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadNextPair(pairSubmission) {
            setError(null);

            try {
                const { data, error } = await supabase.functions.invoke("next-pair", {
                    body: pairSubmission,
                });

                if (error) {
                    throw error;
                }

                const { nextQuestion, nextHabitat1, nextHabitat2 } = data ?? {};

                if (!nextQuestion) {
                    throw new Error(`Missing question for next pair ${JSON.stringify(data)}`);
                }
                if (isNaN(+nextHabitat1) || isNaN(+nextHabitat1)) {
                    throw new Error(`Missing habitat for next pair ${JSON.stringify(data)}`);
                }

                if (!cancelled) {
                    setRankHabitat({ nextQuestion, nextHabitat1, nextHabitat2 });
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.message ?? "Unknown error");
                    setRankHabitat(null);
                }
            }
        }

        loadNextPair( { personId });

        return () => {
            cancelled = true;
        };
    }, [personId]);

    function imageUrl(clusterId) {
        const images = [1,2,3,4,5,6,7,8,9,10]
        const randomImageIndex = Math.floor(Math.random() * images.length);
        return `./images/habitat/${clusterId}/${images[randomImageIndex]}.jpg`
    }

    useEffect(() => {
        if (rankHabitat) {
            setHabitatImage1(imageUrl(rankHabitat.nextHabitat1))
            setHabitatImage2(imageUrl(rankHabitat.nextHabitat2))

            switch (rankHabitat.nextQuestion) {
                case 'biodiversity':
                    setQuestion('Click on the image showing habitat that seems like it would support more kinds of wildlife (birds, pollinators, plants):')
                    break;
                case 'safety':
                    setQuestion('Click on the image containing space would you feel safer spending time in—including at dusk:')
                    break;
                case 'living':
                    setQuestion('Click on the image which would make you more likely to buy a home in the area:')
                    break;
                default:
                    setQuestion('')
                    setError(`Invalid question key ${rankHabitat.nextQuestion}`)
            }
        }
    }, [rankHabitat]);

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
                        {question}
                    </p>

                    <img
                        alt="Habitat image to compare A"
                        className="habitat-ranking card-img"
                        src={habitatImage1}
                    />
                    <hr />
                    <img
                        alt="Habitat image to compare B"
                        className="habitat-ranking card-img"
                        src={habitatImage2}
                    />
                </>
            )}
        </div>
    )
}

export default HabitatRanking;