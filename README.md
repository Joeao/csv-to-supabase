# csv-to-supabase

Tool to migrate data from CSV to Supabase

It's not scoped for the project to be flexible enough to work for any project.
But we'll see

1. Copy .env.dev to .env
2. Update .env values
3. Install packages
4. Generate types (Instructions for remote development - if local check
   [Docs](https://supabase.com/docs/guides/api/rest/generating-types))
   - Give permissions to ./_scripts/generate-types.sh
   - Run `generate-types` script [Note: Errors may be displayed if Supabase
     already initiated - ignore them]
5. Run `dev` script to launch UI
