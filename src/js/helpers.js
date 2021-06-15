// functions that we reuse over and over
import { TIMEOUT_SEC } from './config.js'; // use {} when it's a "name export", like "export const...""

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(
          `Error from Timeout passed to 'throw err;' in helpers.js, then sent to module.js in console.error():: Request took too long! Timeout after ${s} seconds`
        )
      );
    }, s * 1000);
  });
};

/* export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]); // race between getJSON and Timeout

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `Error from getJSON function sent to module.js in console.error(): ${res.status} ${data.message}`
      );
    return data; // always remember to return. Data is the result value of the getJSON promise
  } catch (err) {
    // console.error(err);
    throw err; // to handle the error from the model.js file, instead of from helpers.js (here)
  }
};

// send new submitted recipe to the API. This is a POST request, we must pass an object with fetch.
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `Error from sendJSON function sent to module.js in console.error(): ${res.status} ${data.message}`
      );
    return data; // always remember to return. Data is the result value of the getJSON promise
  } catch (err) {
    // console.error(err);
    throw err; // to handle the error from the model.js file, instead of from helpers.js (here)
  }
}; */

// refactoring getJSON and sendJSON into one single function as they are very similar

export const AJAX = async function (url, uploadData = undefined) {
  try {
    // conditionally defining a const. Does uploadData exists? If so...otherwise...
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);

    const data = await res.json();
    if (!res.ok)
      throw new Error(
        `Error from AJAX function sent to module.js in console.error(): ${res.status} ${data.message}`
      );
    return data;
  } catch (err) {
    throw err;
  }
};
