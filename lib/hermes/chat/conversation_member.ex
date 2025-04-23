defmodule Hermes.Chat.ConversationMember do
  use Ecto.Schema
  import Ecto.Changeset
  # Supprimez cette ligne ou utilisez l'alias
  # alias Hermes.Accounts.User
  alias Hermes.Chat.{Conversation, ConversationMember}

  schema "conversation_members" do
    field :role, :string, default: "member"
    field :joined_at, :utc_datetime
    field :last_read_at, :utc_datetime
    field :is_muted, :boolean, default: false
    field :is_pinned, :boolean, default: false

    belongs_to :conversation, Conversation
    belongs_to :user, Hermes.Accounts.User

    timestamps()
  end

  def changeset(%ConversationMember{} = member, attrs) do
    member
    |> cast(attrs, [:user_id, :conversation_id, :role, :joined_at, :last_read_at, :is_muted, :is_pinned])
    |> validate_required([:user_id, :conversation_id, :role, :joined_at])
    |> validate_inclusion(:role, ["admin", "member"])
    |> unique_constraint([:user_id, :conversation_id])
  end
end
