# User Repository

Node + React test assignment

## Setup Instructions

### Prerequisites

- Node.js (Version 16 or later recommended)
- npm (Usually comes with Node.js)

### Frontend and Backend Setup

1. **Navigate to the root Directory**
2. **Run Install Script**
    ```bash
    chmod +x setupAndRun.sh
    ./setupAndRun.sh
    ```

3. **Review .env in the frontend and the backend**
    - Please make sure to make your api key from postmark (https://postmarkapp.com/). For now backend env POSTMARK_API_TOKEN and POSTMARK_EMAIL_FROM works only for domains ..@diginetwork.ee

## Frontend Routes

- `/login` - Login page for user authentication.
- `/register` - Registration page for new users.
- `/user-list` - Displays a list of users (authentication required).
- `/user-add` - Form to add a new user (authentication required).
- `/detail/:userId` - Shows the details of a specific user (authentication required).
- `/logout` - Logs out the current user and redirects to the login page.

## Backend Routes

### Auth Routes

- `POST /auth/login` - Authenticates a user and returns a token.
- `POST /auth/register` - Registers a new user.
- `POST /auth/recover-password` - Initiates the password recovery process for a user.
- `GET /auth/validate?token=xyz` - Validates a user's email via a token.

### User Routes

- `GET /users/list` - Retrieves a list of users (authentication required).
- `GET /users/detail/:userId` - Retrieves detailed information about a specific user (authentication required).
- `POST /users/register` - Adds a new user to the system (authentication required).
- `DELETE /users/delete/:userId` - Deletes a specific user (authentication required).
