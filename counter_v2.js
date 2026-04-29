/*
    Visitor Counter Application, 03/01/2026, EPastore

    Prequisites: 
    - Build database to store visitor counts
    - Build API to handle communication between app and database
    - Write Python script for function to implement API

    Application Steps:

    PROGRAM SessionAwareVisitorCounter

      CONSTANT API_ENDPOINT = "<your-cloud-function-or-lambda-url>"
      CONSTANT SESSION_KEY  = "visitor_counted"

      ON PAGE LOAD:
        CALL handleVisit()

      FUNCTION handleVisit():
        alreadyCounted = READ sessionStorage value at key SESSION_KEY
          -- sessionStorage persists for the browser tab's lifetime only
          -- Cleared automatically when the tab is closed

        IF alreadyCounted is "true":
          -- This tab already triggered a count increment; just display current count
          CALL fetchAndDisplayCount(shouldIncrement = FALSE)
        ELSE:
          -- First visit in this session; increment, then record it
          CALL fetchAndDisplayCount(shouldIncrement = TRUE)
          WRITE "true" to sessionStorage at key SESSION_KEY

      FUNCTION fetchAndDisplayCount(shouldIncrement):
        TRY:
          IF shouldIncrement is TRUE:
            METHOD = "POST"   -- backend increments and returns new count
          ELSE:
            METHOD = "GET"    -- backend returns current count without changing it

          SEND HTTP request with METHOD to API_ENDPOINT
          AWAIT response

          IF response status is NOT OK:
            THROW error

          PARSE response body as JSON
          EXTRACT count value

          FIND element with id="visitor-count"
          SET element text to count value

        CATCH any error:
          LOG error to console
          SET element text to "N/A"

      END FUNCTION

    END PROGRAM
*/

class SessionAwareVisitorCounter {
  //Class constructor, initializes link to API for DB and current user session key
  //EPastore, 03/14/2026
  constructor() {
    this.API_ENDPOINT = "<your-cloud-function-or-lambda-url>";
    this.SESSION_KEY = "current visitor count";
  }

  //Check browser sessionStorage and reads count, only increment if new visitor
  //Currently reads sessionStorage, will read from Cloud SQL in later versions
  //Epastore, 03/14/2026
  handleVisit() {
    //Epastore, 04/13/2026
    //alreadyCounted = READ sessionStorage value at key SESSION_KEY
    const alreadyCounted = sessionStorage.getItem(this.SESSION_KEY);



    if (alreadyCounted === "true") {
      //IF alreadyCounted is "true":
      //   -- This tab already triggered a count increment; just display current count
      //   CALL displayCount(shouldIncrement = FALSE)
      this.displayCount(false);
    } else {
      // ELSE:
      //   -- First visit in this session; increment, then record it
      //   CALL displayCount(shouldIncrement = TRUE)
      //   WRITE "true" to sessionStorage at key SESSION_KEY
      this.displayCount(true);
      sessionStorage.setItem(this.SESSION_KEY, "true");
    }
  }

  async displayCount(shouldIncrement) {
    // EPastore, 04/13/2026
    try {
      const method = shouldIncrement ? "POST" : "GET";

      const response = await fetch(this.API_ENDPOINT, { method: method });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();

      const count = data.count;

      document.getElementById("visitor-count").textContent = count;

      console.log("Visitor count: " + count);

    } catch (error) {
      console.error("Visitor counter error:", error);

      document.getElementById("visitor-count").textContent = "N/A";
    }
    //     IF shouldIncrement is TRUE:
    //       METHOD = "POST"   -- backend increments and returns new count
    //     ELSE:
    //       METHOD = "GET"    -- backend returns current count without changing it

    //     SEND HTTP request with METHOD to API_ENDPOINT
    //     AWAIT response

    //     IF response status is NOT OK:
    //       THROW error

    //     PARSE response body as JSON
    //     EXTRACT count value

    //     FIND element with id="visitor-count"
    //     SET element text to count value

    //   CATCH any error:
    //     LOG error to console
    //     SET element text to "N/A"
  }
}
window.addEventListener("load", () => {
  const visitorCounter = new SessionAwareVisitorCounter();
  visitorCounter.handleVisit();
});

