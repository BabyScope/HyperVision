# HyperVision

This is a Next.js application that allows users to track their open positions and balances on the Hyperliquid decentralized exchange.

## Getting Started on an Ubuntu Server

These instructions will get you a copy of the project up and running on your local machine or an Ubuntu server for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed on your Ubuntu server:
- **Node.js** (v18.x or later recommended)
- **npm** (usually comes with Node.js)

You can follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-22-04) to install Node.js and npm on Ubuntu.

### Installation

1.  **Clone the repository:**
    First, get the code onto your server. If you've uploaded it to GitHub, you can clone it using git.
    ```bash
    git clone https://github.com/your-username/your-repository-name.git
    cd your-repository-name
    ```

2.  **Install dependencies:**
    Install all the required packages using npm.
    ```bash
    npm install
    ```

3.  **Environment Variables**
    If the application requires any secret keys or environment-specific settings, create a `.env.local` file in the root of your project. For example:
    ```
    SOME_API_KEY="your-secret-value"
    ```
    This project does not currently require any environment variables to run.

### Running the Application

There are two ways to run the application:

#### 1. Development Mode

This mode is great for testing and development as it will automatically reload the app when you make code changes.

```bash
npm run dev
```

By default, the application will be available at `http://localhost:9002`. If you are running this on a remote server, you may need to configure a firewall or reverse proxy to access it from your browser.

#### 2. Production Mode

For a production deployment, you'll want to build the app first and then start it. This is more performant.

```bash
# 1. Build the application for production
npm run build

# 2. Start the production server
npm run start
```

This will start the server, typically on port 3000. You can now access your application at `http://your-server-ip:3000`. For a real deployment, it's recommended to use a process manager like `pm2` and a reverse proxy like Nginx to keep your application running and accessible.
