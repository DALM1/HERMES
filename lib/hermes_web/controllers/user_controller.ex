defmodule HermesWeb.UserController do
  use HermesWeb, :controller

  alias Hermes.Accounts
  alias Hermes.Accounts.User

  action_fallback HermesWeb.FallbackController

  def index(conn, params) do
    criteria = [
      username: Map.get(params, "username"),
      email: Map.get(params, "email"),
      is_online: Map.get(params, "is_online")
    ]
    |> Enum.filter(fn {_, v} -> v != nil end)

    users = Accounts.list_users(criteria)
    render(conn, "index.json", users: users)
  end

  def show(conn, %{"id" => id}) do
    with %User{} = user <- Accounts.get_user(id) do
      render(conn, "show.json", user: user)
    end
  end

  # Modifiez la fonction update pour gérer le cas "me"
  def update(conn, %{"id" => "me"} = params) do
    current_user = Guardian.Plug.current_resource(conn)
    update_user(conn, current_user, params)
  end

  def update(conn, %{"id" => id} = params) do
    with {user_id, _} <- Integer.parse(id),
         user <- Accounts.get_user(user_id),
         true <- !is_nil(user) do
      update_user(conn, user, params)
    else
      _ ->
        conn
        |> put_status(:not_found)
        |> put_view(HermesWeb.ErrorView)  # Changed from render(ErrorView, ...) to put_view + render
        |> render("404.json", message: "User not found")
    end
  end

  defp update_user(conn, user, params) do
    with {:ok, updated_user} <- Accounts.update_user(user, params["user"]) do
      render(conn, "show.json", user: updated_user)
    else
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> put_view(HermesWeb.ErrorView)  # Changed from render(ErrorView, ...) to put_view + render
        |> render("error.json", changeset: changeset)
    end
  end

  def me(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    render(conn, "show.json", user: user)
  end
end