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
- MongoDB

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
- **Description**: This endpoint accepts a long URL in the request body and generates a corresponding short ID. The generated short ID is returned in the response.

- **Response**:
    ```json
    {
       "status":"200",
       "shortId": "NgzT4BGJ"
    }
    ```
  - **status**: HTTP status code.
  - **shortId**: The generated short URL ID that can be used to redirect to the original URL.

### 2. Redirect to Original URL

- **URL**: `/api/redirect/:shortId`
- **Method**: `GET`
- **Headers**:
  - **Key**: `referer`
  - **Value**: `https://www.google.com/`
- **Example**: `http://localhost:8000/api/redirect/NgzT4BGJ`
- **Description**: This endpoint redirects to the original URL associated with the provided `shortId`. The `referer` header can optionally be used to track where the request came from.

### 3. Analytics

- **URL**: `/api/analytics/:shortId`
- **Method**: `GET`
- **Example**: `http://localhost:8000/api/analytics/NgzT4BGJ`
- **Description**: This endpoint provides analytics data for the specified `shortId`, including the original URL, total visits, unique visitors, top referrers, visits per hour, visits per day, and a breakdown of visits by device type.

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

The API is rate-limited, allowing a maximum of 15 requests per 15-minute window.

## Expiration

Each generated short ID will expire 5 minutes after creation.

## Postman Collection

To facilitate testing the API, a Postman collection has been provided. You can import the `postman_collection.json` file into Postman to quickly test the API endpoints. The collection includes predefined requests for each API endpoint, with sample data and explanations.

1. **Import the Postman Collection**:
   - Open Postman.
   - Click on "Import" in the top left corner.
   - Select the `postman_collection.json` file from the project directory.
   - The collection will be imported, and you can use it to test the API.

2. **Postman Collection JSON**:
   ```json
   {
     "info": {
         "_postman_id": "334cedc4-4bcc-490e-b6a2-dda0dcc1dec9",
         "name": "URL Shortener API",
         "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
         "_exporter_id": "36795990"
     },
     "item": [
         {
             "name": "Redirect To original Page",
             "request": {
                 "method": "GET",
                 "header": [
                     {
                         "key": "referer",
                         "value": "https://www.google.com/",
                         "type": "text"
                     }
                 ],
                 "url": {
                     "raw": "http://localhost:8000/api/redirect/NgzT4BGJ",
                     "protocol": "http",
                     "host": [
                         "localhost"
                     ],
                     "port": "8000",
                     "path": [
                         "api",
                         "redirect",
                         "NgzT4BGJ"
                     ],
                     "query": [
                         {
                             "key": "",
                             "value": null,
                             "disabled": true
                         }
                     ]
                 }
             },
             "response": []
         },
         {
             "name": "Analytics",
             "request": {
                 "method": "GET",
                 "header": [],
                 "url": {
                     "raw": "http://localhost:8000/api/analytics/NgzT4BGJ",
                     "protocol": "http",
                     "host": [
                         "localhost"
                     ],
                     "port": "8000",
                     "path": [
                         "api",
                         "analytics",
                         "NgzT4BGJ"
                     ]
                 }
             },
             "response": []
         },
         {
             "name": "Generate Short Id",
             "request": {
                 "auth": {
                     "type": "noauth"
                 },
                 "method": "POST",
                 "header": [],
                 "body": {
                     "mode": "raw",
                     "raw": "{\r\n   \"url\":\"https://www.facebook.com/\" \r\n}",
                     "options": {
                         "raw": {
                             "language": "json"
                         }
                     }
                 },
                 "url": {
                     "raw": "http://localhost:8000/api/shortid",
                     "protocol": "http",
                     "host": [
                         "localhost"
                     ],
                     "port": "8000",
                     "path": [
                         "api",
                         "shortid"
                     ]
                 }
             },
             "response": []
         }
     ]
   }
