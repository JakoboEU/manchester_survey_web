import HabitatImage from "./HabitatImage.jsx";
import "./HabitatRankingPanel.css"

function HabitatRankingPanel({error, question, rankHabitat, habitatImage1, habitatImage2, handleImageClick, personId}) {
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

    export default HabitatRankingPanel;