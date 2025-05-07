defmodule HermesWeb.ConversationView do
  use HermesWeb, :view
  alias HermesWeb.UserView

  # Group all render/2 functions together
  def render("index.json", %{conversations: conversations}) do
    %{data: render_many(conversations, HermesWeb.ConversationView, "conversation.json")}
  end

  def render("show.json", %{conversation: conversation}) do
    %{data: render_one(conversation, HermesWeb.ConversationView, "conversation.json")}
  end

  def render("error.json", %{message: message}) do
    %{error: message}
  end

  def render("public.json", %{conversations: conversations}) do
    %{
      conversations: render_many(conversations, __MODULE__, "conversation_with_stats.json")
    }
  end

  def render("conversation_with_stats.json", %{conversation: conversation}) do
    %{
      id: conversation.id,
      name: conversation.name,
      description: conversation.description,
      is_group: conversation.is_group,
      type: conversation.type,
      is_public: conversation.is_public,
      category: conversation.category,
      icon: conversation.icon,
      member_count: length(conversation.conversation_members),
      created_at: conversation.inserted_at
    }
  end

  def render("member_added.json", %{message: message}) do
    %{
      success: true,
      message: message
    }
  end

  def render("member_error.json", %{message: message}) do
    %{
      success: false,
      message: message
    }
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

    # Création d'un map de base avec les champs obligatoires
    base_map = %{
      id: conversation.id,
      name: conversation.name,
      description: conversation.description,
      is_group: conversation.is_group,
      last_message_at: conversation.last_message_at,
      type: conversation.type,
      inserted_at: conversation.inserted_at,
      updated_at: conversation.updated_at,
      members: members
    }
    
    # Ajout conditionnel des champs optionnels s'ils existent
    base_map
    |> add_if_exists(conversation, :avatar)
    |> add_if_exists(conversation, :icon)
    |> add_if_exists(conversation, :is_public)
    |> add_if_exists(conversation, :category)
  end

  # Fonction utilitaire pour ajouter un champ au map seulement s'il existe
  defp add_if_exists(map, struct, key) do
    if Map.has_key?(struct, key) do
      Map.put(map, key, Map.get(struct, key))
    else
      map
    end
  end
end