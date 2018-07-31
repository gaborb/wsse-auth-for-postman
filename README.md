# wsse-auth-for-postman

- set username and password as **Environment variables**

Key | Value
--- | -----
x-wsse-username | username
x-wsse-secret | secret

- add the required **Headers**

Key | Value
--- | -----
x-wsse | {{x-wsse}}

- paste index.js to the **Pre-request Script** editor

- fill in the remaining request details and hit **Send**