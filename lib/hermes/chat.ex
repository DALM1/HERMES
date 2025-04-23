defmodule Hermes.Chat do
  import Ecto.Query, warn: false
  alias Hermes.Repo
  alias Hermes.Chat.{Conversation, ConversationMember, Message, Reaction}

  # Conversations
  def get_conversation(id), do: Repo.get(Conversation, id)

  def create_conversation(attrs \\ %{}, member_ids) do
    now = DateTime.utc_now() |> DateTime.truncate(:second)

    Repo.transaction(fn ->
      with {:ok, conversation} <- %Conversation{} |> Conversation.changeset(attrs) |> Repo.insert() do
        # Add members to the conversation
        members = Enum.map(member_ids, fn user_id ->
          %ConversationMember{
            conversation_id: conversation.id,
            user_id: user_id,
            role: if(user_id == hd(member_ids), do: "admin", else: "member"),
            joined_at: now
          }
          |> ConversationMember.changeset(%{})
          |> Repo.insert!()
        end)

        %{conversation: conversation, members: members}
      else
        error -> Repo.rollback(error)
      end
    end)
  end

  def update_conversation(%Conversation{} = conversation, attrs) do
    conversation
    |> Conversation.changeset(attrs)
    |> Repo.update()
  end

  def list_conversations_for_user(user_id, limit \\ 20) do
    query = from c in Conversation,
      join: cm in ConversationMember, on: cm.conversation_id == c.id,
      where: cm.user_id == ^user_id,
      order_by: [desc: c.last_message_at],
      limit: ^limit,
      preload: [conversation_members: :user]

    Repo.all(query)
  end

  # Conversation Members
  def add_member_to_conversation(conversation_id, user_id, role \\ "member") do
    %ConversationMember{}
    |> ConversationMember.changeset(%{
      conversation_id: conversation_id,
      user_id: user_id,
      role: role,
      joined_at: DateTime.utc_now()
    })
    |> Repo.insert()
  end

  def remove_member_from_conversation(conversation_id, user_id) do
    from(cm in ConversationMember,
      where: cm.conversation_id == ^conversation_id and cm.user_id == ^user_id)
    |> Repo.delete_all()
  end

  def update_member_role(conversation_id, user_id, new_role) do
    from(cm in ConversationMember,
      where: cm.conversation_id == ^conversation_id and cm.user_id == ^user_id)
    |> Repo.one()
    |> ConversationMember.changeset(%{role: new_role})
    |> Repo.update()
  end

  def update_last_read(conversation_id, user_id) do
    from(cm in ConversationMember,
      where: cm.conversation_id == ^conversation_id and cm.user_id == ^user_id)
    |> Repo.one()
    |> ConversationMember.changeset(%{last_read_at: DateTime.utc_now()})
    |> Repo.update()
  end

  # Messages
  def get_message(id), do: Repo.get(Message, id)

  def create_message(attrs \\ %{}) do
    %Message{}
    |> Message.changeset(attrs)
    |> Repo.insert()
    |> case do
      {:ok, message} ->
        # Update conversation's last_message_at
        # Convertir la date en DateTime UTC et tronquer les microsecondes
        utc_now = DateTime.utc_now() |> DateTime.truncate(:second)
        
        from(c in Conversation, where: c.id == ^message.conversation_id)
        |> Repo.one()
        |> Ecto.Changeset.change(%{last_message_at: utc_now})
        |> Repo.update()
    
        {:ok, message}
      error ->
        error
    end
  end

  def update_message(%Message{} = message, attrs) do
    message
    |> Message.edit_changeset(attrs)
    |> Repo.update()
  end

  def delete_message(%Message{} = message) do
    message
    |> Message.delete_changeset()
    |> Repo.update()
  end

  def list_messages(conversation_id, limit \\ 50, before_id \\ nil) do
    query = from m in Message,
      where: m.conversation_id == ^conversation_id,
      order_by: [desc: m.inserted_at],
      limit: ^limit,
      preload: [:user, :reactions]

    query = if before_id do
      before_message = Repo.get(Message, before_id)
      from m in query, where: m.inserted_at < ^before_message.inserted_at
    else
      query
    end

    Repo.all(query)
  end

  # Reactions
  def add_reaction(message_id, user_id, emoji) do
    %Reaction{}
    |> Reaction.changeset(%{
      message_id: message_id,
      user_id: user_id,
      emoji: emoji
    })
    |> Repo.insert()
  end

  def remove_reaction(message_id, user_id, emoji) do
    from(r in Reaction,
      where: r.message_id == ^message_id and r.user_id == ^user_id and r.emoji == ^emoji)
    |> Repo.delete_all()
  end

  def list_reactions(message_id) do
    from(r in Reaction,
      where: r.message_id == ^message_id,
      preload: [:user])
    |> Repo.all()
  end

  # Add this function to your Chat module if it doesn't exist already
  def is_member?(conversation, user_id, role \\ nil) do
    # Ensure conversation_members is loaded
    conversation = 
      if Ecto.assoc_loaded?(conversation.conversation_members) do
        conversation
      else
        Repo.preload(conversation, :conversation_members)
      end
    
    # Check if user is a member with the specified role (if any)
    Enum.any?(conversation.conversation_members, fn member ->
      member.user_id == user_id && (is_nil(role) || member.role == role)
    end)
  end

  # Supprimez tous ces commentaires et la deuxième définition de update_last_read
  # Gardez uniquement la première définition à la ligne 76

  # Add this function if you need to delete conversations
  def delete_conversation(%Conversation{} = conversation) do
    Repo.delete(conversation)
  end
end
