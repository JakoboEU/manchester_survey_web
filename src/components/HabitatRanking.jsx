import React, { useState, useEffect, useRef }  from "react";
import { supabase, useSupabaseError } from "../lib/supabaseClient";
import HabitatRankingPanel from "./HabitatRankingPanel.jsx";
import ContinueForm from "./ContinueForm.jsx"
import { Affiliate } from "../lib/affiliate.js";

function HabitatRanking({personId, accessToken, affiliate}) {
    const HOLDING_IMAGE = "./images/holding.png"
    const CLICKS_FOR_EARLY_MILESTONE_MESSAGE = 5
    const CLICKS_BETWEEN_MILESTONE_MESSAGES = 10

    const [error, setError] = useState(null);
    const [rankHabitat, setRankHabitat] = useState(null);
    const [milestoneMessage, setMilestoneMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    const [habitatImage1, setHabitatImage1] = useState(HOLDING_IMAGE);
    const [habitatImage2, setHabitatImage2] = useState(HOLDING_IMAGE);
    const [question, setQuestion] = useState('');
    const [questionId, setQuestionId] = useState('');
    const { wrapResult } = useSupabaseError()

    const numberOfRankingsCompleted = useRef(0);
    const numberOfMilestoneMessagesShown = useRef(0);

    const surveySwapMilestoneMessage = {
        title: "Survey Swap!",
        body: (
            <>
                <p>
                    The following code gives you Karma that can be used to get free research participants at SurveySwap.io.
                </p>
                <p>
                    Go to:
                    <a href="https://surveyswap.io/sr/QKW7-ZEU5-3S0R">https://surveyswap.io/sr/QKW7-ZEU5-3S0R</a>
                </p>
                <p>
                    Or, alternatively, enter the code manually:
                    <pre>QKW7-ZEU5-3S0R</pre>
                </p>
        </>)

     };

    const milestoneMessages = [
         {
           title: "How the ranking works",
           body: "This survey uses an Elo-style ranking algorithm (originally designed for chess). Each time you choose between two places, the scores update and you’re shown another close match-up — that helps the ordering settle quickly with fewer comparisons.",
         },
         {
           title: "Your answers are saved",
           body: "Your choice is stored after every click. There’s no fixed finish line — the ranking can continue indefinitely — so stop whenever you’ve had enough. Even a few minutes is genuinely useful.",
         },
         {
           title: "Quick tip: trust your instinct",
           body: "There’s no right or wrong answer — go with your first impression for each question. If a pair feels similar, pick the one you slightly prefer (or that best matches the specific question you’re answering).",
         },
         {
           title: "Share if you can",
           body: "If you’re happy to, sharing the survey helps us reach a wider range of people and neighbourhoods — which makes the results more representative and useful for planning decisions.",
         },
         ...(affiliate === Affiliate.SURVEYSWAP ? [surveySwapMilestoneMessage] : []),
         {
            title: "Why the images start to look similar",
            body: "If the pairs feel increasingly similar, that’s expected — it means the ranking is narrowing in and fine-tuning the order. At that point, stopping is totally fine.",
         },
         {
           title: "Three different lenses",
           body: "You’re answering three questions about safety, desirability, and biodiversity perceptions. It’s totally normal if your answers differ across these.",
         },
         {
           title: "Where these places come from",
           body: "All images come from 411 green patches randomly selected across Manchester. They were visited over 2 years and surveyed in the field for around 100 different bird, insect, and plant species.",
         },
         {
           title: "Habitat types",
           body: "Those 411 patches are grouped into 9 habitat types (e.g., parks, verges, woodland, scrub, and others). We’re testing how perceptions change across habitat types and what features seem to matter most.",
         },
         {
           title: "Why this matters",
           body: "These results help connect public perceptions (safety, desirability, biodiversity) with real ecological survey data. That evidence can support better greenspace design and management for both people and wildlife.",
         },
    ];

    async function loadNextPair(pairSubmission) {
        setError(null);

        try {
            const { data, error, response } = await supabase.functions.invoke("next-pair", {
                body: pairSubmission,
            });

            const { ok: pairSubmissionOkay, message: pairSubmissionError } = wrapResult(
                { data, error, response },
                'Failed to store demographic data.'
            )

            if (!pairSubmissionOkay) {
                throw new Error(pairSubmissionError)
            }

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
            setQuestionId(rankHabitat.nextQuestion)

            switch (rankHabitat.nextQuestion) {
                case 'biodiversity':
                    setQuestion('Click the image that looks like it would support more wildlife (birds, pollinators, plants):')
                    break;
                case 'safety':
                    setQuestion('Click the image of the city place where you’d feel more comfortable walking — even at dusk:')
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

    function getNextMilestoneMessage(numberOfClicks) {
        if (!Number.isFinite(numberOfClicks) || numberOfClicks <= 0) return null;

        const showMilestoneMessage =
            numberOfClicks === CLICKS_FOR_EARLY_MILESTONE_MESSAGE ||
            (numberOfClicks > CLICKS_FOR_EARLY_MILESTONE_MESSAGE && numberOfClicks % CLICKS_BETWEEN_MILESTONE_MESSAGES === 0);

        if (!showMilestoneMessage) {
            return null;
        }

        numberOfMilestoneMessagesShown.current += 1

        const idx = (numberOfMilestoneMessagesShown.current - 1) % milestoneMessages.length;
        return milestoneMessages[idx];
    }

    function handleImageClick(personId, habitatWinner, habitatLoser) {
        if (!loading) {
            setLoading(true)
            setHabitatImage1(HOLDING_IMAGE)
            setHabitatImage2(HOLDING_IMAGE)
            setQuestion('')

            numberOfRankingsCompleted.current += 1
            setMilestoneMessage(getNextMilestoneMessage(numberOfRankingsCompleted.current))

            loadNextPair({personId, battle: {habitatWinner: habitatWinner, habitatLoser: habitatLoser, question: questionId}});
        }
    }

    function continueRankingClick() {
        setMilestoneMessage(null)
    }

    if (milestoneMessage != null) {
        return (
            <ContinueForm
                captchaRequired = {false}
                onContinue = {continueRankingClick}
                title ={milestoneMessage.title}
                text = {milestoneMessage.body}
            />
        )
    } else {
        return (
            <HabitatRankingPanel
                error = {error}
                question = {question}
                rankHabitat = {rankHabitat}
                habitatImage1 = {habitatImage1}
                habitatImage2 = {habitatImage2}
                handleImageClick = {handleImageClick}
                personId = {personId}
            />
        )
    }
}

export default HabitatRanking;