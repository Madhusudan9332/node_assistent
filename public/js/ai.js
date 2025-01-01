async function callInit() {
    try {
        const response = await fetch("/api/init", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Init response:", data);
    } catch (error) {
        console.error("Error in init:", error);
    }
}

async function getResponse(input) {
    try {
        const response = await fetch("/api/response", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input }), // Pass the input as needed
        });
        let data = await response.json();
        data = data.replace("\n\nCopy\nSearch Web\nSummarize\nDelete", "");
        return data;
    } catch (error) {
        return "err in response"
        console.error("Error getting response:", error);
    }
}

async function createNewPage(pageDetails) {
    try {
        const response = await fetch("/api/newPage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pageDetails),
        });
        const data = await response.json();
        console.log("New page created:", data);
    } catch (error) {
        console.error("Error creating new page:", error);
    }
}

async function closeSession() {
    try {
        const response = await fetch("/api/close", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log("Close session response:", data);
    } catch (error) {
        console.error("Error closing session:", error);
    }
}

async function fetchTempResponse() {
    try {
        const response = await fetch("/api/tempResponse");
        const data = await response.json();
        console.log("Temp response:", data);
    } catch (error) {
        console.error("Error fetching tempResponse:", error);
    }
}

