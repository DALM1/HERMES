defmodule Hermes.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      Hermes.Repo,
      # Start the Telemetry supervisor
      HermesWeb.Telemetry,
      # Start the PubSub system
      {Phoenix.PubSub, name: Hermes.PubSub},
      # Start the Endpoint (http/https)
      HermesWeb.Endpoint
      # Start a worker by calling: Hermes.Worker.start_link(arg)
      # {Hermes.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for more information about the supervision tree.
    opts = [strategy: :one_for_one, name: Hermes.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    HermesWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
