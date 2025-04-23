defmodule Hermes.Repo.Migrations.CreateConversations do
  use Ecto.Migration

  def change do
    create table(:conversations) do
      # Ajoutons les colonnes manquantes
      add :name, :string
      add :type, :string, default: "direct"
      add :description, :text
      add :is_group, :boolean, default: false
      add :last_message_at, :utc_datetime

      timestamps()
    end

    create index(:conversations, [:last_message_at])
  end
end