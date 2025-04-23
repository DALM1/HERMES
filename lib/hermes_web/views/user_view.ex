defmodule HermesWeb.UserView do
  use HermesWeb, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, __MODULE__, "user.json")}
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, __MODULE__, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{
      id: user.id,
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      bio: user.bio,
      profile_picture: user.profile_picture,
      is_online: user.is_online,
      last_seen_at: user.last_seen_at
    }
  end
end