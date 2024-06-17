#!/usr/bin/env bash

# Read project ref from .env
get_env_var() {
  local var_name=$1
  local var_value=$(grep "^${var_name}=" .env | cut -d '=' -f2-)
  echo $var_value
}

PROJECT_REF=$(get_env_var PROJECT_REF)

# If PROJECT_REF is not set, ask user for it
if [ -z "$PROJECT_REF" ]; then
  read -p "Enter value for PROJECT_REF: " PROJECT_REF
fi

# Login
npx supabase login

# Init
npx supabase init

# Generate types 
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > src/data/schema.ts