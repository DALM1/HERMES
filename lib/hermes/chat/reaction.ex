defmodule Hermes.Chat.Reaction do
  use Ecto.Schema
  import Ecto.Changeset
  alias Hermes.Accounts.User
  alias Hermes.Chat.{Message, Reaction}

  schema "reactions" do
    field :emoji, :string

    belongs_to :message, Message
    belongs_to :user, User

    timestamps()
  end

  def changeset(%Reaction{} = reaction, attrs) do
    reaction
    |> cast(attrs, [:message_id, :user_id, :emoji])
    |> validate_required([:message_id, :user_id, :emoji])
    |> unique_constraint([:message_id, :user_id, :emoji])
  end
end