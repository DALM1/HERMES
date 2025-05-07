defmodule Hermes.Chat.Conversation do
  use Ecto.Schema
  import Ecto.Changeset
  
  schema "conversations" do
    field :name, :string
    field :description, :string
    field :is_group, :boolean, default: false
    field :type, :string, default: "direct"
    field :last_message_at, :utc_datetime
    field :is_public, :boolean, default: false  # Nouveau champ
    field :category, :string  # Nouveau champ pour catégoriser les conversations
    field :icon, :string  # Nouveau champ pour l'icône du groupe
    
    has_many :conversation_members, Hermes.Chat.ConversationMember
    has_many :users, through: [:conversation_members, :user]
    has_many :messages, Hermes.Chat.Message
    
    timestamps()
  end
  
  def changeset(conversation, attrs) do
    conversation
    |> cast(attrs, [:name, :description, :is_group, :type, :last_message_at, :is_public, :category, :icon])
    |> validate_required([:name])
  end
end