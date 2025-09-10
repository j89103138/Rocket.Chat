# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a customized Rocket.Chat installation designed for enterprise deployment with branding removal and workspace registration restrictions eliminated. The project is built on a monorepo architecture using Turbo for build orchestration.

## Architecture

**Monorepo Structure:**
- `apps/meteor/` - Main Meteor application (primary codebase)
- `packages/` - Shared packages and utilities
- `ee/` - Enterprise Edition specific code
- Yarn workspaces for dependency management
- Turbo for build orchestration across packages

**Core Technologies:**
- Meteor.js framework with TypeScript
- React 18 with hooks
- MongoDB with custom ORM (@rocket.chat/models)
- Microservices architecture with message queues
- WebRTC for video conferencing

## Development Commands

**Build and Development:**
- `yarn dev` - Start development server (excludes legacy browser support)
- `yarn build` - Build all packages
- `yarn build:ci` - CI-specific build

**Testing:**
- `yarn testunit` - Run unit tests (client + server + definitions)
- `yarn testapi` - Run API tests
- `yarn test:e2e` - Run end-to-end tests with Playwright
- `yarn test` - Run all tests (unit + API)

**Code Quality:**
- `yarn lint` - Run ESLint and Stylelint
- `yarn typecheck` - TypeScript type checking
- `yarn eslint:fix` - Auto-fix ESLint issues
- `yarn stylelint:fix` - Auto-fix CSS issues

**Key Meteor Commands (in apps/meteor/):**
- `meteor` - Start development server
- `meteor build --server-only --directory /tmp/dist` - Production build

## Enterprise Customization Status

**Workspace Registration Removal (COMPLETED):**
- `apps/meteor/server/settings/general.ts:43` - `Show_Setup_Wizard` default changed from `'pending'` to `'completed'`
- `apps/meteor/server/startup/initialData.js:201,250` - Setup wizard completion logic modified
- Admin email verification bypass implemented in `initialData.js:39`

**Key Settings for Enterprise Customization:**
- `Site_Name` - Controls site name throughout UI (default: 'Rocket.Chat')
- `Show_Setup_Wizard` - Controls setup wizard flow ('completed' skips cloud registration)
- Layout settings for branding control (Enterprise features)

## Branding Removal Strategy

**Critical Files for Branding Removal:**

**High Priority:**
1. `apps/meteor/server/settings/general.ts:74` - Change `Site_Name` default
2. `apps/meteor/public/images/logo/` - Replace all logo assets
3. `packages/web-ui-registration/src/components/LoginPoweredBy.tsx` - Remove "Powered by Rocket.Chat"
4. `apps/meteor/server/startup/initialData.js:137` - Change default bot name from 'Rocket.Cat'

**Asset Locations:**
- `apps/meteor/public/images/logo/` - All logo files and favicons
- `apps/meteor/private/avatars/rocketcat.png` - Default bot avatar
- `apps/meteor/public/favicon.ico` - Main favicon

**UI Components:**
- Login templates: `packages/web-ui-registration/src/template/`
- Registration components: `packages/web-ui-registration/src/components/`
- Layout settings control branding visibility

## Settings System

**Settings Registry:** Located in `apps/meteor/server/settings/`
- `general.ts` - Core application settings
- `accounts.ts` - Authentication and user settings
- `layout.ts` - UI layout and branding controls
- `email.ts` - Email configuration

**Settings are organized hierarchically with groups and sections**

## Database Models

**Core Models:** `packages/models/src/`
- Users, Rooms, Messages, Settings, Roles
- Custom MongoDB adapter with TypeScript interfaces
- Model typings in `packages/model-typings/src/`

## Authentication Flow

**Key Files:**
- `apps/meteor/app/authentication/server/startup/index.js` - Login validation
- `apps/meteor/server/startup/initialData.js` - User initialization
- Admin users bypass email verification (line 426 in authentication startup)

## API Structure

- REST API endpoints in `apps/meteor/app/api/server/`
- GraphQL not primarily used
- Custom API client in `packages/api-client/`

## UI Architecture

- React components in `apps/meteor/client/`
- Fuselage design system (`@rocket.chat/fuselage`)
- Context-based state management
- UI packages: `packages/ui-*`

## Build System

- Turbo.json configuration for multi-package builds
- Meteor bundler for main application
- TypeScript compilation across packages
- Webpack for asset bundling

## Testing Strategy

- Jest for client-side unit tests
- Mocha for server-side tests
- Playwright for E2E testing
- API tests with Supertest

## Environment Configuration

**Required Environment Variables for Custom Deployment:**
- `ADMIN_PASS` - Initial admin password
- `ADMIN_EMAIL` - Admin email (automatically verified)
- `ADMIN_USERNAME` - Custom admin username
- `TEST_MODE` - Set to 'true' for test admin user
- `ROOT_URL` - Your custom domain URL

## Enterprise Features

**Layout Customization (Enterprise):**
- `Layout_Login_Hide_Logo` - Hide login page logo
- `Layout_Login_Hide_Title` - Hide login page title
- `Layout_Login_Hide_Powered_By` - Hide "Powered by" footer

## Common Development Patterns

**Adding New Settings:**
```typescript
await this.add('Setting_Name', 'default_value', {
    type: 'string',
    public: true,
    i18nDescription: 'Setting_Description'
});
```

**Database Operations:**
- Always use model classes from `@rocket.chat/models`
- TypeScript interfaces from `@rocket.chat/model-typings`
- Async/await pattern for all database calls

## Deployment Notes

- Use Docker for containerized deployment
- MongoDB required (version specified in package.json)
- Node.js 22.16.0 and Yarn 4.9.2 (see .volta)
- Environment variables must be set before first run
- Setup wizard bypass is automatic with current configuration

## Migration Scripts

- Located in `apps/meteor/server/startup/migrations/`
- Use `yarn migration:add` to create new migrations
- Migrations run automatically on startup

## Troubleshooting

**Common Issues:**
- Setup wizard appearing: Check `Show_Setup_Wizard` setting value
- Branding still visible: Check layout settings and asset replacement
- Email verification required: Verify admin email verification bypass
- Build failures: Check Node.js/Yarn versions match .volta specification

## Development Workflow

1. Install dependencies: `yarn install`
2. Start development: `yarn dev` (in root) or `meteor` (in apps/meteor)
3. Run tests before committing: `yarn testunit`
4. Lint code: `yarn lint`
5. Type check: `yarn typecheck`

**For Enterprise Customization:**
1. Replace assets in `apps/meteor/public/images/logo/`
2. Update `Site_Name` in settings
3. Modify branding components as needed
4. Test with `yarn dev` and ensure branding is removed
5. Build for production with `yarn build`