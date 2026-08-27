 /*
     Visitor Counter Application, 08/11/2026, EPastore

     Expected Cloud Run API contract:
       POST {API_BASE_URL}/increment
       Header: x-api-key: <API_KEY>
       Response 200: { "count": <integer> }

     The Cloud Run function is expected to increment the visitor
     row in Cloud SQL and return the new total in a single call.
*/

const API_BASE_URL = "https://<cloud_run_url>";

const API_KEY = "<public_key>";

// Function to count visitor hits by writing visitor counts to and from an API, EPastore 08/11/2026
async function countHits()
{
    try
    {
        const response = await fetch(`${'https://cloud-resume-backend-171016874981.us-east4.run.app'}/increment`,
        {
            method: "POST",
            headers:
            {
                "x-api-key": API_KEY
            }
        });

        if(!response.ok)
        {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        document.getElementById("count").innerText = data.count;
    } catch(error)
    {
        console.error("Unable to load visitor count:", error);
        document.getElementById("count").innerText = "N/A";
    }
}

window.addEventListener("load",countHits);