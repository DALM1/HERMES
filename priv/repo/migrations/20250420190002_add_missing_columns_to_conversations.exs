defmodule Hermes.Repo.Migrations.AddMissingColumnsToConversations do
  use Ecto.Migration

  def change do
    alter table(:conversations) do
      add :name, :string
      add :description, :string
      add :is_group, :boolean, default: false
      add :avatar, :string
      add :last_message_at, :utc_datetime
      add :type, :string
    end
  end
end
