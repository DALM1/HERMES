defmodule HermesWeb.AuthController do
  use HermesWeb, :controller
  
  alias Hermes.Accounts
  alias Hermes.Guardian
  
  def register(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        
        conn
        |> put_status(:created)
        |> render("register.json", %{user: user, token: token})
        
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render("error.json", %{message: format_errors(changeset)})
    end
  end
  
  def login(conn, %{"user" => %{"email" => email, "password" => password}}) do
    case Accounts.authenticate_user(email, password) do
      {:ok, user} ->
        {:ok, token, _claims} = Guardian.encode_and_sign(user)
        
        conn
        |> put_status(:ok)
        |> render("login.json", %{user: user, token: token})
        
      {:error, reason} ->
        conn
        |> put_status(:unauthorized)
        |> render("error.json", %{message: reason})
    end
  end
  
  defp format_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {msg, opts} ->
      Enum.reduce(opts, msg, fn {key, value}, acc ->
        String.replace(acc, "%{#{key}}", to_string(value))
      end)
    end)
  end
end