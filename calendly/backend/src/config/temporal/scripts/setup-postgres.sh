
#!/bin/sh
set -eu

# Validate required environment variables
: "${POSTGRES_SEEDS:?ERROR: POSTGRES_SEEDS environment variable is required}"
: "${POSTGRES_USER:?ERROR: POSTGRES_USER environment variable is required}"

DB_PORT="${DB_PORT:-5432}"

echo "Starting PostgreSQL schema setup..."
echo "Waiting for PostgreSQL port to be available..."

# Wait for PostgreSQL to accept connections
until nc -z -w 2 "${POSTGRES_SEEDS}" "${DB_PORT}"; do
  echo "PostgreSQL is not ready yet; retrying..."
  sleep 2
done

echo "PostgreSQL port is available."

# Create and set up the Temporal database
temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal create

temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal setup-schema -v 0.0

temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal update-schema \
  -d /etc/temporal/schema/postgresql/v12/temporal/versioned

# Create and set up the Temporal visibility database
temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal_visibility create

temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal_visibility setup-schema -v 0.0

temporal-sql-tool \
  --plugin postgres12 \
  --ep "${POSTGRES_SEEDS}" \
  -u "${POSTGRES_USER}" \
  -p "${DB_PORT}" \
  --db temporal_visibility update-schema \
  -d /etc/temporal/schema/postgresql/v12/visibility/versioned

echo "PostgreSQL schema setup complete."
