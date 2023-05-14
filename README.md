<br />
<p align="center">
<div align="center">
<img height="150" src="./documentation/logo.png" alt="Shopizy" border="0"/>
</div>
  <h3 align="center">Shopizy Backend</h3>
  <p align="center">
    <a href="https://github.com/VerdyNordsten/shopizy_backend"><strong>Explore the docs »</strong></a>
    <br />
    <a href="https://shopizy.up.railway.app/">View Demo</a>
    ·
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Setup .env](#setup-env)
- [Related Project](#related-project)
<!-- ABOUT THE PROJECT -->

## About The Project

Shopizy is an e-commerce application designed to provide users with a seamless online shopping experience. The platform offers a diverse range of products from various sellers, allowing users to browse and purchase items conveniently from their preferred devices.

One of the standout features of Shopizy is its intuitive interface, which makes it easy for users to navigate through different categories, explore product details, and compare prices. This helps users make informed purchasing decisions and find the best deals available.

Shopizy also offers secure payment options to ensure a safe transaction process. Users can choose from a variety of payment methods and rest assured that their personal and financial information is protected.

To use Shopizy, users can create an account or shop as a guest. The application provides personalized recommendations based on users' browsing and purchasing history, making it easier to discover new products that align with their interests.

With Shopizy, online shopping becomes a hassle-free experience, enabling users to find and purchase the products they need with just a few clicks. Whether it's fashion, electronics, home goods, or any other category, Shopizy caters to the diverse needs of users, making it a go-to destination for e-commerce.

### Built With

- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [JSON Web Tokens](https://jwt.io/)
- and other


<!-- GETTING STARTED -->


## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- [nodejs](https://nodejs.org/en/download/)

| Third Party               | npm install                           |
| ------------------------- | ------------------------------------- |
| [axios]                   | npm i axios@0.27.2                     |
| [bcrypt]                  | npm i bcrypt@5.0.1                     |
| [body-parser]             | npm i body-parser@1.20.0               |
| [cors]                    | npm i cors@2.8.5                       |
| [crypto]                  | npm i crypto@1.0.1                      |
| [dotenv]                  | npm i dotenv@16.0.1                     |
| [ejs]                     | npm i ejs@3.1.8                         |
| [express]                 | npm i express@4.18.1                    |
| [express-validator]       | npm i express-validator@6.14.1          |
| [googleapis]              | npm i googleapis@101.0.0                |
| [helmet]                  | npm i helmet@5.1.0                      |
| [jsonwebtoken]            | npm i jsonwebtoken@8.5.1                |
| [multer]                  | npm i multer@1.4.5-lts.1                 |
| [nodemailer]              | npm i nodemailer@6.7.5                  |
| [nodemon]                 | npm i nodemon@2.0.22                    |
| [oauth-1.0a]              | npm i oauth-1.0a@2.2.6                  |
| [pg]                      | npm i pg@8.7.3                          |
| [socket.io]               | npm i socket.io@4.5.1                    |
| [uuid]                    | npm i uuid@8.3.2                        |
| [xss-clean]               | npm i xss-clean@0.1.1                   |

[axios]: https://www.npmjs.com/package/axios
[bcrypt]: https://www.npmjs.com/package/bcrypt
[body-parser]: https://www.npmjs.com/package/body-parser
[cors]: https://www.npmjs.com/package/cors
[crypto]: https://www.npmjs.com/package/crypto
[dotenv]: https://www.npmjs.com/package/dotenv
[ejs]: https://www.npmjs.com/package/ejs
[express]: http://expressjs.com
[express-validator]: https://www.npmjs.com/package/express-validator
[googleapis]: https://www.npmjs.com/package/googleapis
[helmet]: https://www.npmjs.com/package/helmet
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[multer]: https://www.npmjs.com/package/multer
[nodemailer]: https://www.npmjs.com/package/nodemailer
[nodemon]: https://www.npmjs.com/package/nodemon
[oauth-1.0a]: https://www.npmjs.com/package/oauth-1.0a
[pg]: https://node-postgres.com
[socket.io]: https://www.npmjs.com/package/socket.io
[uuid]: https://www.npmjs.com/package/uuid
[xss-clean]: https://www.npmjs.com/package/xss-clean

### Requirements

Documentation files are provided in the [documentation](./documentation) folder

- [PostgreSQL database query](./query.sql)

API endpoint list are also available as published postman documentation

[![Run in Postman](https://run.pstmn.io/button.svg)](https://documenter.getpostman.com/view/26188678/2s93ecxB77)

- [Node.js](https://nodejs.org/en/)
- [Postman](https://www.getpostman.com/) for testing

### Installation

- Clone This Back End Repo

```
git clone https://github.com/VerdyNordsten/shopizy_backend.git
```

- Go To Folder Repo

```
cd shopizy_backend
```

- Install Module

```
npm install
```

- <a href="#setup-env">Setup .env</a>
- Starting application

```
  <!-- Run App -->
  npm run dev
```

```
  <!-- Run Linter -->
  npm run lint
```

### Setup .env

Create .env file in your root project folder.

```
PORT=
DB_HOSTNAME=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_PORT=
JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
REDIRECT_URI=
GMAIL_REFRESH_TOKEN=
DRIVE_REFRESH_TOKEN=
```

## Related Project

:rocket: [`Backend Shopizy`](https://github.com/VerdyNordsten/shopizy_backend)

:rocket: [`Frontend Shopizy`](https://github.com/VerdyNordsten/shopizy)

:rocket: [`Demo Shopizy`](https://shopizy.digty.co.id/)

Project Link: [https://github.com/VerdyNordsten/shopizy_backend](https://github.com/VerdyNordsten/shopizy_backend)
