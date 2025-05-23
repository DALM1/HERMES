defmodule HermesWeb.ConversationController do
  use HermesWeb, :controller

  alias Hermes.Chat
  alias Hermes.Chat.Conversation
  alias Hermes.Repo  # Add this line

  action_fallback HermesWeb.FallbackController

  def index(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    conversations = Chat.list_conversations_for_user(user.id)
    render(conn, "index.json", conversations: conversations)
  end

  def create(conn, %{"conversation" => conversation_params}) do
    user = Guardian.Plug.current_resource(conn)
    
    # Extract member_ids from params or default to just the current user
    member_ids = Map.get(conversation_params, "member_ids", [user.id])
    
    # Ensure the current user is included in member_ids
    member_ids = if Enum.member?(member_ids, user.id), do: member_ids, else: [user.id | member_ids]
    
    with {:ok, %{conversation: conversation}} <- Chat.create_conversation(conversation_params, member_ids) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", Routes.conversation_path(conn, :show, conversation))
      |> render("show.json", conversation: conversation)
    end
  end

  def show(conn, %{"id" => id}) do
    current_user = Guardian.Plug.current_resource(conn)
    
    case Chat.get_conversation(id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> render("error.json", %{message: "Conversation not found"})
        
      conversation ->
        # Preload the conversation_members association
        conversation = Repo.preload(conversation, [:conversation_members])
        
        if Chat.is_member?(conversation, current_user.id) do
          render(conn, "show.json", conversation: conversation)
        else
          conn
          |> put_status(:forbidden)
          |> render("error.json", %{message: "You don't have access to this conversation"})
        end
    end
  end

  def update(conn, %{"id" => id, "conversation" => conversation_params}) do
    user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(id)
    
    if conversation && Chat.is_member?(conversation, user.id, "admin") do
      with {:ok, %Conversation{} = conversation} <- Chat.update_conversation(conversation, conversation_params) do
        render(conn, "show.json", conversation: conversation)
      end
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have permission to update this conversation")
    end
  end

  def delete(conn, %{"id" => id}) do
    user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(id)
    
    if conversation && Chat.is_member?(conversation, user.id, "admin") do
      with {:ok, %Conversation{}} <- Chat.delete_conversation(conversation) do
        send_resp(conn, :no_content, "")
      end
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have permission to delete this conversation")
    end
  end

  def add_member(conn, %{"conversation_id" => conversation_id, "user_id" => user_id}) do
    current_user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(conversation_id)
    
    if conversation && Chat.is_member?(conversation, current_user.id, "admin") do
      # Check if the user is already a member
      if Chat.is_member?(conversation, user_id) do
        conn
        |> put_status(:unprocessable_entity)
        |> render("member_error.json", message: "User is already a member of this conversation")
      else
        with {:ok, _member} <- Chat.add_member_to_conversation(conversation_id, user_id) do
          conn
          |> put_status(:created)
          |> render("member_added.json", message: "Member added successfully")
        end
      end
    else
      conn
      |> put_status(:forbidden)
      |> put_view(HermesWeb.ErrorView)
      |> render("403.json", message: "You don't have permission to add members to this conversation")
    end
  end

  def remove_member(conn, %{"conversation_id" => conversation_id, "user_id" => user_id}) do
    current_user = Guardian.Plug.current_resource(conn)
    conversation = Chat.get_conversation(conversation_id)
    
    cond do
      !conversation ->
        conn
        |> put_status(:not_found)
        |> put_view(HermesWeb.ErrorView)
        |> render("404.json")
      
      # Allow users to remove themselves
      user_id == to_string(current_user.id) ->
        Chat.remove_member_from_conversation(conversation_id, user_id)
        send_resp(conn, :no_content, "")
      
      # Allow admins to remove others
      Chat.is_member?(conversation, current_user.id, "admin") ->
        Chat.remove_member_from_conversation(conversation_id, user_id)
        send_resp(conn, :no_content, "")
      
      true ->
        conn
        |> put_status(:forbidden)
        |> put_view(HermesWeb.ErrorView)
        |> render("403.json", message: "You don't have permission to remove members from this conversation")
    end
  end
end
