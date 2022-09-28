import {
    Given,
    When,
    And,
    Then,
} from "@badeball/cypress-cucumber-preprocessor";
require('cypress-xpath');


const date = new Date();
const today = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
const checkOutDate = new Date()
let formattedCheckOutDate = checkOutDate.setDate(checkOutDate.getDate() + 4)
formattedCheckOutDate = checkOutDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })

const yesterdayDate = new Date()
let formattedYesterdayDate = yesterdayDate.setDate(yesterdayDate.getDate() - 1)
formattedYesterdayDate = yesterdayDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })

const locators = {
    anywhereField: 'body > div:nth-child(7) > div > div > div:nth-child(1) > div > div > div._1unac3l > div > div > div > div > div > div > div.h1p4yt3r.dir.dir-ltr > div > div > div > div > header > div > div.cylj8v3.dir.dir-ltr > div > div > div > div.lkm6i7z.l1rzxhu2.lr5v90m.dir.dir-ltr > div > button:nth-child(2)',
    priceTag: '//*[@id="site-content"]/div[3]/div/div/div/div/div/div/div[4]/div/div/div[2]/div[2]/div/div[4]/div[1]/div/button/div/div',
    firstCardElement: '//*[@id="site-content"]/div[2]/div[3]/div[2]/div/div/div/div/div/div/div[1]/div/div[2]/div/div/div/div[1]/a',
    cardTitle: '/html/body/div[5]/div/div/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/main/div[2]/div[3]/div[2]/div/div/div/div/div/div/div[1]/div/div[2]/div/div/div/div[1]/div[2]/div[1]',
    priceTagCardTitle: '/html/body/div[5]/div/div/div[1]/div/div/div[1]/div/div/div/div/div/div/div[2]/main/div[3]/div/div/div/div/div/div/div[4]/div/div/div[2]/div[2]/div/div[4]/div[25]/div/div[1]/div[2]/div[1]',
    locationPriceCardElement: '//*[@id="site-content"]/div[2]/div[3]/div[2]/div/div/div/div/div/div/div[1]/div/div[2]/div/div/div/div[1]/div[2]/div[5]/div/div/span[1]/div/span[1]',
    locationPriceTagElement: '//*[@id="site-content"]/div[3]/div/div/div/div/div/div/div[4]/div/div/div[2]/div[2]/div/div[4]/div[25]/div/div[1]/div[2]/div[3]/div/div/div/span/div/span[1]',
    // closeCardButton: '//*[@id="site-content"]/div[3]/div/div/div/div/div/div/div[4]/div/div/div[2]/div[2]/div/div[4]/div[2]/div/div[1]/div[1]/div/div/div[2]/div/div[1]/div[1]/div/button',
    filterButton: '//*[@id="site-content"]/div[2]/div[2]/div/div/div/div[2]/button',
    entirePlaceSelector: 'div[id*=filterItem][id$=checkbox-room_types-Entire_home_apt-row-title]',
    privateRoomSelector: 'div[id*=filterItem][id$=checkbox-room_types-Private_room-row-title]',
    japaneseSelector: 'div[id*=filterItem][id$=checkbox-languages-8-row-title]',
    homesDisplayed: '//*[@id="site-content"]/div[2]/div[2]/div/div/div/div[1]/div/section/h1/span',
    modal: '/html/body/div[11]/section/div/div/div[2]/div'
}

Given('Navigate to the Airbnb landing page', () => {
    cy.visit('https://www.airbnb.com/', {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "User-Agent": "axios/0.27.2"
            }
        })
})

When ('Click on Anywhere field and type {string}', (country) => {
    cy.viewport(1920, 1080)
    cy.get(locators.anywhereField).click({force:true})
    cy.get('#bigsearch-query-location-input').type(country)
})

Then ('Click on the {string} item', (country) => {
    cy.contains(country).click({force: true})
    
})

Then ('Complete the check in and check out date from the calendar with an interval which includes the current date plus {int} more days', (numberOfDays) => {
    cy.get(`[data-testid="calendar-day-${today}"]`).click({force:true})
    cy.get(`[data-testid="calendar-day-${formattedCheckOutDate}"]`).click({force:true})
})

Then ('Check that the interval is selected and check that the date before the interval is disabled', () => {
    cy.get(`[data-testid="calendar-day-${today}"]`).parent().invoke('attr', 'aria-label').should('contain', 'Selected check-in date.')
    cy.get(`[data-testid="calendar-day-${formattedCheckOutDate}"]`).parent().invoke('attr', 'aria-label').should('contain', 'Selected checkout date.')
    cy.get(`[data-testid="calendar-day-${formattedYesterdayDate}"]`).parent().invoke('attr', 'aria-label').should('contain', 'Past dates can\’t be selected.')
})

Then ('Click on I\'m flexible and select weekend', () => {
    cy.get('#tab--tabs--1').click({force:true})
    cy.get('#flexible_trip_lengths-weekend_trip').click({force:true})
})

Then ('Click on Choose dates, search for the accommodation, and hover over the first element', () => {
    cy.get('#tab--tabs--0').click({force:true})
    cy.get('[data-testid="structured-search-input-search-button"]').click({force:true})
    cy.xpath(locators.firstCardElement).trigger('mouseover', {force:true})
    cy.xpath(locators.priceTag).should('have.css', 'background-color', 'rgb(34, 34, 34)')
})

Then ('Verify that the property displayed on the map matches the name and the price characteristics', () => {
    cy.xpath(locators.priceTag).click({force:true})
    cy.xpath(locators.cardTitle).then(($cardTitle) => {
        const cardTxt = $cardTitle.text()
        cy.xpath(locators.priceTagCardTitle).then(($priceTagTitle) => {
            expect($priceTagTitle.text()).to.eq(cardTxt)
        })
    })
    cy.wait(500)
    cy.xpath(locators.locationPriceCardElement).then(($priceCard) => {
        const price = $priceCard.text()
        cy.xpath(locators.locationPriceTagElement).then(($priceTagTitle) => {
            expect($priceTagTitle.text()).to.eq(price)
        })
    })
})

Then ('Verify that the selected filters number is reflected on the listing and the results are matching the filtered criteria', () => {
    cy.xpath(locators.filterButton).click({force:true})
    cy.xpath(locators.filterButton).click({force:true})
    cy.get(locators.entirePlaceSelector).click({force:true})
    cy.get(locators.privateRoomSelector).click({force:true})
    cy.get(locators.japaneseSelector).click({force:true})
    cy.get('._1ku51f04').then(($homes) => {
        const numberOfHomesAvailable = $homes.text()
        cy.get("._1ku51f04").click({force:true})
        cy.xpath(locators.homesDisplayed).then(($homesDisplayed) => {
            expect(numberOfHomesAvailable).include($homesDisplayed.text())
        })
    })
})