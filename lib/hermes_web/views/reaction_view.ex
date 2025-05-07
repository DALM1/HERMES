defmodule HermesWeb.ReactionView do
  use HermesWeb, :view
  alias HermesWeb.UserView

  def render("reaction.json", %{reaction: reaction}) do
    user = if Ecto.assoc_loaded?(reaction.user), do: render_one(reaction.user, UserView, "user.json"), else: nil
    
    %{
      id: reaction.id,
      emoji: reaction.emoji,
      user_id: reaction.user_id,
      message_id: reaction.message_id,
      user: user,
      inserted_at: reaction.inserted_at
    }
  end
end