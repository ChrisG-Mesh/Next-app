
# Server side app for Google Extension x Mesh

## Getting Started

To get a local copy of the project up and running, follow these steps.

### Prerequisites

Make sure you have Node.js and npm installed on your development machine. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/ChrisG-Mesh/server-side-google-ext.git
    cd server-side-google-ext
    ```

2. **Install NPM packages:**

    ```sh
    npm install
    ```

### Environment Variables

Create a `.env.local` file in the root directory of your project. This file should contain all the necessary environment variables. Here’s an example of what your `.env.local` file might look like:

    ```
    # Example environment variables
    MESH_CLIENTID=your-client-id
    MESH_APIKEY=your-api-key
    MESH_USERID=your-user-id
    MESH_URL=mesh-environment-url
    ```

Make sure to replace `your-client-id` and `your-api-key` with your actual database URL and API key.

### Running the Application

To start the development server, run the following command:

```sh
npm run dev
