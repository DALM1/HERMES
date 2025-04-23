defmodule HermesWeb.ReactionView do
  use HermesWeb, :view
  alias HermesWeb.UserView

  def render("reaction.json", %{reaction: reaction}) do
    %{
      id: reaction.id,
      emoji: reaction.emoji,
      user: if(Ecto.assoc_loaded?(reaction.user), do: UserView.render("user.json", %{user: reaction.user}))
    }
  end
end