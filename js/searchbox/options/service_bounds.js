import PUBMED_DOCTYPES_OPTIONS from "./doctypes_pubmed.js";
import DOCTYPES_OPTIONS from "./doctypes.js";

export const getServiceBounds = (
    service,
) => {
    switch (service) {
        case "base": {
            return DOCTYPES_OPTIONS[0].id;
        }

        case "pubmed": {
            const pubMedDefaultId = []
            PUBMED_DOCTYPES_OPTIONS.forEach((option) => {
                if (option.id !== 'retracted publication') {
                    pubMedDefaultId.push(option.id)
                }
            });
            return pubMedDefaultId;
        }
        default:
            return DOCTYPES_OPTIONS[0].id;
    }
};
