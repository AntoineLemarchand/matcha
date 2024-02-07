const sendHttp = async (path = '', method = "GET", body = undefined, headers = {"Content-Type": "application/json"}) => {
  return fetch(`${process.env.REACT_APP_API_URL}${path}`, {
    method,
    credentials: "include",
    headers,
    body
  })
  .then((response) => {
    if (response.status === 200 || response.status === 201) {
      return response.json();
    } else {
      throw response.status;
    }
  })
  .then((data) => {
    return data;
  })
}

export default sendHttp;
