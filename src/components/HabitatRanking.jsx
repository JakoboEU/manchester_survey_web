import React, { useState, useEffect }  from "react";
import { supabase } from "../lib/supabaseClient";
import HabitatImage from "./HabitatImage.jsx";
import "./HabitatRanking.css"

function HabitatRanking({personId}) {
    const HOLDING_IMAGE = "./images/holding.png"
    const [error, setError] = useState(null);
    const [rankHabitat, setRankHabitat] = useState(null);
    const [loading, setLoading] = useState(true);

    const [habitatImage1, setHabitatImage1] = useState(HOLDING_IMAGE);
    const [habitatImage2, setHabitatImage2] = useState(HOLDING_IMAGE);
    const [question, setQuestion] = useState('');

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

            setRankHabitat({ nextQuestion, nextHabitat1, nextHabitat2 });
        } catch (err) {
            setError(err?.message ?? "Unknown error");
            setRankHabitat(null);
        }
    }

    useEffect(() => {
        loadNextPair( { personId });
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
                    setQuestion('Click the image that looks like it would support more wildlife (birds, pollinators, plants):')
                    break;
                case 'safety':
                    setQuestion('Click the image where you’d feel more comfortable walking — even at dusk:')
                    break;
                case 'living':
                    setQuestion('Click the image that would make you more likely to buy a home nearby:')
                    break;
                default:
                    setQuestion('')
                    setError(`Invalid question key ${rankHabitat.nextQuestion}`)
            }
            setLoading(false)
        }
    }, [rankHabitat]);

    function handleImageClick(personId, habitatWinner, habitatLoser) {
        if (!loading) {
            setLoading(true)
            setHabitatImage1(HOLDING_IMAGE)
            setHabitatImage2(HOLDING_IMAGE)
            setQuestion('')
            loadNextPair({personId, battle: {habitatWinner: habitatWinner, habitatLoser: habitatLoser}});
        }
    }

    return (
        <div className="habitat-ranking card-body p-4">
            <h1 className="h4 mb-3 text-center">City Nature Choices</h1>
            {error ? (
                <div className="alert alert-danger">
                    {error}
                </div>
            ) : (
                <>
                    <div className="habitat-ranking-question-container">
                        <p className="habitat-ranking-question mb-4">
                            {question}
                        </p>
                    </div>
                    <HabitatImage
                        src={habitatImage1}
                        habitatWinner={rankHabitat? rankHabitat.nextHabitat1 : null}
                        habitatLoser={rankHabitat? rankHabitat.nextHabitat2 : null}
                        personId={personId}
                        onClick={handleImageClick}
                    />
                    <hr />
                    <HabitatImage
                        src={habitatImage2}
                        habitatWinner={rankHabitat? rankHabitat.nextHabitat2 : null}
                        habitatLoser={rankHabitat? rankHabitat.nextHabitat1 : null}
                        personId={personId}
                        onClick={handleImageClick}
                    />
                </>
            )}
        </div>
    )
}

export default HabitatRanking;