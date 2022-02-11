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
    let form = document.getElementById('search-field');
    let searchField = document.getElementById('search');

    searchField.addEventListener('keyup', isInputFilled);
    form.addEventListener('submit', async function(e) {
      let input = getInput(e);
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
      list.appendChild(listItem)
    }
    div.appendChild(list);
    card.appendChild(div);
    return card;
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
      let response = await fetch(url, {method: 'GET'});
      await statusCheck(response);
      return await response.json();
    } catch (err) {
      handleError(err);
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

  function clearPage() {
    let cardSection = document.getElementById('amiibo');
    cardSection.innerHTML = '';
  }
})();