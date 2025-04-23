defmodule Hermes.Repo.Migrations.CreateReactions do
  use Ecto.Migration

  def change do
    create table(:reactions) do
      add :message_id, references(:messages, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :emoji, :string, null: false

      timestamps()
    end

    create unique_index(:reactions, [:message_id, :user_id, :emoji])
    create index(:reactions, [:message_id])
    create index(:reactions, [:user_id])
  end
end