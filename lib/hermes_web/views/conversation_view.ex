defmodule HermesWeb.ConversationView do
  use HermesWeb, :view
  alias HermesWeb.ConversationView
  alias HermesWeb.UserView

  def render("index.json", %{conversations: conversations}) do
    %{data: render_many(conversations, ConversationView, "conversation.json")}
  end

  def render("show.json", %{conversation: conversation}) do
    %{data: render_one(conversation, ConversationView, "conversation.json")}
  end

  def render("conversation.json", %{conversation: conversation}) do
    members = if Ecto.assoc_loaded?(conversation.conversation_members) do
      Enum.map(conversation.conversation_members, fn member ->
        # Ajout de l'utilisateur si disponible
        user_data = if Ecto.assoc_loaded?(member.user) do
          UserView.render("user.json", %{user: member.user})
        else
          %{id: member.user_id}
        end
        
        %{
          user: user_data,
          role: member.role,
          joined_at: member.joined_at,
          last_read_at: member.last_read_at,
          is_muted: member.is_muted,
          is_pinned: member.is_pinned
        }
      end)
    else
      []
    end

    %{
      id: conversation.id,
      name: conversation.name,
      description: conversation.description,
      is_group: conversation.is_group,
      avatar: conversation.avatar,
      last_message_at: conversation.last_message_at,
      type: conversation.type,
      inserted_at: conversation.inserted_at,
      updated_at: conversation.updated_at,
      members: members
    }
  end

  # Add this function to handle the member_added.json template
  def render("member_added.json", %{message: message}) do
    %{
      success: true,
      message: message
    }
  end

  # Add this function to handle errors when adding members
  def render("member_error.json", %{message: message}) do
    %{
      success: false,
      message: message
    }
  end
end