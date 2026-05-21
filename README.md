# Yaser Portfolio

This is a Next.js App Router portfolio site with:

- Home page storytelling sections (hero, experience timeline, featured projects, skills, contact)
- Full portfolio listing at `/portfolio`
- Project detail pages at `/portfolio/[slug]`
- Data-driven projects loaded from local JSON to support regular manual updates

## Local Development

```bash
npm run dev
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Project Data Refresh (Manual Google Sheet Workflow)

The portfolio project list is sourced from [src/data/projects.json](src/data/projects.json) and typed in [src/data/projects.ts](src/data/projects.ts).

### Refresh Steps

1. Open the Google Sheet and export the project tab as CSV.
2. Update [src/data/projects.json](src/data/projects.json) with the latest rows.
3. Keep each item consistent with this schema:
	- `id` (string, unique)
	- `slug` (string, unique, URL-safe)
	- `title` (string)
	- `summary` (string)
	- `description` (string)
	- `impact` (string)
	- `technologies` (string[])
	- `themes` (string[])
	- `company` (string, optional)
	- `period` (string, optional)
	- `featured` (boolean)
	- `links` (`demo`, `repo`, `article` optional)
4. Run lint/build checks.
5. Review `/` and `/portfolio` visually.

### Notes

- Duplicate slugs will fail build validation.
- Missing optional fields are safely handled with fallbacks.
