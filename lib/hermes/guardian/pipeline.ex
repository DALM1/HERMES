defmodule Hermes.Guardian.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :hermes,
    module: Hermes.Guardian,
    error_handler: Hermes.Guardian.ErrorHandler

  plug Guardian.Plug.VerifyHeader, scheme: "Bearer"  # Changé de realm à scheme
  plug Guardian.Plug.LoadResource, allow_blank: true
end