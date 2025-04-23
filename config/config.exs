import Config

config :hermes, Hermes.Guardian,
  issuer: "hermes",
  secret_key: "oSsfkhminK67Afwgw44Vl2ZWdqf6Nt6jF4R2CVfoMwjBxeBFDTlIG+puEMtYLeyy"

config :hermes, Hermes.Repo,
  database: "hermes_dev",
  username: "postgres",
  password: "postgres",
  hostname: "localhost"

config :hermes, ecto_repos: [Hermes.Repo]

import_config "#{config_env()}.exs"
