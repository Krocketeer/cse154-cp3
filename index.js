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
  }

  function makeRequest() {
    const BASE_URL = 'https://www.amiiboapi.com/api/';
    let url = BASE_URL + `?{}`;
    return safeGet(url);
  }

  async function safeGet(url) {
    try {
      let response = await fetch(url);
      await statusCheck(response);
      return await response.json();
    } catch (err) {
      console.error(err);
    }
  }

  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }
})();