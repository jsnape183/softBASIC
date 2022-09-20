export const apiGet = async (url) => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) => data);
};

export const apiPost = async (url, body) => {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
    .then((response) => response.json())
    .then((data) => data);
};

export const apiDelete = async (url) => {
  return fetch(url, {
    method: "DELETE"
  })
    .then((response) => response.json())
    .then((data) => data);
};
