/**
 * Kenny "Ackerson" Le
 * CSE 154 AF, Winter 2022
 * TA: Ludvig Liljenberg, Marina Wooden
 * 2/26/22
 * Creative Project #3
 * Description:
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  function init() {
    console.log('Hello world!');
    let form = document.getElementById('search-field');
    let searchField = document.getElementById('search');
    searchField.addEventListener('keyup', isInputFilled);
    form.addEventListener('submit', function(e) {
      let input = getInput(e);
    });
  }

  function isInputFilled() {
    let button = document.getElementsByTagName('button')[0];
    let search = document.getElementById('search');
    button.disabled = search.value === '';
  }

  function getInput(event) {
    let searchField = document.getElementById('search');
    let input = searchField.value.toLowerCase().trim();
    let button = document.getElementsByTagName('button')[0];
    event.preventDefault();
    if (input !== '') {
      searchField.value = '';
      button.disabled = true;
      console.log('Input: ', input);
    }
    return input;
  }

  function makeRequest(params) {
    const BASE_URL = 'https://www.amiiboapi.com/api/amiibo/';
    let url = BASE_URL + `?name=${params}`;
    return safeGet(url);
  }

  async function safeGet(url) {
    try {
      let response = await fetch(url, {method: 'POST'});
      await statusCheck(response);
      return await response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  function handleError(err) {
    //  TODO: handle the error
  }

  /**
   * Takes a string and removes any HTML special characters from it
   * Base code credit: https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript/18108463
   * @param {String} text The string to be formatted
   * @returns {String} The string without HTML special characters
   */
  function escapeHTML(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

})();