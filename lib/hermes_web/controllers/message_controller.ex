defmodule HermesWeb.MessageController do
  use HermesWeb, :controller
  alias Hermes.Chat
  alias Hermes.Chat.Message  # Add this line to alias the Message struct
  alias Hermes.Guardian

  action_fallback HermesWeb.FallbackController

  def create(conn, %{"conversation_id" => conversation_id, "message" => message_params}) do
    user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(conversation_id)
    
    if conversation && Chat.is_member?(conversation, user.id) do
      # Ajouter l'ID de l'utilisateur et de la conversation aux paramètres du message
      message_params = Map.merge(message_params, %{
        "user_id" => user.id,
        "conversation_id" => String.to_integer(conversation_id)
      })
      
      case Chat.create_message(message_params) do
        {:ok, message} ->
          # Mettre à jour la date du dernier message dans la conversation
          Chat.update_conversation(conversation, %{last_message_at: DateTime.utc_now() |> DateTime.truncate(:second)})
          
          conn
          |> put_status(:created)
          |> render("show.json", message: message)
        {:error, changeset} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render("error.json", changeset: changeset)
      end
    else
      conn
      |> put_status(:forbidden)
      |> json(%{error: "You don't have access to this conversation"})
    end
  end

  def update(conn, %{"id" => id, "message" => message_params}) do
    user = Guardian.Plug.current_resource(conn)
    message = Chat.get_message(id)

    if message && message.user_id == user.id do
      with {:ok, %Message{} = message} <- Chat.update_message(message, message_params) do
        render(conn, "show.json", message: message)
      end
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have permission to update this message")
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    message = Chat.get_message(id)
    
    if message && message.user_id == user.id do
      with {:ok, %Message{}} <- Chat.delete_message(message) do
        send_resp(conn, :no_content, "")
      end
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have permission to delete this message")
    end
  end

  def index(conn, %{"conversation_id" => conversation_id}) do
    user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(conversation_id)
    
    if conversation && Chat.is_member?(conversation, user.id) do
      messages = Chat.list_messages(conversation_id)
      render(conn, "index.json", messages: messages)
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have access to this conversation")
    end
  end

  def add_reaction(conn, %{"id" => message_id, "reaction" => reaction_params}) do
    user = Guardian.Plug.current_resource(conn)
    message = Chat.get_message(message_id)
    
    if message do
      conversation = Chat.get_conversation(message.conversation_id)
      
      if Chat.is_member?(conversation, user.id) do
        # Extraire les paramètres nécessaires
        emoji = Map.get(reaction_params, "emoji")
        
        # Appeler add_reaction avec les 3 paramètres attendus
        with {:ok, reaction} <- Chat.add_reaction(message_id, user.id, emoji) do
          conn
          |> put_status(:created)
          |> render("reaction.json", reaction: reaction)
        end
      else
        conn
        |> put_status(:forbidden)
        |> put_view(HermesWeb.ErrorView)
        |> render("403.json", message: "You don't have access to this conversation")
      end
    else
      conn
      |> put_status(:not_found)
      |> put_view(HermesWeb.ErrorView)
      |> render("404.json", message: "Message not found")
    end
  end

  def remove_reaction(conn, %{"id" => message_id, "emoji" => emoji}) do
    user = Guardian.Plug.current_resource(conn)
    
    case Chat.remove_reaction(message_id, user.id, emoji) do
      {:ok, _} -> 
        send_resp(conn, :no_content, "")
      {:error, :not_found} ->
        conn
        |> put_status(:not_found)
        |> put_view(HermesWeb.ErrorView)
        |> render("404.json", message: "Reaction not found")
    end
  end
end