import React, { useState }  from "react";
import { supabase } from "../lib/supabaseClient";

function HabitatRanking({personId}) {

    const [rankHabitat, setRankHabitat] = useState(() => {
        const {data} = supabase.functions.invoke("next-pair", {body: {personId: personId}});
        return JSON.parse(data)
    });
    return (
        <div className="habitat-ranking card-body p-4">
            <h1 className="h4 mb-3 text-center">City Nature Choices</h1>
            <p className="mb-4">
                Click the photo in which space seems like it would support more kinds of wildlife (birds, pollinators, plants)?
            </p>
            <img alt="Habitat image to compare" className="habitat-ranking card-img" src="./images/habitat/1/1.jpg" />
            <hr />
            <img alt="Habitat image to compare"  className="habitat-ranking card-img" src="./images/habitat/2/1.jpg" />
        </div>
    )
}

export default HabitatRanking;