# Content Report UI

A Next.js 16 dashboard application for monitoring CloudFuze migration jobs, workspaces, and file statistics with real-time data from MongoDB.

## Features

- 📊 **Dashboard**: Real-time statistics and charts for jobs, workspaces, and files
- 💼 **Jobs Management**: View and track migration jobs with detailed workspace information
- 📁 **File Details**: Comprehensive file and folder information tracking
- ⚠️ **Conflicts Breakdown**: Detailed conflict analysis and retry management
- 🔄 **Real-time Data**: Direct MongoDB integration for live data updates

## Tech Stack

- **Framework**: Next.js 16 with React 19
- **Language**: TypeScript
- **Database**: MongoDB
- **Charts**: Highcharts & Recharts
- **Icons**: Lucide React
- **Styling**: CSS Modules

## Getting Started

### Prerequisites

- Node.js 20+
- MongoDB connection string

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SudityaSenaNimmala/reportsui.git
cd reportsui
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Render

### Option 1: Using Render Dashboard (Recommended)

1. **Create a new Web Service** on [Render](https://render.com)

2. **Connect your GitHub repository**: `https://github.com/SudityaSenaNimmala/reportsui.git`

3. **Configure the service**:
   - **Name**: `content-report-ui` (or your preferred name)
   - **Region**: Choose your preferred region
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free or paid tier

4. **Add Environment Variables**:
   - Click "Environment" tab
   - Add: `MONGODB_URI` = `your_mongodb_connection_string`

5. **Deploy**: Click "Create Web Service"

### Option 2: Using render.yaml (Auto-deploy)

The repository includes a `render.yaml` file for automatic configuration. Just connect your repo and Render will auto-detect the settings.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |

## Project Structure

```
content_report_ui/
├── src/
│   ├── app/
│   │   ├── Dashboard/         # Main dashboard page
│   │   ├── Jobs/              # Jobs management page
│   │   ├── FileDetails/       # File details page
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # MongoDB configuration
│   └── types/                 # TypeScript types
├── scripts/                   # Database exploration scripts
└── public/                    # Static assets
```

## API Endpoints

- `/api/dashboard/stats` - Dashboard statistics
- `/api/dashboard/charts` - Chart data
- `/api/jobs` - Jobs list
- `/api/jobs/[jobName]` - Specific job details
- `/api/workspace/[workspaceId]/*` - Workspace endpoints

## Database Collections

- `MoveJobDetails` - Migration job information
- `MoveWorkSpaces` - Workspace details
- `FileFolderInfo` - File and folder data
- `HyperLinks` - Hyperlink tracking
- `CollabarationDetails` - Collaboration information
- `PermissionQueue` - Permission management

## Scripts

Utility scripts for database exploration:

```bash
node scripts/explore-db.js           # Explore database structure
node scripts/fetch-conflicts.js      # Fetch conflict records
node scripts/extract-keywords.js     # Analyze conflict patterns
```

## License

Private - CloudFuze Internal Tool

## Support

For issues or questions, contact the development team.
