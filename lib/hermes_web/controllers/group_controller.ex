defmodule HermesWeb.GroupController do
  use HermesWeb, :controller

  def user_groups(conn, _params) do
    # Remplacez ceci par votre logique réelle pour récupérer les groupes de l'utilisateur
    groups = [
      %{id: 1, name: "Premier groupe"},
      %{id: 2, name: "Deuxième groupe"}
    ]

    conn
    |> put_resp_header("access-control-allow-origin", "http://localhost:5173")
    |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "*")
    |> json(%{data: groups})
  end
end