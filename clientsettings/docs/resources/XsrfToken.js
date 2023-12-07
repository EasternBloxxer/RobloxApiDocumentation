const {
    fetch: originalFetch
} = window;

window.fetch = async (...args) => {
    const xsrfRequestMethods = ["POST", "PATCH", "DELETE"];
    const csrfTokenHeader = "x-csrf-token";
    const csrfInvalidResponseCode = 403;

    let [resource, config] = args;

    let response = await originalFetch(resource, config);

    // if xsrf token failure, re-send request with the returned token
    if (config.method != null && xsrfRequestMethods.indexOf(config.method.toUpperCase()) >= 0 && response.status === csrfInvalidResponseCode && response.headers.has(csrfTokenHeader)) {
        config.headers[csrfTokenHeader] = response.headers.get(csrfTokenHeader);
        response = await originalFetch(resource, config);
    }

    return response;
};