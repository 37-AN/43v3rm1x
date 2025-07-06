# DJ Platform MVP

A modern DJ platform built with React, TypeScript, and Tailwind CSS, featuring AI-enhanced mixing capabilities and blockchain integration.

## Features

- 🎵 AI-powered BPM synchronization
- 🎛️ Dual-deck mixing interface
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Real-time waveform visualization
- 🔗 Blockchain integration for token rewards
- 🎧 Crossfader controls
- 📚 AI-curated track library

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Create React App

## Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd 43v3rm1x
   ```

2. **Install dependencies**
   ```bash
   cd dj-platform
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Deployment on Render

This project is configured for automatic deployment on Render. Here's how to set it up:

### 1. Connect Your Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Static Site"
3. Connect your GitHub/GitLab repository
4. Select the repository containing this project

### 2. Configure Build Settings

The following settings are already configured in `render.yaml`:

- **Build Command**: `cd dj-platform && npm install && npm run build`
- **Publish Directory**: `dj-platform/build`
- **Node Version**: 18.17.0
- **Auto Deploy**: Enabled
- **Branch**: main

### 3. Environment Variables (Optional)

If you need to add environment variables:
- Go to your service settings in Render
- Navigate to "Environment" tab
- Add any required environment variables

### 4. Deploy

1. Click "Create Static Site"
2. Render will automatically build and deploy your application
3. Your app will be available at the provided URL

## Automatic Updates

Once deployed, your application will automatically update whenever you:

1. Push changes to the `main` branch
2. Render detects the changes and triggers a new build
3. The new version is deployed automatically

## Project Structure

```
43v3rm1x/
├── dj-platform/          # React application
│   ├── src/             # Source code
│   ├── public/          # Static assets
│   ├── package.json     # Dependencies and scripts
│   └── tsconfig.json    # TypeScript configuration
├── render.yaml          # Render deployment configuration
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## Available Scripts

In the `dj-platform` directory:

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to your branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 