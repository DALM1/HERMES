import Config

# Configure your database
config :hermes, Hermes.Repo,
  database: "hermes_test#{System.get_env("MIX_TEST_PARTITION")}",
  username: "postgres",
  password: "postgres",
  hostname: "localhost",
  pool: Ecto.Adapters.SQL.Sandbox,
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :hermes, HermesWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "TEST_SECRET_KEY_HERE",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# In test we don't send emails.
config :hermes, Hermes.Mailer, adapter: Swoosh.Adapters.Test