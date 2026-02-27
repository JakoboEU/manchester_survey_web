const Affiliate = Object.freeze({
    NONE: "none",
    SURVEYSWAP: "surveyswap",
});

export function parseAffiliateFromSearch(search) {
    const params = new URLSearchParams(search ?? "");
    const rawAffiliate = params.get("aff");

    if (!rawAffiliate) {
        return Affiliate.NONE;
    }

    const normalized = rawAffiliate.trim().toLowerCase();

    if (!normalized) {
        return Affiliate.NONE;
    }

    if (normalized === Affiliate.SURVEYSWAP) {
        return Affiliate.SURVEYSWAP;
    }

    return Affiliate.NONE;
}

export { Affiliate };

