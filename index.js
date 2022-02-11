/**
 * Kenny "Ackerson" Le
 * CSE 154 AF, Winter 2022
 * TA: Ludvig Liljenberg, Marina Wooden
 * 2/26/22
 * Creative Project #3
 * Description: Provides functionality for Amiibo searcher by taking
 * user input and returning the information for the Amiibo if it
 * exists
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  /**
   * Provides functionality for the Amiibo searcher
   * with input and displaying of amiibo information
   */
  function init() {
    let form = document.getElementById('search-field');
    let searchField = document.getElementById('search');

    searchField.addEventListener('keyup', isInputFilled);
    form.addEventListener('submit', async function(event) {
      let input = getInput(event);
      let response = await makeRequest(encodeURIComponent(input));
      let warning = document.getElementById('warning');

      if (response !== null) {
        warning.classList.remove('active');
        clearPage();

        let cardSection = document.getElementById('amiibo');
        for (const amiibo of response["amiibo"]) {
          let card = createCard(amiibo);
          cardSection.appendChild(card);
        }
      }
    });
  }

  /**
   * Creates a new HTML element with Amiibo
   * information to display to based on user input
   * @param {JSON} data JSON information from Amiibo API
   * @returns {HTMLDivElement} HTML element with Amiibo information
   */
  function createCard(data) {
    let card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('horizontal-alignment');

    let img = document.createElement('img');
    img.setAttribute('src', data['image']);
    img.setAttribute('alt', data['character']);
    card.appendChild(img);

    let div = document.createElement('div');
    let headerOne = document.createElement('h1');
    headerOne.textContent = data['character'];
    div.appendChild(headerOne);

    let headerTwo = document.createElement('h2');
    headerTwo.textContent = data['amiiboSeries'];
    div.appendChild(headerTwo);

    let paragraph = document.createElement('p');
    paragraph.textContent = 'Release:';
    div.appendChild(paragraph);

    let list = document.createElement('ul');
    for (const [country, date] of Object.entries(data['release'])) {
      let listItem = document.createElement('li');
      listItem.textContent = `${country}: ${date}`;
      list.appendChild(listItem);
    }
    div.appendChild(list);
    card.appendChild(div);
    return card;
  }

  /**
   * Determines if there is text in the search bar.
   * If there is no text, search button and functionality is disabled.
   */
  function isInputFilled() {
    let button = document.getElementsByTagName('button')[0];
    let search = document.getElementById('search');
    button.disabled = search.value === '';
  }

  /**
   * Retrieves user input into search bar and clears the search bar
   * after search is initiated
   * @param {event} event HTML dom event of searching (submitting form)
   * @returns {string} user input in string format
   */
  function getInput(event) {
    let searchField = document.getElementById('search');
    let input = searchField.value.toLowerCase().trim();
    let button = document.getElementsByTagName('button')[0];
    event.preventDefault();
    if (input !== '') {
      searchField.value = '';
      button.disabled = true;
    }
    return input;
  }

  /**
   * Takes an amiibo name, makes an API call using
   * the safeGet() function
   * @param {String} params Amiibo name from user input
   * @returns {Promise<JSON|null>} the response of the API call
   */
  function makeRequest(params) {
    const BASE_URL = 'https://www.amiiboapi.com/api/amiibo/';
    let url = BASE_URL + `?name=${params}`;
    return safeGet(url);
  }

  /**
   * Makes an API call using the provided API and either
   * returns the JSON data or null if an error occurs
   * @param {String} url the URL for the API call
   * @returns {Promise.<JSON|null>} the response of the API call
   */
  async function safeGet(url) {
    try {
      let response = await fetch(url, {method: 'GET'});
      await statusCheck(response);
      return await response.json();
    } catch (err) {
      handleError(err);
      return null;
    }
  }

  /**
   * Takes a response from an API call and throws an error
   * if the response was not successful
   * Returns the response otherwise
   * @param {Response} res response of an API call
   * @returns {Promise<Response>} the response of the API call
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Displays an error message on the page and the error code
   * when the API call fails
   * @param {Error} err Error message from API call
   */
  function handleError(err) {
    clearPage();
    let warning = document.getElementById('warning');
    warning.classList.add('active');

    let errorMessage = document.createElement('p');
    errorMessage.textContent = `Full error message: ${err.message}`;
    if (warning.children.length > 1) {
      warning.removeChild(warning.lastChild);
    }
    warning.append(errorMessage);
  }

  /**
   * Clears the Amiibo cards from the screen
   */
  function clearPage() {
    let cardSection = document.getElementById('amiibo');
    cardSection.innerHTML = '';
  }
})();