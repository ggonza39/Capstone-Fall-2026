/* Represents paragraphs that will eventually be stored in a database when backend is implemented.
* Used for informational content updates through admin view 
* Note: IDs must match in database for production handover. For example, id of hero paragraph on landing page must be landing-hero
*/
export const landingPageParagraphs = [
    {
        id: "landing-hero",
        content: "TechSmart Learning for Seniors is a non-profit organization committed to teaching older adults the latest tools and technology to help them lead active lives."
    }
];

export const impactComponentParagraphs = [
    {
        id: "impact-main",
        content: "Since 2012, TechSmart Learning for Seniors has educated more than 7,000 older adults across metro Atlanta."
    },
    {
        id: "impact-secondary",
        content: "Through technology education, volunteers, donations, and community partnerships, TechSmart helps older adults build digital skills, gain confidence, and stay connected." 
    }
];