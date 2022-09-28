Feature: Airbnb search feature

    Verify that the results match the selected criteria

    Scenario: Check the results
        Given Navigate to the Airbnb landing page
        When Click on Anywhere field and type 'Spain'
        Then Click on the 'Spain' item
        Then Complete the check in and check out date from the calendar with an interval which includes the current date plus 4 more days
        Then Check that the interval is selected and check that the date before the interval is disabled
        Then Click on I'm flexible and select weekend
        Then Click on Choose dates, search for the accommodation, and hover over the first element
        Then Verify that the property displayed on the map matches the name and the price characteristics
        Then Verify that the selected filters number is reflected on the listing and the results are matching the filtered criteria
