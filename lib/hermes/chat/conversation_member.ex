defmodule Hermes.Chat.ConversationMember do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hermes.Chat.Conversation
  # Add the correct alias for your User schema
  alias Hermes.Accounts.User  # Adjust this path to match your actual User schema location

  schema "conversation_members" do
    field :role, :string, default: "member"
    field :joined_at, :utc_datetime
    field :last_read_at, :utc_datetime
    field :is_muted, :boolean, default: false
    field :is_pinned, :boolean, default: false
    
    belongs_to :conversation, Conversation
    belongs_to :user, User  # This now correctly references the User schema
    
    timestamps()
  end

  def changeset(%Hermes.Chat.ConversationMember{} = member, attrs) do
    member
    |> cast(attrs, [:user_id, :conversation_id, :role, :joined_at, :last_read_at, :is_muted, :is_pinned])
    |> validate_required([:user_id, :conversation_id, :role, :joined_at])
    |> validate_inclusion(:role, ["admin", "member"])
    |> unique_constraint([:user_id, :conversation_id])
  end
end
