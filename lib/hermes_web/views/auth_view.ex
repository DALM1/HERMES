defmodule HermesWeb.AuthView do
  use HermesWeb, :view
  alias HermesWeb.UserView

  def render("register.json", %{user: user, token: token}) do
    %{
      user: UserView.render("user.json", %{user: user}),
      token: token
    }
  end

  def render("login.json", %{user: user, token: token}) do
    %{
      user: UserView.render("user.json", %{user: user}),
      token: token
    }
  end
  
  def render("logout.json", %{message: message}) do
    %{message: message}
  end

  def render("error.json", %{message: message}) do
    %{error: message}
  end
end