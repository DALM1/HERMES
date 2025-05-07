defmodule HermesWeb.PostController do
  use HermesWeb, :controller

  def index(conn, _params) do
    # Remplacez ceci par votre logique réelle pour récupérer les posts
    posts = [
      %{id: 1, title: "Premier post", content: "Contenu du premier post"},
      %{id: 2, title: "Deuxième post", content: "Contenu du deuxième post"}
    ]

    conn
    |> put_resp_header("access-control-allow-origin", "http://localhost:5173")
    |> put_resp_header("access-control-allow-methods", "GET, POST, PUT, DELETE, OPTIONS")
    |> put_resp_header("access-control-allow-headers", "*")
    |> json(%{data: posts})
  end
end