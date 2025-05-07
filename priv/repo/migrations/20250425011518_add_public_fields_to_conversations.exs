defmodule Hermes.Repo.Migrations.AddPublicFieldsToConversations do
  use Ecto.Migration

  def change do
    alter table(:conversations) do
      add :is_public, :boolean, default: false
      add :category, :string
      add :icon, :string
    end
    
    create index(:conversations, [:is_public])
    create index(:conversations, [:category])
  end
end
