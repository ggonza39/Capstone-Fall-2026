/**
 * Static mock workshop data used by the Mock Service Layer (PBI-4 AC-3).
 *
 * Field values are illustrative only. Shapes match src/types/api.ts
 * (WorkshopSummary / WorkshopDetail), which are themselves limited to fields
 * documented in documentation/milestones/Milestone-2.md (PBI-7, PBI-8).
 */

/** @type {import('../../types/api').WorkshopDetail[]} */
export const workshops = [
    {
        id: "WS-1001",
        title: "Smartphone Basics for Beginners",
        dateTime: "2026-10-04T10:00:00-04:00",
        location: "Marietta Senior Center, 123 Main St, Marietta, GA",
        roomNumber: "Room 2",
        instructorName: "John Carter",
        accessibilityFeatures: ["Wheelchair accessible", "Large-print handouts"],
        seatAvailability: 8,
    },
    {
        id: "WS-1002",
        title: "Staying Safe Online: Spotting Scams",
        dateTime: "2026-10-11T13:30:00-04:00",
        location: "Atlanta Community Library, 456 Peachtree St, Atlanta, GA",
        roomNumber: "Meeting Room B",
        instructorName: "Priya Nandakumar",
        accessibilityFeatures: ["Wheelchair accessible", "Hearing loop available"],
        seatAvailability: 0,
    },
    {
        id: "WS-1003",
        title: "Video Calling with Family (Virtual Session)",
        dateTime: "2026-10-18T11:00:00-04:00",
        location: "Online",
        roomNumber: "N/A",
        instructorName: "David Lee",
        accessibilityFeatures: ["Live captioning available"],
        seatAvailability: 20,
    },
];

/**
 * Reduces a WorkshopDetail record to the smaller WorkshopSummary shape
 * used by the search results endpoint, plus search-only fields that are
 * not part of the detail record (address/distance/eventType).
 */
export const workshopSummaries = [
    {
        ...toSummaryBase(workshops[0]),
        address: "123 Main St, Marietta, GA",
        distanceMiles: 3.2,
        eventType: "In-Person",
    },
    {
        ...toSummaryBase(workshops[1]),
        address: "456 Peachtree St, Atlanta, GA",
        distanceMiles: 12.7,
        eventType: "In-Person",
    },
    {
        ...toSummaryBase(workshops[2]),
        address: "Online",
        distanceMiles: 0,
        eventType: "Virtual",
    },
];

function toSummaryBase(workshop) {
    const [date, time] = workshop.dateTime.split("T");
    return {
        id: workshop.id,
        title: workshop.title,
        date,
        time: time ? time.slice(0, 5) : "",
    };
}
