# CRM System - Zoony & Nawras

A modern, multi-branch CRM system built with Next.js and Nx monorepo architecture for international operations.

## 🚀 Features

- **Contact Management**: Efficiently manage customer relationships
- **Analytics & Reports**: Track performance with detailed analytics
- **Multi-Branch Support**: Handle multiple branches and international operations
- **Modern UI**: Built with Tailwind CSS and responsive design
- **Real-time Data**: Powered by Supabase backend

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Monorepo**: Nx workspace
- **Backend**: Supabase
- **Deployment**: DigitalOcean App Platform

## 📁 Project Structure

```
CRM_NAWRAS_NEW/
├── apps/
│   └── web/                 # Next.js web application
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # Reusable components
│       │   ├── lib/         # Utility libraries
│       │   └── styles/      # Global styles
│       ├── package.json
│       ├── next.config.js
│       ├── tailwind.config.js
│       └── tsconfig.json
├── .do/
│   └── app.yaml            # DigitalOcean deployment config
├── nx.json                 # Nx workspace configuration
├── package.json            # Root package.json
└── README.md
```

## 🚀 Deployment

### DigitalOcean App Platform

This repository is configured for automatic deployment on DigitalOcean App Platform.

1. **Connect Repository**: Link this GitHub repository to your DigitalOcean app
2. **Environment Variables**: Configure the following environment variables:
   - `NODE_ENV=production`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Auto-Deploy**: The app will automatically deploy on every push to the `main` branch

### Build Commands

- **Build**: `npm install && cd apps/web && npm run build`
- **Start**: `cd apps/web && npm start`
- **Port**: 3000

## 🔧 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Local Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Mr-Taha-1/CRM_NAWRAS_NEW.git
   cd CRM_NAWRAS_NEW
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. Start development server:
   ```bash
   cd apps/web
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is proprietary software for Zoony & Nawras operations.

## 🆘 Support

For support and questions, please contact the development team.

---

**Status**: ✅ Ready for Production Deployment

**Last Updated**: June 2025