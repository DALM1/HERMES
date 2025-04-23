defmodule Hermes.Chat.Conversation do
  use Ecto.Schema
  import Ecto.Changeset

  schema "conversations" do
    field :name, :string
    field :description, :string
    field :is_group, :boolean, default: false
    field :avatar, :string
    field :last_message_at, :utc_datetime
    field :type, :string, default: "group" # Ajout d'une valeur par défaut

    has_many :conversation_members, Hermes.Chat.ConversationMember
    has_many :messages, Hermes.Chat.Message

    timestamps()
  end

  @doc false
  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:name, :description, :is_group, :avatar, :type])
    |> validate_required([:type]) # Ce champ est requis selon l'erreur
    |> validate_inclusion(:type, ["direct", "group"]) # Validation des valeurs possibles
  end
end