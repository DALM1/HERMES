defmodule Hermes.Chat.Message do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hermes.Accounts.User
  alias Hermes.Chat.{Conversation, Message, Reaction}

  schema "messages" do
    field :content, :string
    field :content_type, :string, default: "text"
    field :metadata, :map, default: %{}
    field :is_edited, :boolean, default: false
    field :edited_at, :utc_datetime
    field :is_deleted, :boolean, default: false

    belongs_to :conversation, Conversation
    belongs_to :user, User
    belongs_to :reply_to, Message, foreign_key: :reply_to_id
    has_many :replies, Message, foreign_key: :reply_to_id
    has_many :reactions, Reaction

    timestamps()
  end

  def changeset(%Message{} = message, attrs) do
    message
    |> cast(attrs, [:conversation_id, :user_id, :content, :content_type, :metadata, :reply_to_id])
    |> validate_required([:conversation_id, :content])
    |> validate_inclusion(:content_type, ["text", "image", "video", "file", "audio"])
  end

  def edit_changeset(%Message{} = message, attrs) do
    message
    |> cast(attrs, [:content, :is_edited])
    |> validate_required([:content])
    |> put_change(:is_edited, true)
    |> put_change(:edited_at, DateTime.utc_now())
  end

  def delete_changeset(%Message{} = message) do
    change(message, is_deleted: true)
  end
end