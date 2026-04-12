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
  //Class constructor, initializes link to API for DB and current user session key
  //EPastore, 03/14/2026
  SessionAwareVisitorCounter()
  {
    this.API_ENDPOINT = "<your-cloud-function-or-lambda-url>";
    this.SESSION_KEY = "current visitor count";
  }

  //Check browser sessionStorage and reads count, only increment if new visitor
  //Currently reads sessionStorage, will read from Cloud SQL in later versions
  //Epastore, 03/14/2026
  handleVisit()
  {
    //alreadyCounted = READ sessionStorage value at key SESSION_KEY

    //IF alreadyCounted is "true":
    //   -- This tab already triggered a count increment; just display current count
    //   CALL fetchAndDisplayCount(shouldIncrement = FALSE)
    // ELSE:
    //   -- First visit in this session; increment, then record it
    //   CALL fetchAndDisplayCount(shouldIncrement = TRUE)
    //   WRITE "true" to sessionStorage at key SESSION_KEY



  }

  displayCount()
  {
      // TRY:
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