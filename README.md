# URL Shortener Service

This project is a simple URL shortener service built with Node.js, Express.js, and MongoDB, featuring short URL generation, redirection to original URLs, analytics for each short URL, and tracking unique visitors using Docker and Radix Server.

## Features

- Generate a short URL for a given long URL.
- Redirect to the original URL using the short URL.
- View analytics for each short URL.

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Docker
- Radix Server
- Mongo DB

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/your-username/url-shortener.git
    ```
2. Navigate to the project directory:
    ```sh
    cd url-shortener
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Running the Server

1. Start the server:
    ```sh
    npm start
    ```
2. The server will be running on `http://localhost:8000`.

## API Endpoints

### 1. Generate Short URL

- **URL**: `/api/shortid`
- **Method**: `POST`
- **Request Body**:
    ```json
    {
       "url": "https://www.facebook.com/"
    }
    ```
- **Response**:
    ```json
    {
       "status":"200",
       "shortId": "NgzT4BGJ"
    }
    ```

### 2. Redirect to Original URL

- **URL**: `/api/redirect/:shortId`
- **Method**: `GET`
- **Headers**:
  - **Key**: `referer`
  - **Value**: `https://www.google.com/`
- **Example**: `http://localhost:8000/api/redirect/NgzT4BGJ`
- **Description**: This endpoint will redirect you to the original URL associated with the given `shortId`. The `referer` header can be passed to indicate the referer URL.

### 3. Analytics

- **URL**: `/api/analytics/:shortId`
- **Method**: `GET`
- **Example**: `http://localhost:8000/api/analytics/NgzT4BGJ`
- **Response**:
    ```json
    {
        "status": "200",
        "originalUrl": "https://www.facebook.com/",
        "totalVisits": 1,
        "uniqueVisitors": 1,
        "topReferrers": [
            {
                "referrer": "https://www.google.com/",
                "count": 1
            }
        ],
        "visitsPerHour": {
            "2024-08-07T09": 1
        },
        "visitsPerDay": {
            "2024-08-07": 1
        },
        "pieChartData": [
            {
                "deviceType": "Desktop",
                "count": 1,
                "percentage": "100.00"
            }
        ]
    }
    ```

## Rate Limiting

You can hit the API a maximum of 15 times within a 15-minute window because of rate limiting.

## Expiration

The short ID will expire in 5 minutes.

## Postman Collection

You can use the provided Postman collection to test the API endpoints. Import the `postman_collection.json` file into Postman and use the predefined requests.

## License

This project is licensed under the MIT License.

## Acknowledgements

- Node.js
- Express.js
- Postman
