import React from "react";

function HabitatImage({onClick, personId, habitatWinner, habitatLoser, src}) {

    function handleClick() {
        onClick(personId, habitatWinner, habitatLoser);
    }

    return (
        <a onClick={handleClick}>
            <img
                alt={"Habitat image to compare " + habitatWinner}
                className="habitat-ranking card-img"
                src={src}
                width="480px"
                height="360px"
            />
        </a>
    )
}

export default HabitatImage;