defmodule Hermes.Repo.Migrations.CreateMessages do
  use Ecto.Migration

  def change do
    create table(:messages) do
      add :conversation_id, references(:conversations, on_delete: :delete_all), null: false
      add :user_id, references(:users, on_delete: :nilify_all)
      add :content, :text
      add :content_type, :string, default: "text" # "text", "image", "video", "file", "audio"
      add :metadata, :map, default: %{}
      add :is_edited, :boolean, default: false
      add :edited_at, :utc_datetime
      add :reply_to_id, references(:messages, on_delete: :nilify_all)
      add :is_deleted, :boolean, default: false

      timestamps()
    end

    create index(:messages, [:conversation_id])
    create index(:messages, [:user_id])
    create index(:messages, [:reply_to_id])
  end
end