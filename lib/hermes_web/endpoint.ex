defmodule HermesWeb.Endpoint do
  use Phoenix.Endpoint, otp_app: :hermes

  # The session will be stored in the cookie and signed,
  # this means its contents can be read but not tampered with.
  # Set :encryption_salt if you would also like to encrypt it.
  @session_options [
    store: :cookie,
    key: "_hermes_key",
    signing_salt: "YOUR_SIGNING_SALT"
  ]

  socket "/socket", HermesWeb.UserSocket,
    websocket: true,
    longpoll: false

  # Serve at "/" the static files from "priv/static" directory.
  plug Plug.Static,
    at: "/",
    from: :hermes,
    gzip: false,
    only: ~w(css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    plug Phoenix.CodeReloader
    plug Phoenix.Ecto.CheckRepoStatus, otp_app: :hermes
  end

  plug Plug.RequestId
  plug Plug.Telemetry, event_prefix: [:phoenix, :endpoint]

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Phoenix.json_library()

  # Configuration CORS correcte
  plug CORSPlug,
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    headers: ["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"],
    credentials: true,
    max_age: 86400
    
  plug Plug.MethodOverride
  plug Plug.Head
  plug Plug.Session, @session_options
  # Suppression du second CORSPlug redondant
  plug HermesWeb.Router
end
