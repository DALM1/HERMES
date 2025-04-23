defmodule HermesWeb.ConversationChannel do
  use Phoenix.Channel
  alias Hermes.Chat
  # Remove the unused alias since we're using the fully qualified name
  alias Hermes.Chat.{Message, Conversation, ConversationMember}

  def join("conversation:" <> conversation_id, _params, socket) do
    user = socket.assigns.current_user
    
    case Chat.get_conversation(conversation_id) do
      %Conversation{} = conversation ->
        if is_member?(conversation, user.id) do
          {:ok, assign(socket, :conversation_id, conversation_id)}
        else
          {:error, %{reason: "unauthorized"}}
        end
      nil ->
        {:error, %{reason: "not found"}}
    end
  end

  def handle_in("new_message", %{"content" => content, "content_type" => content_type}, socket) do
    user = socket.assigns.current_user
    conversation_id = socket.assigns.conversation_id
    
    message_params = %{
      conversation_id: conversation_id,
      user_id: user.id,
      content: content,
      content_type: content_type
    }
    
    case Chat.create_message(message_params) do
      {:ok, message} ->
        message = Hermes.Repo.preload(message, [:user])
        broadcast!(socket, "new_message", %{
          message: HermesWeb.MessageView.render("message.json", %{message: message})
        })
        {:reply, :ok, socket}
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  def handle_in("edit_message", %{"id" => id, "content" => content}, socket) do
    user = socket.assigns.current_user
    
    with %Message{} = message <- Chat.get_message(id),
         true <- message.user_id == user.id,
         {:ok, updated_message} <- Chat.update_message(message, %{content: content}) do
      updated_message = Hermes.Repo.preload(updated_message, [:user])
      broadcast!(socket, "message_updated", %{
        message: HermesWeb.MessageView.render("message.json", %{message: updated_message})
      })
      {:reply, :ok, socket}
    else
      false -> {:reply, {:error, %{reason: "unauthorized"}}, socket}
      nil -> {:reply, {:error, %{reason: "not found"}}, socket}
      {:error, changeset} -> {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  defp is_member?(%Conversation{conversation_members: members}, user_id) do
    Enum.any?(members, fn member -> member.user_id == user_id end)
  end
  
  defp is_member?(%Conversation{id: id}, user_id) do
    case Hermes.Repo.get_by(ConversationMember, conversation_id: id, user_id: user_id) do
      nil -> false
      _ -> true
    end
  end
end