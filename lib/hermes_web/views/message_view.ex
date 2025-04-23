defmodule HermesWeb.MessageView do
  use HermesWeb, :view
  alias HermesWeb.MessageView
  alias HermesWeb.UserView
  alias HermesWeb.ReactionView

  def render("index.json", %{messages: messages}) do
    %{data: render_many(messages, MessageView, "message.json")}
  end

  def render("show.json", %{message: message}) do
    %{data: render_one(message, MessageView, "message.json")}
  end

  def render("message.json", %{message: message}) do
    user = if Ecto.assoc_loaded?(message.user), do: render_one(message.user, UserView, "user.json"), else: nil
    reactions = if Ecto.assoc_loaded?(message.reactions), do: render_many(message.reactions, ReactionView, "reaction.json"), else: []

    %{
      id: message.id,
      content: message.content,
      content_type: message.content_type,
      metadata: message.metadata,
      is_edited: message.is_edited,
      edited_at: message.edited_at,
      is_deleted: message.is_deleted,
      reply_to_id: message.reply_to_id,
      conversation_id: message.conversation_id,
      user: user,
      reactions: reactions,
      inserted_at: message.inserted_at,
      updated_at: message.updated_at
    }
  end

  def render("reaction.json", %{reaction: reaction}) do
    %{data: render_one(reaction, ReactionView, "reaction.json")}
  end
end