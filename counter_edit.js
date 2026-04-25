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

class SessionAwareVisitorCounter
{
  // --- CONSTRUCTOR ---
  // In JavaScript, every class uses the special keyword `constructor` (not the class name).
  // The `this` keyword refers to the specific instance being created, binding these
  // properties to that object so all methods can access them via `this.PROPERTY_NAME`.
  constructor()
  {
    this.API_ENDPOINT = "<your-cloud-function-or-lambda-url>";
    // SESSION_KEY is the string label used to read/write to sessionStorage.
    // Using a constant here prevents typos — change it in one place and it updates everywhere.
    this.SESSION_KEY = "visitor_counted";
  }

  // --- handleVisit() ---
  // Called once on page load. Decides whether this tab has already been counted
  // by checking sessionStorage, then delegates to fetchAndDisplayCount().
  handleVisit()
  {
    // sessionStorage.getItem(key) reads a value for the given key.
    // It returns the stored string, or null if nothing has been saved yet.
    // sessionStorage is scoped to the browser tab — closing the tab wipes it automatically.
    const alreadyCounted = sessionStorage.getItem(this.SESSION_KEY);

    if (alreadyCounted === "true") {
      // The tab has already registered a visit this session.
      // Just fetch and display the current count without incrementing.
      this.fetchAndDisplayCount(false);
    } else {
      // First time this tab has loaded the page — increment the count in the backend,
      // then mark this session so we don't double-count on future navigations.
      this.fetchAndDisplayCount(true);
      // sessionStorage.setItem(key, value) writes a string value under the given key.
      sessionStorage.setItem(this.SESSION_KEY, "true");
    }
  }

  // --- fetchAndDisplayCount(shouldIncrement) ---
  // The `async` keyword marks this function as asynchronous, which unlocks the `await`
  // keyword inside it. Without `async`, using `await` is a syntax error.
  // An async function always returns a Promise, even if you don't explicitly return one.
  async fetchAndDisplayCount(shouldIncrement)
  {
    try {
      // Ternary operator: condition ? valueIfTrue : valueIfFalse
      // POST tells the backend to increment the counter and return the new value.
      // GET tells the backend to return the current value without changing it.
      const method = shouldIncrement ? "POST" : "GET";

      // fetch() is the browser's built-in HTTP client. It returns a Promise.
      // `await` pauses execution here until the Promise resolves (the server responds),
      // rather than blocking the entire browser thread — other code can still run.
      const response = await fetch(this.API_ENDPOINT, { method: method });

      // response.ok is true when the HTTP status code is in the 200-299 range (success).
      // Any 4xx or 5xx status sets response.ok to false.
      // We manually throw an error here so control jumps to the catch block below.
      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      // response.json() reads the response body and parses it as JSON.
      // This is also asynchronous, so we await it as well.
      // We expect the backend to return something like: { "count": 42 }
      const data = await response.json();

      // Destructure the count field out of the parsed JSON object.
      const count = data.count;

      // document.getElementById() searches the HTML DOM for an element whose id
      // attribute matches the string. Returns null if not found.
      // .textContent sets the visible text inside that element.
      document.getElementById("visitor-count").textContent = count;

    } catch (error) {
      // If anything in the try block throws (network failure, bad status, parse error),
      // execution jumps here. We log the full error for debugging and show "N/A"
      // so the user sees a graceful fallback instead of a blank or broken counter.
      console.error("Visitor counter error:", error);
      document.getElementById("visitor-count").textContent = "N/A";
    }
  }
}

// --- PAGE LOAD WIRING ---
// "window" is the global browser object. Listening for the "load" event ensures all
// HTML, images, and scripts are fully parsed before we touch the DOM.
// We create one instance of the class and call handleVisit() to kick off the logic.
window.addEventListener("load", () => {
  const counter = new SessionAwareVisitorCounter();
  counter.handleVisit();
});