defmodule HermesWeb.ErrorView do
  use HermesWeb, :view

  def render("404.json", _assigns) do
    %{errors: %{detail: "Not Found"}}
  end

  def render("401.json", %{message: message}) do
    %{errors: %{detail: message}}
  end

  def render("403.json", %{message: message}) do
    %{errors: %{detail: message}}
  end

  def render("error.json", %{changeset: changeset}) do
    %{errors: translate_errors(changeset)}
  end

  def render("error.json", %{message: message}) do
    %{errors: %{detail: message}}
  end

  # Add this function to handle JSON parsing errors
  def render("400.json", %{reason: %Plug.Parsers.ParseError{}}) do
    %{errors: %{detail: "Invalid JSON format in request body"}}
  end

  def render("400.json", _assigns) do
    %{errors: %{detail: "Bad request"}}
  end

  # Add this function to handle server errors
  def render("500.json", %{reason: %{postgres: %{message: message}}}) do
    %{errors: %{detail: "Database error: #{message}"}}
  end

  def render("500.json", _assigns) do
    %{errors: %{detail: "Internal server error"}}
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end
end