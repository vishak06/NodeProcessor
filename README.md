# srm-bfhl

A full-stack application to process directed graph edges, build hierarchies, detect cycles, and identify duplicate and invalid edges.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd srm-bfhl/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update Identity Details:
   Open `processor.js` and replace the placeholder variables at the top of `processData` with your actual details:
   - `user_id`
   - `email_id`
   - `college_roll_number`
4. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:3000` by default.

### Frontend
1. The frontend is a static HTML file. Navigate to the `frontend` directory:
   ```bash
   cd srm-bfhl/frontend
   ```
2. Open `index.html` in any modern web browser.
3. Enter your edge data and submit. Make sure the API Base URL points to your running backend (e.g., `http://localhost:3000`).

## Deployment

### Deploy Backend to Render
1. Create a new Web Service on [Render](https://render.com/).
2. Connect your GitHub repository.
3. Set the Root Directory to `backend` (or leave empty if you split repos, but you can configure the build setting).
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Deploy the application and copy the deployed service URL.

### Deploy Frontend to Netlify
1. Create a new site on [Netlify](https://netlify.com/) by dragging and dropping the `frontend` folder, or by connecting your repository.
2. If connecting a repo, set the Publish directory to `frontend`.
3. Once deployed, open the live frontend site and enter your Render backend URL in the "API Base URL" input field before submitting data.
