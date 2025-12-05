import React from "react";
import "./HabitatImage.css"

function HabitatImage({onClick, personId, habitatWinner, habitatLoser, src}) {

    function handleClick() {
        onClick(personId, habitatWinner, habitatLoser);
    }

    return (
        <div className="habitat-image-container">
            <a onClick={handleClick}>
                <img
                    alt={"Habitat image to compare " + habitatWinner}
                    className="habitat-image card-img img-fluid"
                    src={src}
                    width={480}
                    height={360}
                />
            </a>
        </div>
    )
}

export default HabitatImage;