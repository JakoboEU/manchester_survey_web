import React from "react";
import "./PageShimmer.css";

export default function PageShimmer() {
    return (
        <div className="page-shimmer-overlay" aria-hidden="true">
            <div className="page-shimmer-layer" />
        </div>
    );
}
